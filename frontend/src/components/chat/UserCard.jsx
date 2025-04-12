import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from "react-hot-toast";
import { hideLoader, showLoader } from '../../store/loader';
import { clearUnreadMessage, startChat } from '../../api/chat';
import { setAllChats, setSelectedUser } from '../../store/user';

const UserCard = ({ user }) => {
    const currentUser = useSelector(state => state.user.user);
    const allChats = useSelector(state => state.user.allChats);
    const selectedUser = useSelector(state => state.user.selectedUser);
    const userChat = allChats.find(item => item.members.includes(user._id));
    const [displayUnreadMessageCount, setDisplayUnreadMessageCount] = useState(0);
    const dispatch = useDispatch();

    async function handleChat() {
        if (userChat) {
            dispatch(setSelectedUser(user));
            try {
                dispatch(showLoader());
                const res = await clearUnreadMessage(userChat._id);
                if (res.status) {
                    const removeChatById = allChats.filter(item => item._id !== userChat._id)
                    dispatch(setAllChats([...removeChatById, res.data]))
                    dispatch(hideLoader());
                } else {
                    dispatch(hideLoader());
                    toast.error(res.message);
                }
            } catch (error) {
                dispatch(hideLoader());
                console.error('Error clearing unread messages:', error.message);
                toast.error(error.message);
            }
        }
    }

    function getCaptilizeName(userData) {
        let f = userData?.firstname.charAt(0).toUpperCase() + userData?.firstname.slice(1).toLowerCase();
        let l = userData?.lastname.charAt(0).toUpperCase() + userData?.lastname.slice(1).toLowerCase();
        return `${f} ${l}`;
    }

    function UserProfileName(userData) {
        return `${userData?.firstname.charAt(0).toUpperCase()} ${userData?.lastname.charAt(0).toUpperCase()}`;
    }

    async function handleChatStart() {
        const members = [currentUser._id, user._id];
        try {
            dispatch(showLoader());
            const res = await startChat(members);
            if (res.status) {
                dispatch(hideLoader());
                toast.success(res.message);
                const newChat = res.data;
                const updatedChat = [...allChats, newChat];
                dispatch(setAllChats(updatedChat));
                dispatch(setSelectedUser(user));
            } else {
                dispatch(hideLoader());
                toast.error(res.message);
            }
        } catch (error) {
            dispatch(hideLoader());
            console.error('Error starting chat:', error.message);
            toast.error(error.message);
        }
    }

    // Update unread message count without side effects in render
    useEffect(() => {
        if (userChat && userChat.lastMessage?.sender === user._id && userChat.unreadMessageCount > 0) {
            setDisplayUnreadMessageCount(userChat.unreadMessageCount);
        } else {
            setDisplayUnreadMessageCount(0);
        }
    }, [userChat, user._id]);

    return (
        <div
            className={`flex items-center gap-3 p-4 cursor-pointer overflow-hidden hover:bg-gray-100 transition ${selectedUser?._id === user._id ? "bg-gray-100" : ""}`}
            onClick={handleChat}
        >
            {user.profilePic ? (
                <img
                    src={user.profilePic}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                />
            ) : (
                <div className='text-center font-bold text-xl border-2 border-blue-500 bg-white rounded-full p-2'>
                    {UserProfileName(user)}
                </div>
            )}
            <div className="flex-1">
                <div className="font-medium text-gray-800 truncate md:max-w-[69px] overflow-hidden">
                    {getCaptilizeName(user)}
                </div>
                <div className="text-sm text-gray-500 truncate max-w-xs overflow-hidden">
                    {userChat?.lastMessage?.sender === currentUser?._id ? "You : " : ""} {userChat?.lastMessage?.text}
                </div>
            </div>
            {displayUnreadMessageCount > 0 && (
                <div className='text-white bg-blue-500 p-1 px-2 rounded-full mr-2'>
                    {displayUnreadMessageCount}
                </div>
            )}
            {!userChat && (
                <div className='bg-blue-500 rounded-md px-2 py-1 font-semibold text-blue-50' onClick={handleChatStart}>
                    Start Chat
                </div>
            )}
        </div>
    );
};

export default UserCard;

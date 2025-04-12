import React, { useEffect, useRef, useState } from 'react';
import { format, isToday, isYesterday } from "date-fns";
import { ArrowLeft } from 'react-feather';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../../store/loader';
import { getAllMassges, newMassage } from '../../api/message';

const ChatArea = ({ user, onBack, socket }) => {
    const [message, setMessage] = useState("");
    const [AllMessages, setAllMessages] = useState([])
    const currentUser = useSelector(state => state.user.user)
    const allChats = useSelector(state => state.user.allChats)
    const selectedUser = useSelector(state => state.user.selectedUser)
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch()
    function getCaptilizeName(userData) {
        let f = userData?.firstname.toUpperCase()[0] + userData?.firstname.slice(1).toLowerCase();
        let l = userData?.lastname.toUpperCase()[0] + userData?.lastname.slice(1).toLowerCase();
        return f + " " + l
    }
    function UserProfileName(userData) {
        let f = userData?.firstname.toUpperCase()[0];
        let l = userData?.lastname.toUpperCase()[0];
        return f + " " + l
    }
    async function handelSendMessage() {
        if (message === "") {
            toast("Enter Any Message...", {
                icon: '⚠️',
                style: {
                    background: 'yellow',
                    color: 'black',
                }
            })
        } else {
            const chatId = allChats.find(item => item.members.includes(user._id) && item.members.includes(currentUser._id))
            // Create an object with only the data needed for the API call.
            const messageForApi = {
                chatId: chatId._id,
                sender: currentUser._id,
                text: message
            };
            const messageForEmit = {
                ...messageForApi,
                members: chatId.members,
                read: false,
                createdAt: new Date().toISOString()
            };
            try {
                // Emit event with the extra data
                socket.emit("send-message", messageForEmit);

                // Call the API with the simpler object
                const res = await newMassage(messageForApi);
                setMessage("")
                if (res.status) {
                    toast.success(res.message);
                } else {
                    console.log(res.message)
                    toast.success(res.message)
                }
            } catch (error) {
                console.error('Login failed:', error.message);
                toast.success(error.message)
            }
        }
    }
    async function getAllMessagesData() {
        const chatId = allChats.find(item => item.members.includes(user._id) && item.members.includes(currentUser._id))
        try {
            dispatch(showLoader())
            const res = await getAllMassges(chatId._id);
            if (res.status) {
                dispatch(hideLoader())
                setAllMessages(res.data)
            } else {
                dispatch(hideLoader())
                console.log(res.message)
                toast.success(res.message)
            }
        } catch (error) {
            dispatch(hideLoader())
            console.error('Login failed:', error.message);
            toast.success(error.message)
        }
    }
    useEffect(() => {
        getAllMessagesData()
    }, [selectedUser])

    useEffect(() => {
        scrollToBottom();
    }, [AllMessages]);

    // Add socket listener for "recive-massage"
    useEffect(() => {
        socket.on("recive-massage", (message) => {
            console.log("Received socket message:", message);
            setAllMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off("recive-massage");
        };
    }, [socket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Header */}
            <div className="p-4 bg-white shadow flex items-center gap-3 border-b">
                {/* Back Button for Mobile */}
                <button className="md:hidden" onClick={onBack}>
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                {
                    user.profilePic ? <img
                        src={user.profilePic}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                    /> : <div className='text-center font-bold text-xl border-2 border-blue-500 bg-white rounded-full p-2'>
                        {UserProfileName(user)}
                    </div>
                }
                <div>
                    <div className="font-medium text-gray-800">{getCaptilizeName(user)}</div>
                    <div className="text-sm text-green-500">Online</div>
                </div>
            </div>

            {/* Chat Messages Area */}
            <div style={{ scrollbarWidth: "none" }} className="flex-1 p-4 overflow-y-auto bg-gray-100 space-y-2">
                {AllMessages.length === 0 ? (
                    <div className="text-center text-gray-400 text-sm">
                        Start chatting with <span className="font-medium text-gray-600">{user.name}</span>
                    </div>
                ) : (
                    AllMessages.map(msg => {

                        const messageDate = new Date(msg.createdAt);
                        let formattedDate;

                        if (isToday(messageDate)) {
                            formattedDate = "Today";
                        } else if (isYesterday(messageDate)) {
                            formattedDate = "Yesterday";
                        } else {
                            formattedDate = format(messageDate, "MMM d, yyyy"); // Example: Mar 9, 2025
                        }

                        const formattedTime = format(messageDate, "hh:mm a"); // Example: 10:32 AM

                        return (<div key={msg._id} className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`relative p-3 pb-6 rounded-2xl shadow-md max-w-xs min-w-32 text-sm transition-all duration-300
                    ${msg.sender === currentUser._id ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'}`}>
                                <p>{msg.text}</p>
                                <span className={`text-xs absolute bottom-1 right-2 opacity-80 ${msg.sender === currentUser._id ? 'text-gray-50' : 'text-gray-500'}`}>
                                    {formattedTime} | {formattedDate}
                                </span>
                            </div>
                        </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>



            {/* Chat Input */}
            <div className="p-4 bg-white border-t flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Type a message"
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" ? handelSendMessage() : null}
                    value={message}
                />
                <button className="bg-blue-600 text-white rounded-full px-4 py-2 font-medium" onClick={handelSendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatArea;

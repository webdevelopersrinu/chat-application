import React, { useState } from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatArea from '../components/chat/ChatArea';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUser } from '../store/user';

const ChatLayout = ({ socket }) => {
    // const [selectedUser, setSelectedUser] = useState(null);
    const dispatch = useDispatch()
    const selectedUser = useSelector(state => state.user.selectedUser)
    const handleBack = () => {
        dispatch(setSelectedUser(null));
    };

    return (
        <div className="h-screen flex">
            {/* Sidebar */}
            <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 ${selectedUser ? 'hidden md:block' : 'block'}`}>
                <Sidebar />
            </div>

            {/* Chat Area */}
            <div className={`flex-1 ${selectedUser ? 'block' : 'hidden md:block'}`}>
                {selectedUser ? (
                    <ChatArea user={selectedUser} onBack={handleBack} socket={socket} />
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Select a chat to start messaging
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatLayout;

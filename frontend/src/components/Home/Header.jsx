// src/components/Header.js
import React from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
    const userData = useSelector(state => state.user.user)
    function getCaptilizeName() {
        let f = userData?.firstname.toUpperCase()[0] + userData?.firstname.slice(1).toLowerCase();
        let l = userData?.lastname.toUpperCase()[0] + userData?.lastname.slice(1).toLowerCase();
        return f + " " + l
    }
    return (
        <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
            {/* Chat App Logo / Title */}
            <div className="flex items-center gap-1">
                <img
                    src="https://logowik.com/content/uploads/images/chat8883.jpg" // Replace with your logo URL
                    alt="Chat App Logo"
                    className="w-20"
                />
                <h1 className="text-xl font-bold text-gray-800">Chat App</h1>
            </div>

            {/* User Info - Avatar + Name */}
            <div className="flex items-center gap-3">
                <span className="text-gray-800 text-xl font-bold">{getCaptilizeName()}</span>
                <img
                    src={'https://static.vecteezy.com/system/resources/thumbnails/050/086/393/small/orange-man-profile-icon-png.png'}  // Default avatar if no profilePic
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                />
            </div>
        </header>
    );
};

export default Header;

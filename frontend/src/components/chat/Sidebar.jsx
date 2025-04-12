import React, { useState } from 'react';
import { Search } from 'react-feather';
import UserCard from './UserCard';
import { useSelector } from "react-redux"

// const users = [
//     { id: 1, name: 'John Doe', lastMessage: 'Hey, what\'s up?', profilePic: 'https://i.pravatar.cc/150?img=1' },
//     { id: 2, name: 'Jane Smith', lastMessage: 'Meeting at 5?', profilePic: 'https://i.pravatar.cc/150?img=2' },
//     { id: 3, name: 'Alex Johnson', lastMessage: 'Call me later.', profilePic: 'https://i.pravatar.cc/150?img=3' }
// ];

const Sidebar = () => {
    const [keyword, setKeyWord] = useState("")
    const users = useSelector(state => state.user.allUsers)
    const filterUsers = users.filter(user => user.firstname.toLowerCase().includes(keyword.toLowerCase()) || user.lastname.toLowerCase().includes(keyword.toLowerCase()))
        return(
            <div className="h-full flex flex-col bg-white border-r shadow-md">
                {/* Header */}
                <div className="p-4 font-semibold text-lg bg-blue-600 text-white">
                    Chat App
                </div>

                {/* Search Bar */}
                <div className="p-3 bg-gray-50 border-b">
                    <div className="flex items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                        <Search className="text-gray-500 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="ml-2 flex-1 outline-none text-sm"
                            value={keyword}
                            onChange={(e) => setKeyWord(e.target.value)}
                        />
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto">
                    {filterUsers.length > 0 ? filterUsers.map(user => (
                        <UserCard key={user._id} user={user}  keyword={keyword} />
                    )) : <div className='text-gray-700 text-xl font-bold text-center py-4'>User Not Found </div>}
                </div>
            </div>
        );
};

export default Sidebar;

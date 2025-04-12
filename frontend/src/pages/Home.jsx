import React, { useEffect } from 'react'
import Header from '../components/Home/Header'
import ChatLayout from './ChatLayout'
import { io } from "socket.io-client"
import { useSelector } from 'react-redux'

const socket = io("http://localhost:9999");

function Home() {
  const user = useSelector(state => state.user.user)
  useEffect(() => {
    // Optional: Clean up on unmount
    if (user) {
      socket.emit("join-room", user._id)
    }
  }, [user]);
  return (
    <div>
      <Header />
      <ChatLayout socket={socket} />
    </div>
  )
}

export default Home
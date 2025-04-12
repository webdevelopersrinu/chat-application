import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { getAllUsers, getLoggedUserData } from '../api/user'
import { useDispatch } from 'react-redux'
import { hideLoader, showLoader } from '../store/loader'
import { setAllChats, setAllUsers, setUser } from '../store/user'
import { getAllChats } from '../api/chat'

function ProtectedRoute({ children }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    async function getloggedInUser() {
        try {
            dispatch(showLoader())
            const res = await getLoggedUserData()
            if (res.status) {
                dispatch(hideLoader())
                dispatch(setUser(res.data))
            } else {
                dispatch(hideLoader())
                navigate("/login")
            }
        } catch (error) {
            dispatch(hideLoader())
            navigate("/login")
        }
    }
    async function getAllUserData() {
        try {
            dispatch(showLoader())
            const res = await getAllUsers()
            if (res.status) {
                dispatch(hideLoader())
                dispatch(setAllUsers(res.data))
            } else {
                dispatch(hideLoader())
                navigate("/login")
            }
        } catch (error) {
            dispatch(hideLoader())
            navigate("/login")
        }
    }
    async function getAllUserChats() {
        try {
            dispatch(showLoader())
            const res = await getAllChats()
            if (res.status) {
                dispatch(hideLoader())
                // const allChatData = res.data.map(item => item.members)
                dispatch(setAllChats(res.data))
            } else {
                dispatch(hideLoader())
                navigate("/login")
            }
        } catch (error) {
            dispatch(hideLoader())
            navigate("/login")
        }
    }
    useEffect(() => {
        if (localStorage.getItem("chatAppToken")) {
            getloggedInUser()
            getAllUserData()
            getAllUserChats()
        } else {
            navigate("/login")
        }
    }, [])
    return (
        <div>
            {children}
        </div>
    )
}

export default ProtectedRoute
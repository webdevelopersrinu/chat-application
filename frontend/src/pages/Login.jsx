// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import Input from '../components/Input'; // Reuse the same Input component from Signup page
import { Link, useNavigate } from 'react-router';
import { handleLogin } from '../api/auth';
import toast from "react-hot-toast"
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../store/loader';


const Login = () => {
    const naigate = useNavigate()
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.password.trim()) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(errors).length === 0) {
            try {
                dispatch(showLoader())
                const res = await handleLogin(formData);
                if (res.status) {
                    dispatch(hideLoader())
                    toast.success(res.message)
                    naigate("/")
                } else {
                    dispatch(hideLoader())
                    toast.error(res.message)
                }
            } catch (error) {
                dispatch(hideLoader())
                console.error('Login failed:', error.message);
                toast.error(error.message)
            }
        } else {
            console.log('Form has errors');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to ChatApp</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-600 hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;

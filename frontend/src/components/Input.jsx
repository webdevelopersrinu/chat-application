// src/components/Input.js
import React from 'react';

const Input = ({ label, type, name, value, onChange, error }) => {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default Input;

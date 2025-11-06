import React from 'react';


const Button = ({ children, onClick, variant = 'primary', type = 'button', className = '', ...props }) => {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
        success: 'bg-green-600 text-white hover:bg-green-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
    };


    return (
        <button type={type} onClick={onClick} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};


export default Button;
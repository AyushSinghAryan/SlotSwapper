import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';


const GlobalAlert = ({ a }) => {
    if (!a.visible) return null;
    const isError = a.type === 'error';
    const bgColor = isError ? 'bg-red-500' : 'bg-green-500';
    const Icon = isError ? AlertCircle : CheckCircle2;


    return (
        <div className={`fixed top-5 right-5 z-50 ${bgColor} text-white py-3 px-5 rounded-lg shadow-lg flex items-center transition-all duration-300 animate-slide-in`}>
            <Icon className="h-5 w-5 mr-3" />
            <span>{a.message}</span>
        </div>
    );
};


export default GlobalAlert;
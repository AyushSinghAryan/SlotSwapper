import React from 'react';
import { X } from 'lucide-react';


const Modal = ({ children, onClose, title }) => (
    <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in">
            <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X className="h-6 w-6" />
                </button>
            </div>
            <div className="p-6">{children}</div>
        </div>
    </div>
);


export default Modal;
import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { ArrowRightLeft } from 'lucide-react';


const OutgoingRequestItem = ({ req }) => {
    const statusConfig = {
        PENDING: { text: 'Pending', color: 'text-yellow-600', icon: <Loader2 className="h-4 w-4 animate-spin" /> },
        ACCEPTED: { text: 'Accepted', color: 'text-green-600', icon: <CheckCircle2 className="h-4 w-4" /> },
        REJECTED: { text: 'Rejected', color: 'text-red-600', icon: <AlertCircle className="h-4 w-4" /> },
    };


    const status = statusConfig[req.status] || { text: req.status, color: 'text-gray-600' };


    return (
        <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex-1 mb-4 md:mb-0">
                <p className="text-gray-700">Your request to <span className="font-semibold text-blue-600">{req.receiver.name}</span></p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                    <div className="p-2 bg-blue-100 rounded"><span className="font-medium">Your Offer:</span> {req.requesterSlot.title}</div>
                    <ArrowRightLeft className="h-4 w-4 text-gray-500" />
                    <div className="p-2 bg-green-100 rounded"><span className="font-medium">Their Slot:</span> {req.receiverSlot.title}</div>
                </div>
            </div>
            <div className={`flex items-center gap-2 font-semibold text-lg ${status.color}`}>{status.icon}<span>{status.text}</span></div>
        </div>
    );
};


export default OutgoingRequestItem;
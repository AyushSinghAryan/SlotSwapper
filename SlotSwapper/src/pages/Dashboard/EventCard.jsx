import React from 'react';
import Button from '../../components/Button';
import { Loader2 } from 'lucide-react';
import { formatDateTime } from '../../utils/formatDateTime';


const EventCard = ({ event, onUpdateStatus }) => {
    const statusColors = { BUSY: 'bg-gray-200 text-gray-800', SWAPPABLE: 'bg-blue-200 text-blue-800', SWAP_PENDING: 'bg-yellow-200 text-yellow-800' };


    return (
        <div className="bg-white p-6 rounded-lg shadow-lg space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">{event.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[event.status]}`}>{event.status.replace('_', ' ')}</span>
            </div>
            <div className="text-gray-600 space-y-1">
                <p><span className="font-medium">Start:</span> {formatDateTime(event.startTime)}</p>
                <p><span className="font-medium">End:</span> {formatDateTime(event.endTime)}</p>
            </div>
            <div className="border-t pt-4 flex gap-2">
                {event.status === 'BUSY' && <Button onClick={() => onUpdateStatus(event, 'SWAPPABLE')} variant="outline" className="w-full">Make Swappable</Button>}
                {event.status === 'SWAPPABLE' && <Button onClick={() => onUpdateStatus(event, 'BUSY')} variant="outline" className="w-full">Make Busy</Button>}
                {event.status === 'SWAP_PENDING' && <Button variant="outline" className="w-full" disabled><Loader2 className="h-4 w-4 mr-2 animate-spin" />Pending Swap...</Button>}
            </div>
        </div>
    );
};


export default EventCard;
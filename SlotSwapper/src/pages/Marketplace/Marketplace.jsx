import React, { useCallback, useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import { ArrowRightLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateTime } from '../../utils/formatDateTime';
import SwapRequestModal from './SwapRequestModal';


const Marketplace = () => {
    const [slots, setSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const { api } = useAuth();


    const fetchSlots = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await api.get('/swappable-slots');
            setSlots(data);
        } catch (error) {
            console.error('Failed to fetch swappable slots', error);
        } finally {
            setIsLoading(false);
        }
    }, [api]);


    useEffect(() => { fetchSlots(); }, [fetchSlots]);


    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Marketplace</h2>


            {isLoading ? <LoadingSpinner /> : slots.length === 0 ? (
                <p className="text-center text-gray-500">No swappable slots available right now.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slots.map((slot) => (
                        <div key={slot._id} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">{slot.title}</h3>
                            <div className="text-gray-600 space-y-1">
                                <p><span className="font-medium">Owner:</span> {slot.owner.name}</p>
                                <p><span className="font-medium">Start:</span> {formatDateTime(slot.startTime)}</p>
                                <p><span className="font-medium">End:</span> {formatDateTime(slot.endTime)}</p>
                            </div>
                            <div className="border-t pt-4"><Button onClick={() => setSelectedSlot(slot)} variant="primary" className="w-full"><ArrowRightLeft className="h-4 w-4" /><span>Request Swap</span></Button></div>
                        </div>
                    ))}
                </div>
            )}


            {selectedSlot && <SwapRequestModal theirSlot={selectedSlot} onClose={() => setSelectedSlot(null)} onSwapRequested={() => { setSelectedSlot(null); fetchSlots(); }} />}
        </div>
    );
};


export default Marketplace;
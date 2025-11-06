import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import Button from '../../components/Button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateTime } from '../../utils/formatDateTime';


const SwapRequestModal = ({ theirSlot, onClose, onSwapRequested }) => {
    const [mySlots, setMySlots] = useState([]);
    const [selectedMySlotId, setSelectedMySlotId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { api, showAlert } = useAuth();


    useEffect(() => {
        const fetchMySwappableSlots = async () => {
            setIsLoading(true);
            try {
                const data = await api.get('/events');
                setMySlots(data.filter(event => event.status === 'SWAPPABLE'));
            } catch (error) {
                console.error('Failed to fetch my swappable slots', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMySwappableSlots();
    }, [api]);


const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMySlotId) { showAlert('Please select one of your slots to offer', 'error'); return; }
    setIsSubmitting(true);
    try {
        await api.post('/swap-request', { mySlotId: selectedMySlotId, theirSlotId: theirSlot._id });
        showAlert('Swap request sent successfully!', 'success');
        onSwapRequested();
    } catch (error) {
        console.error('Failed to send swap request', error);
    } finally {
        setIsSubmitting(false);
    }
};


return (
    <Modal onClose={onClose} title="Request a Swap">
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <p className="text-gray-700">You are requesting to swap for:</p>
                <div className="mt-2 p-4 bg-gray-100 rounded-lg"><p className="font-semibold text-gray-900">{theirSlot.title}</p><p className="text-sm text-gray-600">{formatDateTime(theirSlot.startTime)}</p></div>
            </div>


            <div>
                <label htmlFor="mySlot" className="block text-sm font-medium text-gray-700">Offer one of your swappable slots:</label>
                {isLoading ? <LoadingSpinner /> : mySlots.length === 0 ? (
                    <p className="text-sm text-red-600">You have no swappable slots to offer.</p>
                ) : (
                    <select id="mySlot" value={selectedMySlotId} onChange={(e) => setSelectedMySlotId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="" disabled>Select your slot...</option>
                        {mySlots.map(slot => <option key={slot._id} value={slot._id}>{slot.title} ({formatDateTime(slot.startTime)})</option>)}
                    </select>
                )}
            </div>


            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                <Button type="submit" variant="primary" disabled={isLoading || isSubmitting || mySlots.length === 0}>{isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Send Swap Request</Button>
            </div>
        </form>
    </Modal>
);
};


export default SwapRequestModal;
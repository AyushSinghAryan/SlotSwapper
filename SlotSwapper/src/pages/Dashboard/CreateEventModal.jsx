import React, { useState } from 'react';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';


const CreateEventModal = ({ onClose, onEventCreated }) => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { api, showAlert } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (new Date(endTime) <= new Date(startTime)) {
            showAlert('End time must be after start time', 'error');
            setIsLoading(false);
            return;
        }


        try {
            await api.post('/events', { title, startTime, endTime });
            onEventCreated();
        } catch (error) {
            console.error('Failed to create event', error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <Modal onClose={onClose} title="Create New Event">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input id="startTime" type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
                    <input id="endTime" type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>


                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isLoading}>{isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Create Event</Button>
                </div>
            </form>
        </Modal>
    );
};


export default CreateEventModal;
import React, { useCallback, useEffect, useState } from 'react';
import Button from '../../components/Button';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from './EventCard';
import CreateEventModal from './CreateEventModal';

const Dashboard = () => {
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { api, showAlert } = useAuth();
const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
        const data = await api.get('/events');
        setEvents(data);
    } catch (error) {
        console.error('Failed to fetch events', error);
    } finally {
        setIsLoading(false);
    }
}, [api]);


useEffect(() => { fetchEvents(); }, [fetchEvents]);


const updateEventStatus = async (event, newStatus) => {
    try {
        const updatedEvent = await api.put(`/events/${event._id}`, { status: newStatus });
        setEvents(events.map(e => e._id === updatedEvent._id ? updatedEvent : e));
        showAlert(`Event "${event.title}" is now ${newStatus.toLowerCase()}`, 'success');
    } catch (error) {
        console.error('Failed to update event status', error);
    }
};


const onEventCreated = () => {
    setIsModalOpen(false);
    fetchEvents();
    showAlert('Event created successfully!', 'success');
};


return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">My Dashboard</h2>
            <Button onClick={() => setIsModalOpen(true)} variant="primary"><Plus className="h-5 w-5" /><span>Create Event</span></Button>
        </div>


        {isLoading ? <LoadingSpinner /> : events.length === 0 ? (
            <p className="text-center text-gray-500">You have no events. Create one to get started!</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{events.map(event => <EventCard key={event._id} event={event} onUpdateStatus={updateEventStatus} />)}</div>
        )}


        {isModalOpen && <CreateEventModal onClose={() => setIsModalOpen(false)} onEventCreated={onEventCreated} />}
    </div>
);
};


export default Dashboard;
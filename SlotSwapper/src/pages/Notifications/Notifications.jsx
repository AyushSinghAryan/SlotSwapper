import React, { useCallback, useEffect, useState } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import OutgoingRequestItem from './OutgoingRequestItem';
import { Check, X, ArrowRightLeft } from 'lucide-react';
import Button from '../../components/Button';


const Notifications = () => {
    const [incoming, setIncoming] = useState([]);
    const [outgoing, setOutgoing] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { api, showAlert } = useAuth();


    const fetchRequests = useCallback(async () => {
        setIsLoading(true);
        try {
            const [incomingData, outgoingData] = await Promise.all([
                api.get('/swap-requests/incoming'),
                api.get('/swap-requests/outgoing'),
            ]);
            setIncoming(incomingData);
            setOutgoing(outgoingData);
        } catch (error) {
            console.error('Failed to fetch swap requests', error);
        } finally {
            setIsLoading(false);
        }
    }, [api]);


useEffect(() => { fetchRequests(); }, [fetchRequests]);


const handleResponse = async (requestId, acceptance) => {
    try {
        await api.post(`/swap-response/${requestId}`, { acceptance });
        showAlert(`Request ${acceptance ? 'accepted' : 'rejected'}!`, 'success');
        fetchRequests();
    } catch (error) {
        console.error('Failed to respond to swap request', error);
    }
};


if (isLoading) return <LoadingSpinner />;


return (
    <div className="space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">My Requests</h2>


        <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Incoming Requests</h3>
            {incoming.length === 0 ? <p className="text-gray-500">You have no incoming swap requests.</p> : (
                <div className="space-y-4">{incoming.map(req => (
                    <div key={req._id} className="bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div className="flex-1 mb-4 md:mb-0">
                            <p className="text-gray-700"><span className="font-semibold text-blue-600">{req.requester.name}</span> wants to trade:</p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                                <div className="p-2 bg-blue-100 rounded"><span className="font-medium">Their Offer:</span> {req.requesterSlot.title}</div>
                                <ArrowRightLeft className="h-4 w-4 text-gray-500" />
                                <div className="p-2 bg-green-100 rounded"><span className="font-medium">Your Slot:</span> {req.receiverSlot.title}</div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => handleResponse(req._id, true)} variant="success"><Check className="h-4 w-4" /><span>Accept</span></Button>
                            <Button onClick={() => handleResponse(req._id, false)} variant="danger"><X className="h-4 w-4" /><span>Reject</span></Button>
                        </div>
                    </div>
                ))}</div>
            )}
        </section>


        <section>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Outgoing Requests</h3>
            {outgoing.length === 0 ? <p className="text-gray-500">You have not sent any swap requests.</p> : (
                <div className="space-y-4">{outgoing.map(req => <OutgoingRequestItem key={req._id} req={req} />)}</div>
            )}
        </section>
    </div>
);
};


export default Notifications;
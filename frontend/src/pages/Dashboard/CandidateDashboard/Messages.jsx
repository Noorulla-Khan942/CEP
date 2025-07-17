import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Messages = ({ candidateId }) => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        axios.get(`/api/messages/${candidateId}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error(err));
    }, [candidateId]);

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2">Messages</h2>
            {messages.length === 0 ? (
                <p>No messages yet.</p>
            ) : (
                <ul className="space-y-2">
                    {messages.map(msg => (
                        <li key={msg._id} className="border p-3 rounded bg-gray-50">
                            <p><strong>From:</strong> {msg.from}</p>
                            <p>{msg.message}</p>
                            <p className="text-sm text-gray-500">{new Date(msg.date).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Messages;
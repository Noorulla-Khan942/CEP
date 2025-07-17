import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Interviews = ({ candidateId }) => {
    const [interviews, setInterviews] = useState([]);

    useEffect(() => {
        axios.get(`/api/interviews/${candidateId}`)
            .then(res => setInterviews(res.data))
            .catch(err => console.error(err));
    }, [candidateId]);

    return (
        <div className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-2">My Interviews</h2>
            {interviews.length === 0 ? (
                <p>No interviews scheduled yet.</p>
            ) : (
                <ul>
                    {interviews.map(interview => (
                        <li key={interview._id} className="mb-2 border p-2 rounded">
                            <p><strong>Company:</strong> {interview.company}</p>
                            <p><strong>Date:</strong> {new Date(interview.date).toLocaleString()}</p>
                            <p><strong>Mode:</strong> {interview.mode}</p>
                            <p><strong>Status:</strong> {interview.status}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Interviews;

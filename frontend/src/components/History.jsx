import React from 'react';

const History = ({ history }) => {
    return (
        <div className="bg-white p-8 rounded-xl shadow-lg space-y-4 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Your Past Plans</h2>
            {history.length > 0 ? (
                history.map((rec, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg border">
                        <p className="font-semibold text-gray-600">Plan from: {new Date(rec.created_at).toLocaleString()}</p>
                        <pre className="mt-2 font-sans whitespace-pre-wrap">{rec.plan_details}</pre>
                    </div>
                ))
            ) : (
                <p>No history found. Generate a new plan to get started!</p>
            )}
        </div>
    );
};

export default History;
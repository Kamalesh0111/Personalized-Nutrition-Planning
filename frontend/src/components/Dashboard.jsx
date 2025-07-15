import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlanForm from './PlanForm';
import Result from './Result';
import History from './History';

const API_URL = 'http://localhost:5000/api';

const Dashboard = ({ token }) => {
    const [view, setView] = useState('form'); // form, result, history
    const [formData, setFormData] = useState({ age: '', weight: '', height: '', goal: 'weight_loss', diet_preference: 'non_veg', activity_level: 'sedentary' });
    const [recommendation, setRecommendation] = useState('');
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(`${API_URL}/recommendation`, formData, { headers: { Authorization: `Bearer ${token}` } });
            setRecommendation(res.data.plan);
            setView('result');
        } catch (error) {
            alert('Failed to get recommendation.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistory = async () => {
        setIsLoading(true);
        setView('history');
        try {
            const res = await axios.get(`${API_URL}/history`, { headers: { Authorization: `Bearer ${token}` } });
            setHistory(res.data);
        } catch (error) {
            alert('Failed to fetch history.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8 bg-gray-200 rounded-lg p-2">
                <button onClick={() => setView('form')} className={`w-full font-bold py-2 px-4 rounded-lg transition ${view === 'form' ? 'bg-white shadow' : ''}`}>Get New Plan</button>
                <button onClick={fetchHistory} className={`w-full font-bold py-2 px-4 rounded-lg transition ${view === 'history' ? 'bg-white shadow' : ''}`}>View History</button>
            </div>

            {isLoading && view !== 'form' && <p className="text-center">Loading...</p>}
            
            {view === 'form' && <PlanForm formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} isLoading={isLoading} />}
            {view === 'result' && <Result recommendation={recommendation} />}
            {view === 'history' && !isLoading && <History history={history} />}
        </div>
    );
};

export default Dashboard;
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const Auth = ({ onAuthSuccess }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLoginView ? '/login' : '/register';
        try {
            const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
            if (isLoginView) {
                onAuthSuccess(res.data.accessToken);
            } else {
                alert('Registration successful! Please log in.');
                setIsLoginView(true); // Switch to login view after successful registration
            }
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || 'Authentication failed.');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">{isLoginView ? 'Welcome Back' : 'Create Account'}</h2>
            {error && <p className="text-red-500 text-center mb-4 bg-red-100 p-2 rounded-lg">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-6">
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">{isLoginView ? 'Login' : 'Register'}</button>
            </form>
            <button onClick={() => setIsLoginView(!isLoginView)} className="w-full text-center mt-4 text-blue-600 hover:underline">
                {isLoginView ? 'No account? Sign up' : 'Have an account? Login'}
            </button>
        </div>
    );
};

export default Auth;
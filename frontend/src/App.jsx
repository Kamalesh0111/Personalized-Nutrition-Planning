import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'));

    const handleAuthSuccess = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <div className="bg-gray-100 min-h-screen font-sans">
            <header className="bg-white shadow-md">
                <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-600">AI Wellness Planner</h1>
                    {token && <button onClick={handleLogout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700 transition">Logout</button>}
                </nav>
            </header>

            <main className="container mx-auto px-6 py-8">
                {!token ? (
                    <Auth onAuthSuccess={handleAuthSuccess} />
                ) : (
                    <Dashboard token={token} />
                )}
            </main>
        </div>
    );
}

export default App;
import React from 'react';
import ManualMarkdownParser from './ManualMarkdownParser'; // <-- Import our new component

const Result = ({ recommendation }) => {
    if (!recommendation) return null;

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Your New Personalized Plan</h2>
            
            {/*
                This replaces the <pre> tag. It calls our custom parser
                to render the recommendation string as formatted HTML.
            */}
            <ManualMarkdownParser text={recommendation} />

        </div>
    );
};

export default Result;
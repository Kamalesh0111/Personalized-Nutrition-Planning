import React from 'react';

const ManualMarkdownParser = ({ text }) => {
    if (!text) {
        return null;
    }

    // Split the entire text block into an array of lines
    const lines = text.split('\n');

    return (
        // The `prose` classes won't work without the plugin, so we'll add some basic styling manually
        <div className="text-gray-800">
            {lines.map((line, index) => {
                
                // Rule 1: Check for Headings (###)
                if (line.startsWith('###')) {
                    // Remove the '###' and trim whitespace, then render as an <h3>
                    return (
                        <h3 key={index} className="text-xl font-bold my-4 text-center">
                            {line.replace(/###/g, '').trim()}
                        </h3>
                    );
                }

                // Rule 2: Check for Bolded Section Titles (**Title:**)
                // This regex finds text wrapped in double asterisks
                const boldMatch = line.match(/\*\*(.*?)\*\*/);
                if (boldMatch) {
                    const boldText = boldMatch[1]; // The text inside the asterisks (e.g., "Description:")
                    const remainingText = line.substring(boldMatch[0].length).trim(); // The text after
                    return (
                        <p key={index} className="mt-4 mb-2">
                            <strong className="font-semibold">{boldText}</strong>
                            {remainingText && ` ${remainingText}`}
                        </p>
                    );
                }

                // Rule 3: Check for List Items (-)
                if (line.trim().startsWith('-')) {
                    // Remove the '-' and trim whitespace, then render as a list item
                    return (
                        <li key={index} className="ml-6 list-disc">
                            {line.trim().substring(1).trim()}
                        </li>
                    );
                }

                // Rule 4: Handle empty lines for spacing
                if (line.trim() === '') {
                    return <div key={index} className="h-2"></div>; // A small empty space
                }

                // Default Rule: If no other rules match, render as a plain paragraph
                return <p key={index}>{line}</p>;
            })}
        </div>
    );
};

export default ManualMarkdownParser;
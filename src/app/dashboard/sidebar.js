import React, { useMemo } from 'react';

const LogEntry = ({ timestamp, message, type }) => (
    <div className={`p-2 border-l-4 ${type === 'error' ? 'border-red-500' : 'border-green-500'}`}>
        <span className="text-gray-500">{timestamp}</span>: <span>{message}</span>
    </div>
);

const Sidebar = ({ logs, isLogOpen, toggleLog }) => {
    // Use useMemo to sort logs only when the logs array changes
    const sortedLogs = useMemo(() => {
        return [...logs].sort((a, b) => {
            // Sort by sortTime (which includes milliseconds) in descending order
            return b.sortTime - a.sortTime;
        });
    }, [logs]);

    return (
        <div className={`fixed top-0 left-0 h-full w-80 bg-white bg-opacity-90 shadow-lg transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto ${isLogOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Connection Logs</h2>
                <div className="space-y-2">
                    {sortedLogs.map(log => (
                        <LogEntry
                            key={log.id}
                            timestamp={log.timestamp}
                            message={log.message}
                            type={log.type}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
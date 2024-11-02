"use client";
import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connectToWebSocket } from './conn';
import Sidebar from './Sidebar';

const Page = () => {
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [logs, setLogs] = useState([]);

    // Initialize car data with default values
    const initialCarData = [
        { name: "Front Car", socket: null, connectionStatus: "No Connection Established", desiredSpeed: 0, actualSpeed: 0, distanceToFront: 0, distanceToBack: 0 },
        { name: "Main Car", socket: null, connectionStatus: "No Connection Established", desiredSpeed: 0, actualSpeed: 0, distanceToFront: 0, distanceToBack: 0 },
        { name: "Back Car", socket: null, connectionStatus: "No Connection Established", desiredSpeed: 0, actualSpeed: 0, distanceToFront: 0, distanceToBack: 0 },
    ];
    const [carData, setCarData] = useState(initialCarData);

    // Clean up WebSocket connections when the component unmounts
    useEffect(() => {
        return () => {
            carData.forEach(car => car.socket && car.socket.close());
        };
    }, [carData]);

    // Add a log entry and trigger a toast notification
    const addLog = (message, type = 'info') => {
        const now = new Date();
        const newLog = {
            id: now.getTime(),
            timestamp: now.toLocaleString('en-US'),
            message,
            type,
        };
        setLogs(prevLogs => [newLog, ...prevLogs]);

        type === 'error' ? toast.error(message) : toast.info(message);
    };

    // Connect to all WebSockets for the cars
    const connectAllWebSockets = () => {
        const carUrls = [
            'ws://your-esp32-websocket-url-1',
            'ws://your-esp32-websocket-url-2',
            'ws://your-esp32-websocket-url-3',
        ];

        const updatedCarData = [...carData]; // Create a copy of car data

        carUrls.forEach((url, index) => {
            const car = updatedCarData[index]; // Get car data by index

            // Establish a WebSocket connection
            const socket = connectToWebSocket(
                url,
                status => {
                    car.connectionStatus = status; // Update status
                    addLog(`${car.name}: ${status}`, status.includes('Failed') ? 'error' : 'info');
                },
                data => handleWebSocketMessage(data, index),
                car.name
            );

            car.socket = socket; // Assign the socket to car data
        });

        setCarData(updatedCarData); // Update state once
    };    

    // Handle incoming WebSocket messages
    const handleWebSocketMessage = (data, index) => {
        const updatedCarData = [...carData];
        updatedCarData[index] = {
            ...updatedCarData[index],
            actualSpeed: data.speed,
            distanceToFront: data.distanceToFront,
            distanceToBack: data.distanceToBack,
        };
        setCarData(updatedCarData);
    };

    // Update desired speed based on slider input
    const handleSpeedChange = (index) => (e) => {
        const speed = Number(e.target.value);
        const updatedCarData = [...carData];
        updatedCarData[index].desiredSpeed = speed;
        setCarData(updatedCarData); // Update the state
    
        // Check if the WebSocket connection is open before sending
        const socket = updatedCarData[index].socket;
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ speed }));
            
        } else {
            addLog(`${updatedCarData[index].name}: Unable to send speed, connection not open`, 'error');
        }
    };
    

    // Toggle the log sidebar
    const toggleLog = () => setIsLogOpen(prev => !prev);

    return (
        <div className="relative min-h-screen">
            {/* Hamburger Menu Button */}
            <button 
                onClick={toggleLog}
                className={`fixed top-4 left-4 z-50 p-2 bg-white bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all duration-300 
                ${isLogOpen ? 'translate-x-56' : 'translate-x-0'}`}
            >
                <div className="space-y-2">
                    <span className="block w-8 h-1 bg-gray-800"></span>
                    <span className="block w-8 h-1 bg-gray-800"></span>
                    <span className="block w-8 h-1 bg-gray-800"></span>
                </div>
            </button>

            {/* Log Sidebar */}
            <Sidebar logs={logs} isLogOpen={isLogOpen} toggleLog={toggleLog} />

            <div className={`bg-gradient-to-br from-teal-400 to-blue-300 flex flex-col items-center justify-center min-h-screen transition-all duration-300 ${isLogOpen ? 'pl-80' : ''}`}>
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Capstone Project B-09</h1>

                <div className="flex flex-col items-center space-y-8 w-11/12 max-w-6xl">
                    <div className="flex space-x-8 justify-center w-full">
                        {carData.map((car, index) => (
                            <CarCard
                                key={car.name}
                                carName={car.name}
                                actualSpeed={car.actualSpeed}
                                desiredSpeed={car.desiredSpeed}
                                distanceToFront={car.distanceToFront}
                                distanceToBack={car.distanceToBack}
                                connectionStatus={car.connectionStatus}
                                handleSpeedChange={handleSpeedChange(index)} // Use specific handler for each car
                            />
                        ))}
                    </div>
                    <button onClick={connectAllWebSockets} className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300">
                        Connect All Cars
                    </button>
                </div>

                <ToastContainer />
            </div>
        </div>
    );
};

// CarCard component to display car information
const CarCard = ({ carName, actualSpeed, desiredSpeed, distanceToFront, distanceToBack, connectionStatus, handleSpeedChange }) => (
    <div className="card bg-white bg-opacity-30 rounded-lg shadow-lg p-8 w-72 h-85 flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out">
        <h2 className="text-2xl font-bold text-center mb-4">{carName}</h2>
        <div className="text-center text-6xl font-bold">
            <span>{actualSpeed}</span> <span className="text-xl">KM/H</span>
        </div>
        <input
            type="range"
            min="0"
            max="100"
            value={desiredSpeed}
            onChange={handleSpeedChange}
            className="slider w-full my-4"
        />
        <p className="text-center">
            Desired Speed: <span className="font-semibold">{desiredSpeed}</span> KM/H
        </p>
        <p className="text-lg mt-4">
            Distance to Front: <span className="font-semibold">{distanceToFront} m</span>
        </p>
        <p className="text-lg">
            Distance to Back: <span className="font-semibold">{distanceToBack} m</span>
        </p>
        <p className="text-red-500 text-center">{connectionStatus}</p>
    </div>
);

export default Page;
"use client";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connectToWebSocket } from './utils';
import Sidebar from './Sidebar';

const Page = () => {
    const [isLogOpen, setIsLogOpen] = useState(false);
    const [logs, setLogs] = useState([]);

    const [socket1, setSocket1] = useState(null);
    const [socket2, setSocket2] = useState(null);
    const [socket3, setSocket3] = useState(null);

    const [connectionStatus1, setConnectionStatus1] = useState("No Connection Established");
    const [desiredSpeed1, setDesiredSpeed1] = useState(0);
    const [actualSpeed1, setActualSpeed1] = useState(0);
    const [distanceToFront1, setDistanceToFront1] = useState(0);
    const [distanceToBack1, setDistanceToBack1] = useState(0);

    const [connectionStatus2, setConnectionStatus2] = useState("No Connection Established");
    const [desiredSpeed2, setDesiredSpeed2] = useState(0);
    const [actualSpeed2, setActualSpeed2] = useState(0);
    const [distanceToFront2, setDistanceToFront2] = useState(0);
    const [distanceToBack2, setDistanceToBack2] = useState(0);

    const [connectionStatus3, setConnectionStatus3] = useState("No Connection Established");
    const [desiredSpeed3, setDesiredSpeed3] = useState(0);
    const [actualSpeed3, setActualSpeed3] = useState(0);
    const [distanceToFront3, setDistanceToFront3] = useState(0);
    const [distanceToBack3, setDistanceToBack3] = useState(0);

    const addLog = (message, type = 'info') => {
        setLogs(prevLogs => {
            const now = new Date();
            const newLog = {
                id: now.getTime(), // Use timestamp as id for perfect sorting
                timestamp: now.toLocaleString('en-US', { 
                    year: 'numeric', 
                    month: '2-digit', 
                    day: '2-digit', 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit',
                }),
                message,
                type,
                sortTime: now.getTime() // Add a sortTime field for accurate sorting
            };
            return [newLog, ...prevLogs];
        });
    
        // Show toast notification
        if (type === 'error') {
            toast.error(message);
        } else {
            toast.info(message);
        }
    };
    
    const connectAllWebSockets = () => {
        const carUrls = [
            'ws://your-esp32-websocket-url-1',
            'ws://your-esp32-websocket-url-2',
            'ws://your-esp32-websocket-url-3',
        ];
    
        const carNames = ["Front Car", "Main Car", "Back Car"];
    
        carUrls.forEach((url, index) => {
            const carName = carNames[index];
            const socket = connectToWebSocket(
                url,
                (status) => {
                    addLog(`${carName}: ${status}`, status.includes('Failed') ? 'error' : 'info');
                    if (carName === "Front Car") setConnectionStatus1(status);
                    else if (carName === "Main Car") setConnectionStatus2(status);
                    else if (carName === "Back Car") setConnectionStatus3(status);
                },
                (data) => handleWebSocketMessage(data, 
                    index === 0 ? setActualSpeed1 : index === 1 ? setActualSpeed2 : setActualSpeed3,
                    index === 0 ? setDistanceToFront1 : index === 1 ? setDistanceToFront2 : setDistanceToFront3,
                    index === 0 ? setDistanceToBack1 : index === 1 ? setDistanceToBack2 : setDistanceToBack3,
                    setLogs, carName // Pass the car name to the log
                )
            );
    
            if (index === 0) setSocket1(socket);
            else if (index === 1) setSocket2(socket);
            else if (index === 2) setSocket3(socket);
        });
    };    

    const handleSpeedChange = (index) => (e) => {
        const speed = Number(e.target.value);
        if (index === 0) {
            setDesiredSpeed1(speed);
            socket1.send(JSON.stringify({ speed }));
        } else if (index === 1) {
            setDesiredSpeed2(speed);
            socket2.send(JSON.stringify({ speed }));
        } else if (index === 2) {
            setDesiredSpeed3(speed);
            socket3.send(JSON.stringify({ speed }));
        }
    };

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
                        <CarCard
                            carName="Front Car"
                            actualSpeed={actualSpeed1}
                            desiredSpeed={desiredSpeed1}
                            distanceToFront={distanceToFront1}
                            distanceToBack={distanceToBack1}
                            connectionStatus={connectionStatus1}
                            handleSpeedChange={handleSpeedChange(0)} // Use specific handler for each car
                        />
                        <CarCard
                            carName="Main Car"
                            actualSpeed={actualSpeed2}
                            desiredSpeed={desiredSpeed2}
                            distanceToFront={distanceToFront2}
                            distanceToBack={distanceToBack2}
                            connectionStatus={connectionStatus2}
                            handleSpeedChange={handleSpeedChange(1)} // Use specific handler for each car
                        />
                        <CarCard
                            carName="Back Car"
                            actualSpeed={actualSpeed3}
                            desiredSpeed={desiredSpeed3}
                            distanceToFront={distanceToFront3}
                            distanceToBack={distanceToBack3}
                            connectionStatus={connectionStatus3}
                            handleSpeedChange={handleSpeedChange(2)} // Use specific handler for each car
                        />
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
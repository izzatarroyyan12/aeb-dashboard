"use client";
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connectToWebSocket, handleWebSocketMessage } from './utils';

const Page = () => {
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

    const connectAllWebSockets = () => {
        connectToWebSocket(
            'ws://your-esp32-websocket-url-1',
            setConnectionStatus1,
            (data) => handleWebSocketMessage(data, setActualSpeed1, setDistanceToFront1, setDistanceToBack1),
            "Front Car"
        );

        connectToWebSocket(
            'ws://your-esp32-websocket-url-2',
            setConnectionStatus2,
            (data) => handleWebSocketMessage(data, setActualSpeed2, setDistanceToFront2, setDistanceToBack2),
            "Main Car"
        );

        connectToWebSocket(
            'ws://your-esp32-websocket-url-3',
            setConnectionStatus3,
            (data) => handleWebSocketMessage(data, setActualSpeed3, setDistanceToFront3, setDistanceToBack3),
            "Back Car"
        );
    };

    const handleSpeedChange1 = (e) => {
        setDesiredSpeed1(e.target.value);
        socket1.send(JSON.stringify({ speed: e.target.value }));
    };

    const handleSpeedChange2 = (e) => {
        setDesiredSpeed2(e.target.value);
        socket2.send(JSON.stringify({ speed: e.target.value }));
    };

    const handleSpeedChange3 = (e) => {
        setDesiredSpeed3(e.target.value);
        socket3.send(JSON.stringify({ speed: e.target.value }));
    };

    return (
        <div className="bg-gradient-to-br from-teal-400 to-blue-300 flex flex-col items-center justify-center min-h-screen">
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
                        handleSpeedChange={handleSpeedChange1}
                    />
                    <CarCard
                        carName="Main Car"
                        actualSpeed={actualSpeed2}
                        desiredSpeed={desiredSpeed2}
                        distanceToFront={distanceToFront2}
                        distanceToBack={distanceToBack2}
                        connectionStatus={connectionStatus2}
                        handleSpeedChange={handleSpeedChange2}
                    />
                    <CarCard
                        carName="Back Car"
                        actualSpeed={actualSpeed3}
                        desiredSpeed={desiredSpeed3}
                        distanceToFront={distanceToFront3}
                        distanceToBack={distanceToBack3}
                        connectionStatus={connectionStatus3}
                        handleSpeedChange={handleSpeedChange3}
                    />
                </div>
            </div>

            <button onClick={connectAllWebSockets} className="mt-6 bg-teal-400 text-black py-2 border border-blue-950 px-4 rounded hover:bg-teal-500 transition duration-300">Connect to ESP32</button>
            <ToastContainer />
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
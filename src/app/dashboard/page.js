"use client"; // Ensure this directive is at the top of the file
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Page = () => {
    const [connectionStatus, setConnectionStatus] = useState("No Connection Established");
    const [desiredSpeed1, setDesiredSpeed1] = useState(0);
    const [actualSpeed1, setActualSpeed1] = useState(0);
    const [distanceToFront1, setDistanceToFront1] = useState(0);
    const [distanceToBack1, setDistanceToBack1] = useState(0);
    
    const [desiredSpeed2, setDesiredSpeed2] = useState(0);
    const [actualSpeed2, setActualSpeed2] = useState(0);
    const [distanceToFront2, setDistanceToFront2] = useState(0);
    const [distanceToBack2, setDistanceToBack2] = useState(0);
    
    const [desiredSpeed3, setDesiredSpeed3] = useState(0);
    const [actualSpeed3, setActualSpeed3] = useState(0);
    const [distanceToFront3, setDistanceToFront3] = useState(0);
    const [distanceToBack3, setDistanceToBack3] = useState(0);
    
    let socket;
    let connectionTimeout;

    const connectWebSocket = () => {
        toast.info("Attempting to connect...", { position: "top-center" });
        setConnectionStatus("Trying to connect...");

        // Create WebSocket connection to ESP32
        socket = new WebSocket('ws://your-esp32-websocket-url');

        // Set a timeout for connection failure
        connectionTimeout = setTimeout(() => {
            if (connectionStatus === "Trying to connect...") {
                setConnectionStatus("Connection Failed");
                toast.error("Failed to connect after 5 seconds.", { position: "top-center" });
            }
        }, 5000); // 5 seconds timeout

        socket.onopen = () => {
            clearTimeout(connectionTimeout); // Clear the timeout on successful connection
            toast.success("Connection established!", { position: "top-center" });
            setConnectionStatus("Connection Established");
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // Update speeds and distances based on incoming data
            setActualSpeed1(data.speed1);
            setDistanceToFront1(data.distanceToFront1);
            setDistanceToBack1(data.distanceToBack1);
            setActualSpeed2(data.speed2);
            setDistanceToFront2(data.distanceToFront2);
            setDistanceToBack2(data.distanceToBack2);
            setActualSpeed3(data.speed3);
            setDistanceToFront3(data.distanceToFront3);
            setDistanceToBack3(data.distanceToBack3);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error: ", error);
            if (connectionStatus !== "Connection Established") {
                toast.error("WebSocket error occurred.", { position: "top-center" });
                setConnectionStatus("Connection Failed");
            }
        };

        socket.onclose = () => {
            if (connectionStatus === "Connection Established") {
                setConnectionStatus("No Connection Established");
                toast.warn("Connection closed.", { position: "top-center" });
            }
        };
    };

    const handleSpeedChange1 = (e) => {
        setDesiredSpeed1(e.target.value);
        // Send desired speed to the server here
    };

    const handleSpeedChange2 = (e) => {
        setDesiredSpeed2(e.target.value);
        // Send desired speed to the server here
    };

    const handleSpeedChange3 = (e) => {
        setDesiredSpeed3(e.target.value);
        // Send desired speed to the server here
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Capstone Project B-09</h1>
            
            {/* Container for the 3 Car Cards */}
            <div className="flex flex-col items-center space-y-8 w-11/12 max-w-6xl"> {/* Increased max-w */}
                <div className="flex space-x-8 justify-center w-full">
                    {/* Front Car Card */}
                    <div className="card bg-white rounded-lg shadow-lg p-8 w-72 h-85 flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"> {/* Increased width */}
                        <h2 className="text-2xl font-bold text-center mb-4">Front Car</h2>
                        <div className="text-center text-6xl font-bold">
                            <span id="car1-actual-speed">{actualSpeed1}</span> <span className="text-xl">KM/H</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={desiredSpeed1} 
                            onChange={handleSpeedChange1} 
                            className="slider w-full my-4" 
                            id="car1-slider" 
                        />
                        <p className="text-center">
                            Desired Speed: <span id="car1-speed" className="font-semibold">{desiredSpeed1}</span> KM/H
                        </p>
                        <p className="text-lg mt-4">
                            Distance to Front: <span id="car1-front" className="font-semibold">{distanceToFront1} m</span>
                        </p>
                        <p className="text-lg">
                            Distance to Back: <span id="car1-back" className="font-semibold">{distanceToBack1} m</span>
                        </p>
                        <p id="car1-connection-status" className="text-red-500 text-center">{connectionStatus}</p>
                    </div>

                    {/* Main Car Card */}
                    <div className="card bg-white rounded-lg shadow-lg p-10 w-96 h-100 flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"> {/* Increased width */}
                        <h2 className="text-2xl font-bold text-center mb-4">Main Car</h2>
                        <div className="text-center text-7xl font-bold"> {/* Slightly increased font size */}
                            <span id="car2-actual-speed">{actualSpeed2}</span> <span className="text-xl">KM/H</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={desiredSpeed2} 
                            onChange={handleSpeedChange2} 
                            className="slider w-full my-4" 
                            id="car2-slider" 
                        />
                        <p className="text-center">
                            Desired Speed: <span id="car2-speed" className="font-semibold">{desiredSpeed2}</span> KM/H
                        </p>
                        <p className="text-lg mt-4">
                            Distance to Front: <span id="car2-front" className="font-semibold">{distanceToFront2} m</span>
                        </p>
                        <p className="text-lg">
                            Distance to Back: <span id="car2-back" className="font-semibold">{distanceToBack2} m</span>
                        </p>
                        <p id="car2-connection-status" className="text-red-500 text-center">{connectionStatus}</p>
                    </div>

                    {/* Back Car Card */}
                    <div className="card bg-white rounded-lg shadow-lg p-8 w-72 h-85 flex flex-col items-center justify-center hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out"> {/* Increased width */}
                        <h2 className="text-2xl font-bold text-center mb-4">Back Car</h2>
                        <div className="text-center text-6xl font-bold">
                            <span id="car3-actual-speed">{actualSpeed3}</span> <span className="text-xl">KM/H</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={desiredSpeed3} 
                            onChange={handleSpeedChange3} 
                            className="slider w-full my-4" 
                            id="car3-slider" 
                        />
                        <p className="text-center">
                            Desired Speed: <span id="car3-speed" className="font-semibold">{desiredSpeed3}</span> KM/H
                        </p>
                        <p className="text-lg mt-4">
                            Distance to Front: <span id="car3-front" className="font-semibold">{distanceToFront3} m</span>
                        </p>
                        <p className="text-lg">
                            Distance to Back: <span id="car3-back" className="font-semibold">{distanceToBack3} m</span>
                        </p>
                        <p id="car3-connection-status" className="text-red-500 text-center">{connectionStatus}</p>
                    </div>
                </div>
            </div>

            <button onClick={connectWebSocket} className="mt-6 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">Connect to ESP32</button>
            <ToastContainer />
        </div>
    );
};

export default Page;
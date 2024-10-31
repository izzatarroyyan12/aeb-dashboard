let lastConnectionStatus = {}; // Track last connection status for each car

export const connectToWebSocket = (url, setStatus, handleMessage, carName) => {
    setStatus("Trying to connect...");

    const socket = new WebSocket(url);
    let retryTimeout;

    socket.onopen = () => {
        if (lastConnectionStatus[carName] !== "Connected") {
            setStatus("Connected");
            lastConnectionStatus[carName] = "Connected"; // Update last status
        }
        clearTimeout(retryTimeout); // Clear any existing retry timeout
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMessage(data, carName); // Pass carName to handleMessage for logging
    };

    socket.onerror = (error) => {
        console.error(`${carName} WebSocket error: `, error ? error : "No error object provided");
        // Only notify the user if the connection was attempted
        if (socket.readyState === WebSocket.CONNECTING) {
            setStatus("Connection Failed");
            if (lastConnectionStatus[carName] !== "Connection Failed") {
                // Removed toast error message
                lastConnectionStatus[carName] = "Connection Failed"; // Update last status
            }
        }
    };

    socket.onclose = () => {
        clearTimeout(retryTimeout);
        retryTimeout = setTimeout(() => {
            if (socket.readyState !== WebSocket.OPEN) {
                setStatus("Failed to Connect");
                if (lastConnectionStatus[carName] !== "Failed to Connect") {
                    // Removed toast error message
                    lastConnectionStatus[carName] = "Failed to Connect"; // Update last status
                }
            }
        }, 5000);
    };

    return socket;
};
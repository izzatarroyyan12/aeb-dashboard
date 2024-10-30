import { toast } from 'react-toastify';

export const connectToWebSocket = (url, setStatus, handleMessage, carName) => {
    setStatus("Trying to connect...");
    toast.info(`Attempting to connect to ${carName}`, { position: "top-center" });

    const socket = new WebSocket(url);
    let retryTimeout;

    socket.onopen = () => {
        setStatus("Connected");
        toast.success(`${carName} connected successfully!`, { position: "top-center" });
        clearTimeout(retryTimeout);
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        handleMessage(data);
    };

    socket.onerror = (error) => {
        console.error(`${carName} WebSocket error: `, error);
        setStatus("Connection Failed");
        toast.error(`${carName} WebSocket error occurred.`, { position: "top-center" });
    };

    socket.onclose = () => {
        retryTimeout = setTimeout(() => {
            if (socket.readyState !== WebSocket.OPEN) {
                setStatus("Failed to Connect");
                toast.error(`Failed to connect to ${carName} after 5 seconds`, { position: "top-center" });
            }
        }, 5000);
    };

    return socket;
};

export const handleWebSocketMessage = (data, setActualSpeed, setDistanceToFront, setDistanceToBack) => {
    setActualSpeed(data.speed);
    setDistanceToFront(data.distanceToFront);
    setDistanceToBack(data.distanceToBack);
};
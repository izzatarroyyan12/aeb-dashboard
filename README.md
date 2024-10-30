# Capstone Project B-09 Frontend Dashboard

This is a frontend web application designed to monitor and interact with the Capstone Project B-09 prototype, providing real-time updates on vehicle speeds, distances to other vehicles, and connection status. Built with **Next.js** and **Tailwind CSS**, this app creates an interactive and user-friendly dashboard for displaying key metrics and allowing the user to adjust vehicle speeds via sliders.

## Features

- **Real-Time Monitoring**: Receive real-time data on the speed, distance to the front, and distance to the back for each of the three cars (Front Car, Main Car, and Back Car).
- **WebSocket Connectivity**: Establishes a WebSocket connection to the ESP32 server, ensuring timely updates and interactive data flow.
- **Speed Control**: Adjust desired speeds for each car using the interactive sliders, with changes reflected immediately in the app.
- **Interactive UI**: Includes hover effects, animations, and toasts (using **React Toastify**) for a polished and responsive user experience.

## Technologies Used

- **Next.js**: Provides a streamlined and efficient framework for React-based development.
- **Tailwind CSS**: Ensures a modern and responsive design with utility-first CSS.
- **React Toastify**: Adds notifications to enhance user experience during connection and interaction.
- **WebSocket**: Allows for real-time data streaming from the ESP32 prototype server.
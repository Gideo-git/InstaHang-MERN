InstaHang – Social Meetup App Backend 🚀
This repository contains the backend source code for InstaHang, a real-time social meetup platform designed to connect nearby users for spontaneous hangouts. The backend is built with Node.js, Express, and MongoDB, featuring real-time communication via Socket.io.

✨ Key Features
Authentication: Secure user registration and login using JWT (JSON Web Tokens).

Profile Management: Users can view and update their profiles, including bios and profile pictures.

Geospatial Discovery: Leverages MongoDB's geospatial queries to find other users nearby within a specified radius.

Real-Time Connections: Send, receive, and accept connection requests with instant notifications.

Real-Time Chat: Private, one-on-one chat between connected users with persistent message history.

Hangout Management: Create, view, join, and manage spontaneous hangouts.

Review System: Users can leave reviews for other users after a hangout is completed.

🛠️ Tech Stack
Backend: Node.js, Express.js

Database: MongoDB with Mongoose ODM

Real-Time Communication: Socket.io

Authentication: JSON Web Token (JWT), bcrypt

APIs: Google Maps API (for location services on the client)
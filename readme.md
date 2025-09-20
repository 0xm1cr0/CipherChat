# CipherChat

**An Interactive Educational Platform for Visualizing Secure Communication & Encryption**

![SecureTalk Edu](https://img.shields.io/badge/SecureTalk-Edu-blue) ![Status](https://img.shields.io/badge/Status-Working-brightgreen) ![Node.js](https://img.shields.io/badge/Node.js-18.0%2B-green) [![Live Demo](https://img.shields.io/badge/Demo-Live%20Here-red)](https://your-deployment-link.vercel.app)

## 📖 What is This?

**SecureTalk Edu** is a visual, interactive web application designed to demonstrate fundamental cybersecurity concepts in an engaging way. It's not just a chat app; it's a **learning tool** that shows how secure connections are established (handshake) and how messages can be protected.

It is specifically built for **students, educators, and cybersecurity enthusiasts** to understand these concepts without needing to read complex theory.

## 🎯 Purpose & Goal

The main goal of this project is to **make cybersecurity concepts easy and fun to understand** through animations and interactive elements. When you use this platform, you will see and experience:

-   **How a secure connection is negotiated** between two parties (the handshake).
-   **The importance of encryption** in protecting messages.
-   **The real-time nature** of secure communication.

## 🚀 How to Use This Project (Step-by-Step)

### For Everyone (Using the Live Demo)

1.  **Downlaod the software
2.  **Open Two Tabs:** Open the same website in **two different browser tabs** (or on your phone and computer).
3.  **Join the Chat:**
    -   On Tab 1: Enter a username (e.g., `Alice`) and the password `password123`. Click **"Join Chat"**.
    -   On Tab 2: Enter a different username (e.g., `Bob`) and the same password `password123`. Click **"Join Chat"**.
4.  **Watch the Handshake:** See the animation that shows the secure connection being established between Alice and Bob.
5.  **Start Chatting:** Type a message in one tab and click **"Send"**. See it appear instantly in the other tab!
6.  **Toggle Theme:** Click the **sun/moon icon** in the top right to switch between light and dark mode.

### For Developers (Running on Your Own Computer)

**Prerequisites:** Make sure you have **Node.js** (version 18 or higher) installed on your computer.

1.  **Download the Code:**
    ```bash
    git clone https://github.com/0xm1cr0/CipherChat.git
    cd CipherChat
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *(This command downloads all the necessary software libraries the project needs to run.)*

3.  **Start the Server:**
    ```bash
    npm start
    ```
    *(You should see a message: `Server running on port 3000`)*

4.  **Open Your Browser:** Go to `http://localhost:3000` and follow the steps from the "For Everyone" section above.

## 🏗️ How It Works (Technical Overview)

This project is built with a **client-server** architecture:

-   **Server (`server.js`):** A Node.js application that uses the Express framework and Socket.IO library. It acts as a central messenger, relaying messages and connection events between all users.
-   **Client (`public/index.html`):** A single web page that contains all the HTML, CSS, and JavaScript for the user interface. It connects to the server to send and receive messages in real-time.

**The main flow:**
1.  Your browser (the client) connects to the server.
2.  When you send a message, your client tells the server to send it to another user.
3.  The server immediately relays that message to the intended recipient.
4.  The recipient's client receives the message and displays it on their screen.

## 📁 What's in the Project?

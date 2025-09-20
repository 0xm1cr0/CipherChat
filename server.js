const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

console.log('🚀 Starting SecureTalk Edu Server...');

// Create app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory storage (for demo)
let users = new Map(); // username -> user data
let connectedUsers = new Map(); // socketId -> user info
let rooms = new Map(); // roomId -> room info

// Simple DH parameters
const DH_PRIME = 2147483647;
const DH_BASE = 5;

function generatePrivateKey() {
    return Math.floor(Math.random() * 1000000) + 1;
}

function calculatePublicKey(privateKey) {
    return Math.pow(DH_BASE, privateKey) % DH_PRIME;
}

function calculateSharedSecret(otherPublicKey, privateKey) {
    return Math.pow(otherPublicKey, privateKey) % DH_PRIME;
}

// Socket handling
io.on('connection', (socket) => {
    console.log('🔌 New connection:', socket.id);
    
    socket.on('join', async (credentials) => {
        try {
            console.log('👤 Join request:', credentials.username);
            
            const { username, password } = credentials;
            
            // Basic validation
            if (!username || !password || username.length < 2 || password.length < 6) {
                socket.emit('joinError', { message: 'Invalid username or password' });
                return;
            }
            
            let isNewUser = false;
            let user = users.get(username);
            
            if (!user) {
                // Create new user
                console.log('🆕 Creating new user:', username);
                isNewUser = true;
                const passwordHash = await bcrypt.hash(password, 10);
                
                user = {
                    username: username,
                    passwordHash: passwordHash,
                    createdAt: new Date()
                };
                users.set(username, user);
            } else {
                // Verify existing user
                console.log('🔐 Verifying existing user:', username);
                const isValid = await bcrypt.compare(password, user.passwordHash);
                if (!isValid) {
                    socket.emit('joinError', { message: 'Invalid password' });
                    return;
                }
            }
            
            // Generate DH keys
            const privateKey = generatePrivateKey();
            const publicKey = calculatePublicKey(privateKey);
            
            // Store connected user
            connectedUsers.set(socket.id, {
                username: username,
                socketId: socket.id,
                dhKeys: {
                    private: privateKey,
                    public: publicKey
                }
            });
            
            console.log('✅ User authenticated:', username);
            
            socket.emit('joinSuccess', {
                username: username,
                isNewUser: isNewUser,
                publicKey: publicKey
            });
            
            // Notify other users
            const allUsers = Array.from(connectedUsers.values());
            io.emit('userListUpdate', allUsers);
            
            // Try to start handshake if 2 users
            if (allUsers.length >= 2) {
                console.log('🤝 Starting handshake between users');
                setTimeout(() => initiateHandshake(), 1000);
            }
            
        } catch (error) {
            console.error('❌ Join error:', error);
            socket.emit('joinError', { message: 'Authentication failed' });
        }
    });
    
    socket.on('sendMessage', (data) => {
        try {
            console.log('💬 Message from:', connectedUsers.get(socket.id)?.username);
            
            const sender = connectedUsers.get(socket.id);
            if (!sender) return;
            
            // Find other users and send message
            const otherUsers = Array.from(connectedUsers.entries())
                .filter(([socketId, user]) => socketId !== socket.id);
            
            otherUsers.forEach(([socketId, user]) => {
                io.to(socketId).emit('messageReceived', {
                    from: sender.username,
                    decrypted: data.message,
                    timestamp: new Date().toISOString()
                });
            });
            
            console.log('✅ Message delivered to', otherUsers.length, 'users');
            
        } catch (error) {
            console.error('❌ Send message error:', error);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('👋 User disconnected:', socket.id);
        
        const user = connectedUsers.get(socket.id);
        if (user) {
            console.log('👤 Removed user:', user.username);
            connectedUsers.delete(socket.id);
            
            // Update user list
            const allUsers = Array.from(connectedUsers.values());
            io.emit('userListUpdate', allUsers);
        }
    });
});

function initiateHandshake() {
    const allUsers = Array.from(connectedUsers.values());
    if (allUsers.length < 2) return;
    
    const user1 = allUsers[0];
    const user2 = allUsers[1];
    
    console.log('🤝 Handshake between:', user1.username, 'and', user2.username);
    
    // Step 1: Key generation
    io.emit('handshakeStep', {
        step: 1,
        description: 'Generating keys',
        user1: { username: user1.username, publicKey: user1.dhKeys.public },
        user2: { username: user2.username, publicKey: user2.dhKeys.public }
    });
    
    setTimeout(() => {
        // Step 2: Key exchange
        io.emit('handshakeStep', {
            step: 2,
            description: 'Exchanging keys',
            user1: { username: user1.username, publicKey: user1.dhKeys.public },
            user2: { username: user2.username, publicKey: user2.dhKeys.public }
        });
        
        setTimeout(() => {
            // Step 3: Shared secret
            const sharedSecret = calculateSharedSecret(user2.dhKeys.public, user1.dhKeys.private);
            
            io.emit('handshakeStep', {
                step: 3,
                description: 'Secure channel established',
                sharedSecret: sharedSecret
            });
            
            console.log('🔐 Handshake complete! Shared secret:', sharedSecret);
            
        }, 2000);
    }, 2000);
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        users: connectedUsers.size,
        timestamp: new Date().toISOString()
    });
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`
🎉 ================================
🔐 SecureTalk Edu Server Running!
🌐 URL: http://localhost:${PORT}
👥 Connected Users: 0
🚀 Ready for connections!
================================
    `);
});
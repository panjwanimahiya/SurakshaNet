require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const twilio = require('twilio');
const axios = require('axios');

// ================= WHATSAPP BUSINESS API CONFIGURATION ================= //
// Initialize Twilio using Environment Variables to securely link to WhatsApp Business
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'AC_dummy_key';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'dummy_token';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+1234567890'; // Your approved WhatsApp Number

// Initialize Twilio payload gateway
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
// ======================================================================= //

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';
const JWT_SECRET = 'suraksha_secret_key_123';

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], contacts: [], chats: [] }, null, 2));
}

// Helper to read and write DB
const readDB = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access Denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid Token' });
    req.user = user;
    next();
  });
};

// ================= AUTHENTICATION ================= //

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const db = readDB();

  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };
  db.users.push(newUser);
  writeDB(db);

  const token = jwt.sign({ id: newUser.id, name: newUser.name, email }, JWT_SECRET);
  res.json({ token, user: { name: newUser.name, email: newUser.email } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.email === email);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Incorrect password' });

  const token = jwt.sign({ id: user.id, name: user.name, email }, JWT_SECRET);
  res.json({ token, user: { name: user.name, email: user.email } });
});

// ================= EMERGENCY CONTACTS ================= //

app.get('/api/contacts', authenticateToken, (req, res) => {
  const db = readDB();
  const userContacts = db.contacts.filter(c => c.userId === req.user.id);
  res.json(userContacts);
});

app.post('/api/contacts', authenticateToken, (req, res) => {
  const { name, phone, relation } = req.body;
  const db = readDB();
  const newContact = {
    id: Date.now().toString(),
    userId: req.user.id,
    name,
    phone,
    relation
  };
  db.contacts.push(newContact);
  writeDB(db);
  res.json(newContact);
});

app.delete('/api/contacts/:id', authenticateToken, (req, res) => {
  const db = readDB();
  db.contacts = db.contacts.filter(c => c.id !== req.params.id || c.userId !== req.user.id);
  writeDB(db);
  res.json({ success: true });
});

// ================= AI COMPANION CHAT ================= //

app.get('/api/chat', authenticateToken, (req, res) => {
  const db = readDB();
  const userChats = db.chats.filter(c => c.userId === req.user.id);
  res.json(userChats);
});

app.post('/api/chat', authenticateToken, (req, res) => {
  const { messages } = req.body; // Array of message objects
  const db = readDB();
  
  // Remove old chats for this user and replace with the updated history
  db.chats = db.chats.filter(c => c.userId !== req.user.id);
  
  const savedMessages = messages.map(msg => ({ ...msg, userId: req.user.id }));
  db.chats.push(...savedMessages);
  
  writeDB(db);
  res.json({ success: true });
});

// ================= EMERGENCY SOS AUTOMATION ================= //

app.post('/api/sos', authenticateToken, async (req, res) => {
  const { locationUrl, message } = req.body;
  const db = readDB();
  const contacts = db.contacts.filter(c => c.userId === req.user.id);
  
  if (contacts.length === 0) {
    return res.status(400).json({ error: 'No emergency contacts found.' });
  }

  console.log(`\n[CRITICAL BACKGROUND SOS DISPATCH INITIATED FOR USER: ${req.user.name}]`);
  const dispatchResults = [];

  // Actual WhatsApp background dispatch
  for (const c of contacts) {
    try {
      // Force sanitize numbers to strict E.164 standard (+91)
      let rawPhone = c.phone.replace(/[^0-9]/g, "");
      const formattedPhone = rawPhone.length === 10 ? `+91${rawPhone}` : `+${rawPhone}`;

      // Dispatch via Twilio Business API (if configured)
      try {
        const response = await twilioClient.messages.create({
          body: message,
          from: `whatsapp:${TWILIO_PHONE_NUMBER}`,
          to: `whatsapp:${formattedPhone}`
        });
        console.log(`-> 🟢 TWILIO API: Successfully sent message to ${c.name}. ID: ${response.sid}`);
        dispatchResults.push({ name: c.name, status: "sent_api" });
      } catch (tErr) {
        // Log simulated success if Twilio keys are just dummies
        if (TWILIO_ACCOUNT_SID.startsWith('AC_YOUR')) {
           console.log(`-> ⚠️ Simulated dispatch to ${c.name} (Waiting for .env config)`);
           dispatchResults.push({ name: c.name, status: "simulated_success" });
        } else {
           throw tErr;
        }
      }
    } catch (err) {
      console.log(`-> ❌ Dispatch failed for ${c.name}: ${err.message}`);
      dispatchResults.push({ name: c.name, status: "failed", error: err.message });
    }
  }

  console.log(`[SOS BACKGROUND EXECUTION COMPLETED]\n`);
  res.json({ success: true, dispatchedResults: dispatchResults });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});

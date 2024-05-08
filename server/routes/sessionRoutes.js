import express from 'express';
const router = express.Router();

const sessions = {};

// Endpoint to check if the user's session is still valid
router.get('/check-session', (req, res) => {
    const sessionId = req.cookies.sid;
    if (sessionId && sessions[sessionId]) {
        res.json({ message: 'Session is active', sessionId: sessionId });
    } else {
        res.status(401).json({ message: 'Session is expired or invalid' });
    }
});

export default router;


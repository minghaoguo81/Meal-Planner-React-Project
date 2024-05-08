import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import recipeRoutes from './routes/recipeRoutes.js';
import mealPlanRoutes from './routes/mealPlanRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Determine the directory of the current file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

// Middleware to parse JSON bodies and handle cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use the routes
const sessions = {};
app.locals.sessions = sessions; 

// Helper function to validate usernames
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username) && username.toLowerCase() !== "dog";
};

// API endpoints
// Login endpoint
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  if (!isValidUsername(username)) {
    return res.status(401).json({ message: 'Username does not meet criteria' });
  }

  const sessionId = uuidv4();
  sessions[sessionId] = username;

  res.cookie('sid', sessionId, { httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'Login successful', sessionId });
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const { sid } = req.cookies;
  if (sid && sessions[sid]) {
    delete sessions[sid];
    res.clearCookie('sid');
    res.json({ message: 'Logout successful' });
  } else {
    res.status(401).json({ message: 'Session not found' });
  }
});

// Route handlers for recipes and meal plans
app.use('/api/recipes', recipeRoutes);
app.use('/api/mealplans', mealPlanRoutes);
app.use('/api', sessionRoutes);

// Serve static files and SPA fallback in production
if (process.env.NODE_ENV === 'production') {
  // Locate the dist directory in relation to this file's directory
  app.use(express.static(distDir));

  // Ensure all routes not handled by the API fallback to the SPA's entry point
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(distDir, 'index.html'));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from ${distDir}`);
});




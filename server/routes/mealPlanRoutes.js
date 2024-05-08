import express from 'express';
import recipes from './recipeStorage.js';
import mealPlans from './mealPlanStorage.js';

const router = express.Router();

// Middleware to check session
router.use((req, res, next) => {
    const { sid } = req.cookies;
    if (sid && req.app.locals.sessions[sid]) {
        req.username = req.app.locals.sessions[sid];
        // Initialize user's meal plan structure if it doesn't exist
        if (!mealPlans[req.username]) {
            mealPlans[req.username] = {
                Sunday: [], Monday: [], Tuesday: [], Wednesday: [],
                Thursday: [], Friday: [], Saturday: []
            };
        }
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

// Get the weekly meal plan
router.get('/', (req, res) => {
    const userMealPlans = mealPlans[req.username];
    const detailedMealPlans = {};
    Object.keys(userMealPlans).forEach(day => {
        detailedMealPlans[day] = userMealPlans[day].map(recipeId => {
            const recipe = recipes[req.username].find(recipe => recipe.id === recipeId);
            return recipe || { id: recipeId, name: "Recipe Deleted", ingredients: [] };
        });
    });
    res.json(detailedMealPlans);
});

// Assign a recipe to a specific day
router.post('/assign', (req, res) => {
    const { day, recipeId } = req.body;
    if (day && recipeId && mealPlans[req.username][day]) {
        if (recipes[req.username].some(recipe => recipe.id === recipeId)) {
            mealPlans[req.username][day].push(recipeId); // Store only ID
            res.status(200).json({ message: 'Recipe assigned successfully' });
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } else {
        res.status(400).json({ message: 'Invalid day or missing recipe' });
    }
});

// DELETE a recipe assignment from a specific day
router.delete('/unassign', (req, res) => {
    const { day, recipeId } = req.body;
    if (day && recipeId && mealPlans[req.username][day]) {
        const index = mealPlans[req.username][day].indexOf(recipeId);
        if (index !== -1) {
            mealPlans[req.username][day].splice(index, 1);
            res.status(200).json({ message: 'Recipe unassigned successfully' });
        } else {
            res.status(404).json({ message: 'Recipe not found in the specified day' });
        }
    } else {
        res.status(400).json({ message: 'Invalid day or recipe ID' });
    }
});

export default router;

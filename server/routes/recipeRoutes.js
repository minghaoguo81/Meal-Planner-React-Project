import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import recipes from './recipeStorage.js';
import mealPlans from './mealPlanStorage.js';

const router = express.Router();

// Middleware to check session
router.use((req, res, next) => {
    const { sid } = req.cookies;
    if (sid && req.app.locals.sessions[sid]) {
      req.username = req.app.locals.sessions[sid];
      // Initialize user's recipe list if it doesn't exist
      if (!recipes[req.username]) {
        recipes[req.username] = [];
      }
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
});

// GET all recipes for the logged-in user
router.get('/', (req, res) => {
    res.json(recipes[req.username] || []);
});

// GET a single recipe by ID
router.get('/:id', (req, res) => {
    const recipe = recipes[req.username].find(r => r.id === req.params.id);
    if (recipe) {
        res.json(recipe);
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
});

// POST a new recipe to the user's list
router.post('/', (req, res) => {
    const { name, ingredients, instructions } = req.body;
    if (!name || !ingredients || !instructions) {
        return res.status(400).json({ message: 'All fields (name, ingredients, instructions) are required' });
    }
    const newRecipe = {
        id: uuidv4(),
        name,
        ingredients,
        instructions
    };
    recipes[req.username].push(newRecipe);
    res.status(201).json(newRecipe);
});

// PUT to update an existing recipe
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { name, ingredients, instructions } = req.body;
    let found = false;
    if (name && ingredients && instructions) {
        recipes[req.username] = recipes[req.username].map(recipe => {
            if (recipe.id === id) {
                found = true;
                return { ...recipe, name, ingredients, instructions };
            }
            return recipe;
        });
    }

    if (found) {
        res.json({ message: 'Recipe updated successfully' });
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
});

// DELETE a recipe
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const userRecipes = recipes[req.username];
    const recipeIndex = userRecipes.findIndex(recipe => recipe.id === id);

    if (recipeIndex !== -1) {
        userRecipes.splice(recipeIndex, 1);
        Object.keys(mealPlans[req.username]).forEach(day => {
            const dayPlanIndex = mealPlans[req.username][day].indexOf(id);
            if (dayPlanIndex > -1) {
                mealPlans[req.username][day].splice(dayPlanIndex, 1);
            }
        });

        res.json({ message: 'Recipe deleted successfully' });
    } else {
        res.status(404).json({ message: 'Recipe not found' });
    }
});

export default router;

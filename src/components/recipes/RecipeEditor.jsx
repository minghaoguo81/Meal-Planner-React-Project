import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import '../../css/RecipeEditor.css';

const RecipeEditor = ({ recipeId, onSave, onDelete, refreshRecipes }) => {
    const [recipe, setRecipe] = useState({
        name: '',
        ingredients: '',
        instructions: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const nameInputRef = useRef(null);

    useEffect(() => {
        if (recipeId) {
            setIsLoading(true);
            api.fetchRecipe(recipeId)
                .then(data => {
                    setRecipe({ 
                        name: data.name || '',
                        ingredients: formatIngredientsToString(data.ingredients),
                        instructions: data.instructions || ''
                    });
                    setIsLoading(false);
                })
                .catch(err => {
                    setError('Failed to fetch recipe. Please try again later.');
                    setIsLoading(false);
                });
        } else {
            setRecipe({ name: '', ingredients: '', instructions: '' });
        }
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [recipeId]);

    const formatIngredientsToString = (ingredients) => {
        return ingredients.map(ing => `${ing.name} ${ing.quantity} ${ing.unit}`).join('\n');
    };

    const parseIngredients = (ingredientsString) => {
        return ingredientsString.split('\n').map(ingredient => {
            const parts = ingredient.split(' ');
            return { name: parts[0], quantity: parseFloat(parts[1]), unit: parts[2] };
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        const formattedRecipe = {
            ...recipe,
            ingredients: parseIngredients(recipe.ingredients)
        };

        const action = recipeId ? api.updateRecipe(recipeId, formattedRecipe) : api.addRecipe(formattedRecipe);

        action.then(() => {
            onSave();
            resetForm();
            setIsLoading(false);
            refreshRecipes();
        })
        .catch(err => {
            setError(`Error saving recipe: ${err.message}`);
            setIsLoading(false);
        });
    };

    const resetForm = () => {
        setRecipe({ name: '', ingredients: '', instructions: '' });
        setError('');
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            setIsLoading(true);
            api.deleteRecipe(recipeId)
                .then(() => {
                    onDelete();
                    setIsLoading(false);
                    refreshRecipes();
                })
                .catch(err => {
                    setError(`Failed to delete the recipe: ${err.message}`);
                    setIsLoading(false);
                });
        }
    };

    return (
        <div className="RecipeEditor">
            <h2>{recipeId ? 'Edit Recipe' : 'Add New Recipe'}</h2>
            {isLoading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={recipe.name}
                        onChange={handleChange}
                        required
                        ref={nameInputRef}
                    />
                </label>
                <label>
                    Ingredients (format: "name quantity unit", each on a new line):
                    <textarea
                        name="ingredients"
                        value={recipe.ingredients}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Instructions:
                    <textarea
                        name="instructions"
                        value={recipe.instructions}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit" disabled={isLoading}>Save Recipe</button>
                {recipeId && (
                    <button type="button" onClick={handleDelete} className="delete-button" disabled={isLoading}>
                        Delete Recipe
                    </button>
                )}
            </form>
        </div>
    );
};

export default RecipeEditor;

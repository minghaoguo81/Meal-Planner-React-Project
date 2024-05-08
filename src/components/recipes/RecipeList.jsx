import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import '../../css/RecipeList.css';

const RecipeList = ({ onSelectRecipe }) => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLoading(true);
        api.fetchRecipes()
            .then(data => {
                setRecipes(data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch recipes:', err);
                setError('Failed to fetch recipes');
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <p className="loading">Loading recipes...</p>;
    }

    if (error) {
        return <p className="error">Error loading recipes: {error}</p>;
    }

    if (recipes.length === 0) {
        return <p>No recipes found.</p>;
    }

    return (
        <div>
            <h2>Recipes</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.id}>
                        <button onClick={() => onSelectRecipe(recipe.id)} aria-label={`View ${recipe.name}`}>
                            {recipe.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeList;



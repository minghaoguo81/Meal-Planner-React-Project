import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import '../../css/ShoppingList.css';

const ShoppingList = () => {
    const [shoppingList, setShoppingList] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.fetchMealPlans()
            .then(mealPlans => {
                const consolidatedList = consolidateIngredients(mealPlans);
                setShoppingList(consolidatedList);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to load meal plans:', err);
                setError('Failed to load meal plans: ' + err.message);
                setIsLoading(false);
            });
    }, []);

    // Helper function to consolidate ingredients from meal plans
    const consolidateIngredients = (mealPlans) => {
        const ingredients = {};
        Object.keys(mealPlans).forEach(day => {
            mealPlans[day].forEach(meal => {
                if (!meal.ingredients || !Array.isArray(meal.ingredients)) {
                    return; // Skip this meal if ingredients are not in the expected array format
                }
                meal.ingredients.forEach(item => {
                    const { name, quantity, unit } = item;
                    if (ingredients[name]) {
                        ingredients[name].quantity += quantity; // Consolidate quantities
                    } else {
                        ingredients[name] = { quantity, unit }; // Add new ingredient
                    }
                });
            });
        });
        return ingredients;
    };

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="ShoppingList">
            <h2>Shopping List</h2>
            <ul>
                {Object.entries(shoppingList).map(([ingredient, details]) => (
                    <li key={ingredient}>{ingredient}: {details.quantity} {details.unit}</li>
                ))}
            </ul>
        </div>
    );
};

export default ShoppingList;


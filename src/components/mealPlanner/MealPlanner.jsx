import React from 'react';
import { api } from '../../services/api';

const MealPlanner = ({ mealPlans, refreshMealPlans }) => {
    const handleUnassignRecipe = (day, recipeId) => {
        api.unassignRecipeFromDay(day, recipeId)
            .then(() => {
                refreshMealPlans(); // Update the view to reflect the unassignment
            })
            .catch(err => {
                console.error(`Failed to unassign recipe: ${err.message}`);
            });
    };

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className="meal-planner">
            <h1>Weekly Meal Planner</h1>
            {daysOfWeek.map(day => (
                <div key={day} className="day">
                    <h3>{day}</h3>
                    <ul>
                        {mealPlans[day] && mealPlans[day].length > 0 ? (
                            mealPlans[day].map((recipe, index) => (
                                <li key={index}>
                                    {recipe.name}
                                    <button onClick={() => handleUnassignRecipe(day, recipe.id)}>Unassign</button>
                                </li>
                            ))
                        ) : (
                            <p>No meals planned for {day}.</p>
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MealPlanner;


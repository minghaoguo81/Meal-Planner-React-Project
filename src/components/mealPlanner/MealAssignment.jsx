import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import '../../css/MealAssignment.css';

const MealAssignment = ({ recipes, onSave, onAssignmentComplete }) => {
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [selectedDay, setSelectedDay] = useState('Sunday');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (recipes.length === 0) {
            setError('No recipes available to assign. Please add some recipes first.');
        }
    }, [recipes]);

    const handleAssign = () => {
        if (!selectedRecipe) {
            setError('No recipe selected');
            return;
        }

        setIsLoading(true);
        api.assignRecipeToDay(selectedDay, selectedRecipe)
            .then(() => {
                if (typeof onSave === "function") {
                    onSave();  // Refresh meal plans upon successful assignment
                }
                setIsLoading(false);
                setError('');
                onAssignmentComplete();
            })
            .catch(err => {
                setError(`Failed to assign recipe: ${err.message}`);
                console.error('Assignment Error:', err);
                setIsLoading(false);
            });
    };

    return (
        <div className="MealAssignment">
          <h2>Assign Recipe to Day</h2>
          {error && <p className="error">{error}</p>}
          <div className="assignment-fields">
            <div className="field-container">
              <label htmlFor="day-of-week">Day of the Week:</label>
              <select
                id="day-of-week"
                value={selectedDay}
                onChange={e => setSelectedDay(e.target.value)}
              >
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div className="field-container">
              <label htmlFor="recipe-selection">Choose a Recipe:</label>
              <select
                id="recipe-selection"
                value={selectedRecipe}
                onChange={e => setSelectedRecipe(e.target.value)}
              >
                <option value="">Select a Recipe</option>
                {recipes.map(recipe => (
                  <option key={recipe.id} value={recipe.id}>{recipe.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={handleAssign} disabled={!selectedRecipe}>Assign</button>
          {isLoading && <p className="loading">Loading...</p>}
        </div>
    );
};

export default MealAssignment;



import React, { useState, useEffect } from 'react';
import RecipeList from './recipes/RecipeList';
import RecipeEditor from './recipes/RecipeEditor';
import MealPlanner from './mealPlanner/MealPlanner';
import MealAssignment from './mealPlanner/MealAssignment';
import ShoppingList from './shoppingList/ShoppingList';
import { api } from '../services/api';
import '../css/Dashboard.css';

const Dashboard = ({ onLogout }) => {
    const [recipes, setRecipes] = useState([]);
    const [mealPlans, setMealPlans] = useState({});
    const [editRecipeId, setEditRecipeId] = useState(null); // ID of the recipe being edited
    const [isAddingNew, setIsAddingNew] = useState(false); // Flag to indicate adding a new recipe
    const [isAssigningMeal, setIsAssigningMeal] = useState(false); // State to indicate meal assignment view
    const [showShoppingList, setShowShoppingList] = useState(false);

    useEffect(() => {
      refreshRecipes();
      refreshMealPlans();
    }, []);

    const refreshRecipes = () => {
      api.fetchRecipes()
          .then(data => {
              setRecipes(data);
          })
          .catch(error => {
              console.error('Error loading recipes:', error);
          });
    };

    const refreshMealPlans = () => {
      api.fetchMealPlans()
          .then(data => {
              setMealPlans(data);
          })
          .catch(error => {
              console.error('Error loading meal plans:', error);
          });
    };

    const handleLogout = () => {
        api.logout()
            .then(() => {
                onLogout();
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
    };

    const handleSave = () => {
      refreshRecipes();
      refreshMealPlans(); // Refresh the meal plans to reflect the updated recipes
      handleBackToDashboard();
    };
  
    const handleDelete = () => {
      refreshRecipes();
      refreshMealPlans(); // Refresh the meal plans to reflect the deleted recipe
      handleBackToDashboard();
    };

    const handleBackToDashboard = () => {
      setIsAddingNew(false);
      setIsAssigningMeal(false);
      setShowShoppingList(false);
      setEditRecipeId(null);
    };

    return (
      <div className="dashboard-container">
          <h1>Meal Planner Dashboard</h1>
          {(!isAddingNew && !isAssigningMeal && !showShoppingList) && (
              <div className="button-container">
                  <button onClick={() => setIsAddingNew(true)} className="dashboard-button add-recipe-button">
                      Add New Recipe
                  </button>
                  <button onClick={() => setIsAssigningMeal(true)} className="dashboard-button assign-meal-button">
                      Assign Meals
                  </button>
                  <button onClick={() => setShowShoppingList(true)} className="dashboard-button shopping-list-button">
                      Generate Shopping List
                  </button>
              </div>
          )}
          {(isAddingNew || isAssigningMeal || showShoppingList) && (
              <button onClick={handleBackToDashboard} className="dashboard-button back-button">
                  Back to Dashboard
              </button>
          )}
          <div className="content-container">
              {isAddingNew && (
                  <RecipeEditor
                      recipeId={editRecipeId}
                      onSave={handleSave}
                      onDelete={handleDelete}
                      refreshRecipes={refreshRecipes}
                  />
              )}
              {isAssigningMeal && (
                  <MealAssignment
                      recipes={recipes}
                      onSave={refreshMealPlans}
                      onAssignmentComplete={handleBackToDashboard}
                  />
              )}
              {showShoppingList && <ShoppingList />}
              {!isAddingNew && !isAssigningMeal && !showShoppingList && (
                  <>
                      <div className="content-section recipe-list-section">
                          <RecipeList onSelectRecipe={(id) => { setEditRecipeId(id); setIsAddingNew(true); }} recipes={recipes} />
                      </div>
                      <div className="content-section meal-planner-section">
                          <MealPlanner mealPlans={mealPlans} refreshMealPlans={refreshMealPlans} />
                      </div>
                  </>
              )}
          </div>
          <button onClick={handleLogout} className="dashboard-button logout-button">
              Logout
          </button>
      </div>
  );
};

export default Dashboard;


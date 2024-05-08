const BASE_URL = '/api';

// Helper function to process response and handle errors
function processResponse(response) {
  if (!response.ok) {
      // If the response is not okay, attempt to parse it as JSON to get error message
      return response.json().then(data => {
          throw new Error(data.message || 'An unexpected error occurred');
      });
  }
  return response.json();
}

// Function to handle network errors
function handleError(error) {
  console.error("Network error:", error);
  throw error;
}

export const checkSession = () => {
  return fetch(`${BASE_URL}/check-session`, {
    method: 'GET',
    credentials: 'include',
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Session check failed');
    }
    return response.json();
  })
  .catch(error => {
    console.error("Error checking session:", error);
    throw error;
  });
};

// Authentication APIs
export const login = (username) => {
  return fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  }).then(processResponse).catch(handleError);
};

export const logout = () => {
  return fetch(`${BASE_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  }).then(processResponse).catch(handleError);
};

// Recipe APIs
export const fetchRecipes = () => {
  return fetch(`${BASE_URL}/recipes`, {
      method: 'GET',
      credentials: 'include',
      headers: {
          'Accept': 'application/json',
      },
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Failed to fetch recipes');
      }
      return response.json();
  })
  .catch(error => {
      console.error('Error loading recipes:', error);
      throw error; 
  });
};

export const fetchRecipe = (id) => {
  return fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'GET',
    credentials: 'include',
  }).then(processResponse).catch(handleError);
};

export const addRecipe = (recipe) => {
  return fetch(`${BASE_URL}/recipes`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(recipe),
  })
  .then(response => {
      if (!response.ok) {
          return response.text().then(text => {
              try {
                  const data = JSON.parse(text);
                  throw new Error(data.message || 'Unknown error during add');
              } catch {
                  throw new Error(text);
              }
          });
      }
      return response.json();
  })
  .catch(error => {
      console.error('Error saving recipe:', error);
      throw error;
  });
};

export const updateRecipe = (id, recipe) => {
  const url = `${BASE_URL}/recipes/${id}`;
  return fetch(url, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(recipe),
  })
  .then(processResponse)
  .catch(handleError);
};

export const deleteRecipe = (id) => {
  return fetch(`${BASE_URL}/recipes/${id}`, {
      method: 'DELETE',
      credentials: 'include',
  })
  .then(response => {
      if (!response.ok) {
          // Transform response into text to see if there's a custom message
          return response.text().then(text => {
              try {
                  const data = JSON.parse(text);
                  throw new Error(data.message || 'Failed to delete the recipe');
              } catch {
                  throw new Error(text);
              }
          });
      }
      return response.json();
  })
  .catch(error => {
      console.error('Error deleting recipe:', error);
      throw error;
  });
};

// Meal Plan APIs
export const fetchMealPlans = () => {
  return fetch(`${BASE_URL}/mealplans`, {
    method: 'GET',
    credentials: 'include',
  }).then(processResponse).catch(handleError);
};

export const updateMealPlan = (plan) => {
  return fetch(`${BASE_URL}/mealplans`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ plan }),
  }).then(processResponse).catch(handleError);
};

export const assignRecipeToDay = (day, recipeId) => {
  return fetch(`${BASE_URL}/mealplans/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ day, recipeId }),
  })
  .then(processResponse).catch(handleError);
};

export const unassignRecipeFromDay = (day, recipeId) => {
  return fetch(`${BASE_URL}/mealplans/unassign`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ day, recipeId }),
  })
  .then(processResponse).catch(handleError);
};

export const api = {
  checkSession,
  login,
  logout,
  fetchRecipes,
  fetchRecipe,
  addRecipe,
  updateRecipe,
  deleteRecipe,
  fetchMealPlans,
  updateMealPlan,
  assignRecipeToDay,
  unassignRecipeFromDay
};

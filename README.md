# Meal Planner

## Description
The Meal Planner is a full-stack web application designed to help users manage their weekly meal planning more efficiently. It allows users to add, edit, and delete recipes, assign recipes to specific days of the week, and generate a shopping list based on the recipes and its ingredients included the week's meal plan. This project combines a React-based front end with an Express-based NodeJS server to handle RESTful API calls.

## Features
- **Manage Recipes**: Users can add new recipes, edit existing ones, and delete them.
- **Assign Meals**: Assign recipes to specific days of the week to organize meal planning.
- **Generate Shopping List**: Automatically generate a shopping list based on the meals planned for the week.
- **Authentication**: Simple authentication step to access the dashboard.

## How to Use
1. **Starting the Application**:
   - Clone the repository and navigate to the project directory.
   - Run `npm install` to install dependencies.
   - Run `npm run build` to build the production version of the application.
   - Run `npm start` to start the server and serve the application.

2. **Using the Dashboard**:
   - Log in with username to access the dashboard.
   - Use the "Add New Recipe" button to create a new recipe.
   - Use the "Assign Meals" button to assign recipes to specific days.
   - Use the "Generate Shopping List" button to see a list of ingredients needed for the week's meals.
   - Recipes can be edited or deleted from the "Recipes" section.
   - Assigned meals can be modified from the "Weekly Meal Planner" section by unassigning or reassigning different recipes.

## Technologies Used
- **Frontend**: React, Vite
- **Backend**: Node.js, Express
- **Other Libraries**: uuid

## External Media
- No external images or media were used in this project.

## Security
- This project includes an authentication system to check valid usernames that can log in but no authentication to check password occurs.
- Checks are in place to make sure that operations such as adding, updating, or deleting recipes are authorized.


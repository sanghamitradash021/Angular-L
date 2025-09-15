# 🍳 Recipe Hub - Angular Frontend

Welcome to the frontend for Recipe Hub, a modern, interactive platform for sharing and discovering culinary creations. This application is built with the Angular framework and styled with Tailwind CSS.

## ✨ Features

- **Dynamic User Experience**: A fast, responsive, and modern single-page application (SPA) architecture.
- **Component-Based UI**: A clear separation of concerns with reusable UI components for modals, navigation, and more.
- **Reactive Forms**: Robust and scalable forms for user login, signup, and recipe creation/editing.
- **Protected Routes**: Secure navigation using route guards to protect user-specific pages like "My Recipes".
- **Centralized State Management**: Services manage application state, handling everything from user authentication to recipe data.
- **Centralized Error Handling**: An `HttpInterceptor` gracefully handles all API errors, providing consistent error feedback.

---

## 🛠️ Tech Stack

- **Framework**: Angular
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Angular Services with Signals and RxJS
- **Forms**: Angular Reactive Forms
- **HTTP Client**: Angular `HttpClient`
- **Testing**: Karma & Jasmine
- **Logging**: `ngx-logger`
- **Code Quality**: ESLint & Prettier

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher is recommended.
- **Angular CLI**: Make sure the Angular CLI is installed globally (`npm install -g @angular/cli`).
- **Backend Server**: Ensure the Node.js backend server is running on `http://localhost:3000`.

### Installation

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the frontend directory**:
    ```bash
    cd recipe-app
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```

### Running the Application

1.  **Start the development server**:
    ```bash
    ng serve
    ```
2.  Open your browser and navigate to `http://localhost:4200`. The application will automatically reload if you change any of the source files.

---

## 📜 Available Scripts

-   `npm start` or `ng serve`: Runs the app in development mode.
-   `npm run build`: Builds the app for production to the `dist/` folder.
-   `npm test`: Runs the unit tests with Karma.
-   `npm run lint`: Lints the code to check for style and quality issues.
-   `npm run format`: Formats the entire codebase using Prettier.

---

## 📁 Project Structure

The application code is located in the `src/app` directory and is organized as follows:

-   **/components**: Reusable, "dumb" components that are used across the application (e.g., `navbar`, `edit-recipe-modal`).
-   **/guards**: Route guards to protect routes from unauthorized access.
-   **/interceptors**: HTTP interceptors for handling requests and responses globally (e.g., `error.interceptor.ts`).
-   **/models**: TypeScript interfaces for data structures like `Recipe` and `User`.
-   **/page**: "Smart" container components that represent a full page or a major feature (e.g., `home`, `my-recipes`).
-   **/service**: Services responsible for business logic, state management, and API calls.




# 👨‍💻 Recipe Hub Frontend - Developer Guide

This document outlines the architecture, conventions, and best practices for developing and contributing to the Recipe Hub frontend.

## 🏛️ Core Architecture & Concepts

This application follows modern Angular best practices, focusing on a clean separation of concerns and a component-based architecture.

### 1. Component Architecture

We distinguish between two types of components:

-   **Container Components (Pages)**: Located in `src/app/page`, these are "smart" components responsible for fetching data, managing state, and connecting services to the UI. They represent entire pages (e.g., `MyRecipesComponent`).
-   **Presentational Components**: Located in `src/app/components`, these are "dumb" components that receive data via `@Input()` and emit events via `@Output()`. They are highly reusable and are not aware of the application's state (e.g., `EditRecipeModalComponent`). All presentational components use **`OnPush` change detection** for optimal performance.

### 2. Services and State Management

-   **Responsibility**: Services in `src/app/service` are the single source of truth for the application's state and business logic.
-   **`AuthService`**: Manages user authentication state, JWTs, and the current user's information using Angular **Signals**. This allows for highly efficient, reactive updates in components like the `NavbarComponent`.
-   **`RecipeService`**: Handles all API interactions related to recipes (fetching, creating, updating, deleting). It uses Angular's `HttpClient` and returns **Observables** (from RxJS) for handling asynchronous operations.
-   **`RecipeEventsService`**: A simple, powerful event bus using RxJS `Subject`s. It allows decoupled components to communicate. For example, when a recipe is updated in the `EditRecipeModalComponent`, this service emits an event that the `MyRecipesComponent` listens to in order to refresh its list.

### 3. Routing and Navigation

-   **Configuration**: All application routes are defined in `src/app/app.routes.ts`.
-   **Route Guards**: The `authGuard` in `src/app/guards` protects routes that require a user to be logged in. It checks the authentication status via the `AuthService` and redirects unauthenticated users to the login page.

### 4. API Integration & Error Handling

-   **`HttpClient`**: All API calls are made through Angular's `HttpClient` module within our services.
-   **`HttpInterceptor`**: The `error.interceptor.ts` intercepts *all* outgoing HTTP requests. If a request fails, this interceptor centrally handles the error, logs it using `ngx-logger`, and ensures that no API call fails silently.

### 5. Styling with Tailwind CSS

-   The project uses **Tailwind CSS** for styling.
-   Global base styles and Tailwind imports are configured in `src/styles.css`.
-   Components are styled directly in their HTML templates using Tailwind's utility classes. This approach keeps styles co-located with their components and makes styling rapid and consistent.

### 6. Forms and Validation

-   We exclusively use **Angular Reactive Forms**.
-   Forms for login, signup, and recipe management are defined within their respective components using `FormBuilder`.
-   Validators (`Validators.required`, `Validators.minLength`, etc.) are used to ensure data integrity before submission.

---

## 🧪 Testing

-   **Frameworks**: We use **Jasmine** as the testing framework and **Karma** as the test runner.
-   **Location**: Unit tests for any file (`.ts`) are located in a sibling file with a `.spec.ts` extension.
-   **Mocks**: Services are mocked in the test files to isolate the component under test and to simulate API responses or service states.

---

## workflow-example-adding-a-new-feature">⚙️ Workflow: Adding a New Feature (e.g., "Favorite Recipes" Page)

1.  **Create the Component**:
    ```bash
    ng generate component page/favorite-recipes
    ```

2.  **Define the Route**:
    -   In `app.routes.ts`, add a new route for your component and protect it with the `authGuard`.
    ```typescript
    {
      path: 'favorites',
      component: FavoriteRecipesComponent,
      canActivate: [authGuard]
    }
    ```

3.  **Update the Service**:
    -   Add a new method to `RecipeService` to fetch favorite recipes from the backend.
    ```typescript
    getFavoriteRecipes(userId: number): Observable<Recipe[]> {
      return this.http.get<Recipe[]>(`${this.apiUrl}/favorites/${userId}`);
    }
    ```

4.  **Implement the Component**:
    -   Inject the `RecipeService` and `AuthService` into `FavoriteRecipesComponent`.
    -   In `ngOnInit`, get the current user's ID and call the new service method to fetch the data.
    -   Use the `async` pipe in your template or subscribe to the observable to display the recipes.

5.  **Write Unit Tests**:
    -   In `favorite-recipes.spec.ts`, write tests to ensure the component correctly calls the service and renders the data.
    -   Use a `MockRecipeService` to provide mock data for your tests.
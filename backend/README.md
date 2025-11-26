# Backend Service

This is a Node.js Express application that serves as the backend for the SocialDev project. It provides an API to fetch YouTube channel uploads and exposes Prometheus metrics.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/)

## Local Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the `backend` directory by copying the example file:
    ```sh
    cp .env.example .env
    ```
    Update the `.env` file with the correct values. The `N8N_UPLOADS_URL` must point to your running n8n instance's webhook URL.

4.  **Run the development server:**
    The server will start on the port specified in your `.env` file (defaults to 3001).
    ```sh
    npm run dev
    ```

## Scripts

-   `npm run dev`: Starts the application in development mode with `nodemon`, which automatically restarts the server on file changes.
-   `npm test`: Runs the automated tests using Jest.

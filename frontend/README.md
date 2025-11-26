# Frontend Service

This is a [Next.js](https://nextjs.org/) application that serves as the user-facing interface for the SocialDev project. It allows users to view YouTube channel videos, track progress, and take notes.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/)

## Local Setup

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up environment variables:**
    This project requires environment variables to connect to the backend API. Create a `.env.local` file in the `frontend` directory:
    ```sh
    touch .env.local
    ```
    Add the following variables to the file. For local development with `docker-compose`, the backend is typically available at `http://localhost:3001`.

    ```env
    NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
    ```

4.  **Run the development server:**
    The server will start on `http://localhost:3000`.
    ```sh
    npm run dev
    ```

## Environment Variables

| Variable                   | Description                                                                                                   | Default                               |
| -------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `NEXT_PUBLIC_API_BASE_URL` | The public URL for the backend API, used for client-side requests.                                            | `http://api.localhost`                |
| `API_BASE_URL_INTERNAL`    | The internal network URL for the backend API, used for server-side rendering (SSR). Falls back to `API_BASE_URL`. | `NEXT_PUBLIC_API_BASE_URL` value      |
| `NEXT_PUBLIC_DOMAIN`       | The root domain, used to construct default API and n8n URLs if they are not explicitly set.                     | `localhost`                           |
| `NEXT_PUBLIC_N8N_BASE_URL` | The base URL for the n8n service.                                                                             | `http://n8n.localhost`                |

## Available Scripts

-   `npm run dev`: Starts the application in development mode on `http://localhost:3000`.
-   `npm run build`: Creates a production-ready build of the application.
-   `npm start`: Starts the production server. Requires a build to be created first.
-   `npm run lint`: Lints the code using Next.js's built-in ESLint configuration.
-   `npm test`: Runs the automated tests using Jest.
-   `npm run typecheck`: Runs the TypeScript compiler to check for type errors.
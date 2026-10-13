# macOS Portfolio

A web-based simulation of the macOS interface, serving as a personal portfolio. It features working apps like Calculator, Notes, Terminal, and a functional Mail app that sends real emails.

## Project Structure

- **root**: `index.html` is the frontend entry point; `vite.config.mjs` and `vercel.json` configure building and deployment.
- **javascript/** and **Css/**: Desktop behavior, app modules, styles, and calculator tests.
- **icon/**, **images/**, **background/**, **cursor/**, **fonts/**, and **music/**: Runtime assets.
- **api/** and **backend/**: Vercel serverless entry point and Express Mail API.
- **design-references/**: Tracked design material, separate from runtime assets.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd portfolio
    ```

2.  **Setup Project**:
Run this command to install frontend and backend dependencies and build the frontend:
    ```bash
    npm run setup
    ```

3.  **Setup Environment Variables**:
Copy `backend/.env.example` to `backend/.env`, then fill in your own values:
    ```env
    EMAIL_USER=your-email@example.com
    EMAIL_PASS=your-app-specific-password
    EMAIL_RECEIVER=recipient@example.com
    ```
    *Note: For Gmail, you must use an "App Password", not your login password.*

## Running Locally

To run the full experience, start the API and Vite in separate terminals.

1.  **Start the Backend**:
    Open a terminal:
    ```bash
    cd backend
    npm start
    ```
    *Server starts on http://localhost:3001.*

2.  **Start the Frontend**:
    ```bash
    npm run dev
    ```
    *Open http://localhost:5174. Vite proxies `/api` to the backend.*

## Deployment (Vercel)

This project is configured to deploy easily on Vercel.

1.  **Push to GitHub**.
2.  **Import to Vercel**:
    - Select your repository.
    - Leave the "Root Directory" as `./`.
   - `vercel.json` routes API requests to `api/index.js`.
3.  **Environment Variables**:
    - In the Vercel Project Settings, add the same environment variables as your local `.env` (`EMAIL_USER`, `EMAIL_PASS`, etc.).
4.  **Deploy**: 
    - Click Deploy. Your site will be live, and the contact form will function correctly via the serverless backend.

## Troubleshooting

- **Email not sending?**
  - Check the backend console (or Vercel logs) for errors.
  - Ensure your App Password is correct.
  - Verify that the frontend can reach the API at `localhost:3001` locally or `/api/` in deployment.

## Verification

Run `npm test` for calculator tests and `npm run build` for the production frontend. The output is generated in `dist/` and is ignored by Git. Both npm lockfiles and the Bun lockfiles are retained for reproducible installation with either package manager.

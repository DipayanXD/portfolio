# macOS Portfolio

A web-based simulation of the macOS interface, serving as a personal portfolio. It features working apps like Calculator, Notes, Terminal, and a functional Mail app that sends real emails.

## Project Structure

- **root**: Contains the main `index.html` and core logic (`javascript/script.js`, `Css/style.css`).
- **backend/**: An Express.js server that handles email dispatching using Nodemailer.
- **background-live/**: A Vite + React application (likely for dynamic backgrounds).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

1.  **Clone the repository**:
    ```bash
    git clone <your-repo-url>
    cd portfolio
    ```

2.  **Setup Project**:
    Run this command to install all dependencies (frontend & backend) and build the background:
    ```bash
    npm run setup
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the `backend/` directory with the following:
    ```env
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-app-specific-password
    EMAIL_RECEIVER=your-email@gmail.com
    ```
    *Note: For Gmail, you must use an "App Password", not your login password.*

## Running Locally

To run the full experience, you need to start the backend server and serve the frontend.

1.  **Start the Backend**:
    Open a terminal:
    ```bash
    cd backend
    npm start
    ```
    *Server will start on http://localhost:3000*

2.  **Start the Frontend**:
    - You can use the **Live Server** extension in VS Code to open `index.html`.
    - Or run a simple HTTP server in the root directory:
      ```bash
      npx serve .
      ```
    *Access the site at http://localhost:5500 (or whatever port your server uses).*

## Deployment (Vercel)

This project is configured to deploy easily on Vercel.

1.  **Push to GitHub**.
2.  **Import to Vercel**:
    - Select your repository.
    - Leave the "Root Directory" as `./`.
    - The configuration in `vercel.json` will automatically handle the backend routing.
3.  **Environment Variables**:
    - In the Vercel Project Settings, add the same environment variables as your local `.env` (`EMAIL_USER`, `EMAIL_PASS`, etc.).
4.  **Deploy**: 
    - Click Deploy. Your site will be live, and the contact form will function correctly via the serverless backend.

## Troubleshooting

- **Email not sending?**
  - Check the backend console (or Vercel logs) for errors.
  - Ensure your App Password is correct.
  - Verify that the frontend is calling the right API URL (it auto-detects between `localhost:3000` and relative path `/api/`).

# SmartStock

A full-stack inventory management dashboard built with **React** and **Node.js/Express**.

SmartStock provides a centralized dashboard for monitoring inventory information and presenting stock-related insights through a clean and responsive interface.

## Features

* Inventory dashboard
* Overview of inventory statistics
* Stock-related recommendations and alerts
* Transaction/activity table
* Frontend and backend communication through REST APIs
* Responsive React-based user interface
* Express.js backend for handling API requests

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Lucide React
* CSS

### Backend

* Node.js
* Express.js
* REST API

### Development Tools

* Git
* GitHub
* VS Code

## Project Architecture

The application follows a client-server architecture:

The React frontend communicates with the Express backend through HTTP requests. The backend processes the requests and returns data that is displayed in the dashboard.

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm
* Git

### Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd smartstock
```

### Install frontend dependencies

```bash
cd client
npm install
```

### Start the frontend

```bash
npm run dev
```

The React application will be available at the local URL shown by Vite, typically:

```text
http://localhost:5173
```

### Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### Start the backend

```bash
npm start
```

If the backend uses a different start command in your `package.json`, use that command instead.

## API

The backend is built using Express.js and exposes endpoints used by the React frontend.

### Example

```text
GET /...
```

> API routes will be documented here once the backend endpoints are finalized.

## Project Goals

SmartStock was developed to practice and demonstrate full-stack development concepts including:

* React component-based development
* REST API integration
* Client-server communication
* Express.js backend development
* Dashboard and data visualization
* Git and GitHub-based project management

## Future Improvements

Potential future improvements include:

* Persistent database integration
* User authentication and authorization
* Advanced inventory analytics
* Search and filtering
* Product management
* Stock history and reporting
* Deployment to a cloud platform

## Author

**Akshita Goel**

Built as a full-stack development project.

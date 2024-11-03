# Coding - Phase 2 - 6crickets

This project includes two main parts:

1. **app-portal** - A frontend application created with Angular, serving as the main portal.
2. **app-gateway** - A simple backend server created with Express.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Features](#features)

---

## Overview

- **app-portal**: A multi-tab Angular application showcasing countdown timers and a solution to a coding problem.
- **app-gateway**: A Node.js and Express server that provides a simple API endpoint, serving a randomly generated countdown in seconds.

## Prerequisites

- **Node.js** (version >= 20)
- **npm** (version >= 10)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/codertapsu/test-6crickets.git
   cd test-6crickets
   ```

2. **Install dependencies for both parts:**

   - For `app-gateway`:

     ```bash
     cd app-gateway
     npm install
     ```

   - For `app-portal`:

     ```bash
     cd ../app-portal
     npm install
     ```

---

## Usage

1. **Start the app-gateway server**:

   ```bash
   cd app-gateway
   npm run dev
   ```

   - The server will run on `http://localhost:3000`.
   - It exposes a single API endpoint: `/api/deadline`.

2. **Start the app-portal application**:

   ```bash
   cd ../app-portal
   npm run start
   ```

   - The Angular application will run on `http://localhost:4200`.

---

## Project Structure

```plaintext
test-6crickets
│
├── app-gateway                 # Backend server
│   ├── src
|   │   ├── index.js               # Main server file
│   ├── package.json            # Server dependencies
│   └── ...
│
└── app-portal                  # Angular application
    ├── projects
    │   ├── app-portal
    │   ├── ui                  # Contains reusable UI components like countdown timers
    │   └── ...
    ├── angular.json            # Angular project configuration
    ├── package.json            # App dependencies
    └── ...
```

---

## API Documentation

### `app-gateway`

- **Endpoint**: `/api/deadline`
- **Method**: `GET`
- **Description**: Returns a random countdown value in seconds.
- **Response**:
  ```json
  {
    "secondsLeft": <random_number>
  }
  ```

---

## Features

### app-portal (Angular)

- **Three tabs**:
  1. **Home**: Displays a `secondsLeft` value loaded from the `/api/deadline` endpoint on `app-gateway`.
  2. **Countdown Preview**: Demonstrates three types of reusable countdown timers. The countdown timer components are housed in the `UI` directory as an Angular library, allowing for easy reuse across the application.
  3. **Camera**: Contains the solution to the "General coding problem" provided in the test form.

### app-gateway (Express)

- Simple server with one endpoint (`/api/deadline`) that returns a random countdown value in seconds for the Angular application.

---

This project is ready for local development and can be easily extended or modified. Enjoy coding!

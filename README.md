# FormBuilderPro

A comprehensive form builder application with MongoDB Atlas backend and React frontend.

## Features

- **Authentication System** - JWT-based login/register
- **Form Builder** - Drag-and-drop question editor
- **Question Types** - Categorize, Cloze, and Comprehension
- **Form Sharing** - Public URLs without nodemailer
- **Response Collection** - Real-time response tracking
- **Modern UI** - Tailwind CSS with responsive design

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```env
   PORT=4000
   CLIENT_ORIGIN=http://localhost:5173
   MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DATABASE>?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. Set up MongoDB Atlas:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a cluster and database user
   - Get your connection string and replace the placeholders in MONGODB_URI

5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:4000
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Register a new account or login with demo credentials:
   - Email: `admin@example.com`
   - Password: `admin123`

2. Create forms with three question types:
   - **Categorize**: Drag and drop items into categories
   - **Cloze**: Fill in the blanks
   - **Comprehension**: Reading passages with questions

3. Share forms using the generated public URL

4. Collect and view responses in real-time

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Forms
- `GET /api/forms` - List user's forms
- `POST /api/forms` - Create new form
- `GET /api/forms/:id` - Get form by ID
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `GET /api/forms/public/:publicId` - Get public form

### Responses
- `POST /api/responses/public/:publicId` - Submit response to public form
- `GET /api/responses/form/:formId` - Get responses for a form

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT
- **Database**: MongoDB Atlas
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

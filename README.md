# FormBuilderPro

A modern, full-stack form builder application built with React, TypeScript, Node.js, and MongoDB. Create interactive forms with drag-and-drop functionality, multiple question types, and real-time form viewing.

## 🚀 Features

### Form Editor
- **Drag & Drop Interface**: Intuitive drag-and-drop form building with `@dnd-kit`
- **Multiple Question Types**:
  - **Categorize Questions**: Group items into categories
  - **Cloze Questions**: Fill-in-the-blank questions
  - **Comprehension Questions**: Reading passages with multiple sub-questions
- **Rich Media Support**: Upload and embed images in questions
- **Form Settings**: Configure submission limits, progress bars, and email collection
- **Real-time Preview**: See changes as you build

### Form Viewer
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Interactive Questions**: Dynamic question rendering based on type
- **Progress Tracking**: Visual progress bar for form completion
- **Email Collection**: Optional email collection for form submissions
- **Score Calculation**: Automatic scoring for graded questions

### Backend Features
- **RESTful API**: Clean, well-structured API endpoints
- **MongoDB Integration**: Scalable NoSQL database
- **File Upload**: Secure image upload handling
- **Security**: Rate limiting, CORS, and Helmet security headers
- **Error Handling**: Comprehensive error handling and logging

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **@dnd-kit** - Drag and drop functionality
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Multer** - File upload handling
- **JWT** - Authentication (ready for implementation)
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **express-rate-limit** - Rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd formBuilderPro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/formbuilderpro
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the frontend (Vite dev server) and backend (Express server) concurrently.

## 🚀 Usage

### Development
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Available Scripts
- `npm run dev` - Start both frontend and backend in development mode
- `npm run client` - Start only the frontend
- `npm run server` - Start only the backend
- `npm run build` - Build the frontend for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview the production build

## 📁 Project Structure

```
formBuilderPro/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   │   ├── FormEditor/     # Form building interface
│   │   ├── FormViewer/     # Form viewing interface
│   │   ├── HomePage/       # Landing page
│   │   └── QuestionTypes/  # Question type components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── server/                 # Backend source code
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   └── uploads/            # File upload directory
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🔧 API Endpoints

### Forms
- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create a new form
- `GET /api/forms/:id` - Get a specific form
- `PUT /api/forms/:id` - Update a form
- `DELETE /api/forms/:id` - Delete a form

### Submissions
- `POST /api/forms/:id/submit` - Submit form responses
- `GET /api/forms/:id/submissions` - Get form submissions

### Upload
- `POST /api/upload/image` - Upload an image

## 🎯 Question Types

### 1. Categorize Questions
Group items into predefined categories. Perfect for classification exercises.

### 2. Cloze Questions
Fill-in-the-blank questions with customizable text and answer positions.

### 3. Comprehension Questions
Reading passages with multiple sub-questions including:
- Multiple choice
- Short answer
- True/False

## 🔒 Security Features

- **Rate Limiting**: Prevents abuse with request limiting
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers for protection
- **Input Validation**: Comprehensive input sanitization
- **File Upload Security**: Secure image upload handling

## 🚀 Deployment

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting service

### Backend Deployment
1. Set up environment variables for production
2. Deploy to your preferred hosting service (Heroku, Vercel, etc.)
3. Configure MongoDB connection string

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**FormBuilderPro** - Build interactive forms with ease! 🎉

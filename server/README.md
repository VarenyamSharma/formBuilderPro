# FormBuilderPro Server

## Environment Setup

Create a `.env` file in the server directory with the following variables:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/<DATABASE>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a new cluster or use an existing one
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Replace `<USERNAME>`, `<PASSWORD>`, `<CLUSTER>`, and `<DATABASE>` in the MONGODB_URI

### JWT Secret

Generate a strong random string for JWT_SECRET. You can use:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Installation

```bash
npm install
```

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

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

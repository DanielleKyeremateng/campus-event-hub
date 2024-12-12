# Campus Event Hub

## Project Overview
Campus Event Hub is a comprehensive event management system designed for educational institutions. It allows administrators to create, manage, and track various campus events while enabling students to discover and participate in these activities.

## 🌐 Deployment Links
- **Frontend**: [Campus Event Hub App](https://campus-event-hub.vercel.app)
- **Backend API**: [Campus Event Hub API](https://campus-event-hub.onrender.com/)

## 🔑 Test Login Credentials
### Admin Account
- **Email**: admin@mail.com
- **Password**: Admin123!

### Test User Account
- **Email**: testuser@example.com
- **Password**: Test123!

## ✨ Features
- [x] User Authentication (Login/Register)
- [x] Event Management (CRUD operations)
- [x] Event Categories
- [x] Event Search & Filtering
- [x] Event Registration/RSVP
- [x] Admin Dashboard
- [x] Responsive Design
- [x] Image Upload Support
- [x] Real-time Updates

## 🛠️ Technology Stack
### Frontend
- React.js
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt
- Mongoose

## 📋 Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## 🚀 Installation & Setup

### Frontend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/campus-event-hub.git

# Navigate to frontend directory
cd campus-event-hub/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend Setup
```bash
# Navigate to backend directory
cd campus-event-hub/backend

# Install dependencies
npm install

# Create .env file with the following variables
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3001

# Start server
npm run dev
```

## 📱 API Endpoints

### Authentication
- **POST** `/auth/register` - Register new user
- **POST** `/auth/login` - User login
- **GET** `/auth/profile` - Get user profile

### Events
- **GET** `/events` - Get all events
- **POST** `/events` - Create new event
- **GET** `/events/:id` - Get event by ID
- **PUT** `/events/:id` - Update event
- **DELETE** `/events/:id` - Delete event
- **POST** `/events/:id/rsvp` - RSVP to event
- **DELETE** `/events/:id/rsvp` - Cancel RSVP

## 📝 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


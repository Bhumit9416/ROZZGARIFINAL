# Rozzgari - Job Marketplace Platform

A comprehensive MERN stack platform connecting skilled workers with people who need their services, contributing to employment and poverty reduction.

## Features

### For Workers
- Create detailed profiles with skills, experience, and portfolio
- Browse and apply for jobs
- Set hourly rates and availability
- Receive ratings and reviews
- Real-time messaging with customers
- Dashboard to manage applications and jobs

### For Customers
- Post job requirements
- Browse worker profiles
- View ratings and reviews
- Direct messaging with workers
- Job management dashboard
- Secure payment integration ready

### Platform Features
- User authentication and authorization
- Real-time messaging with Socket.io
- Advanced search and filtering
- Rating and review system
- Responsive design
- File upload support
- Email notifications
- Admin dashboard (extendable)

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Socket.io** - Real-time communication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

### Frontend
- **React.js** - UI library
- **React Router** - Navigation
- **React Query** - Data fetching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Socket.io Client** - Real-time features

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd rozzgari-platform
\`\`\`

2. Install backend dependencies
\`\`\`bash
npm install
\`\`\`

3. Create environment file
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update environment variables in `.env`:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/rozzgari
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
\`\`\`

5. Seed the database
\`\`\`bash
node scripts/seed-database.js
\`\`\`

6. Start the backend server
\`\`\`bash
npm run dev
\`\`\`

### Frontend Setup

1. Navigate to frontend directory
\`\`\`bash
cd frontend
\`\`\`

2. Install frontend dependencies
\`\`\`bash
npm install
\`\`\`

3. Start the frontend development server
\`\`\`bash
npm start
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users/workers` - Get all workers with filters
- `GET /api/users/worker/:id` - Get worker profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/portfolio` - Add portfolio item
- `PATCH /api/users/availability` - Update availability

### Jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs` - Get all jobs with filters
- `GET /api/jobs/:id` - Get job details
- `POST /api/jobs/:id/apply` - Apply for job
- `PATCH /api/jobs/:id/accept/:applicationId` - Accept application
- `PATCH /api/jobs/:id/status` - Update job status
- `GET /api/jobs/user/my-jobs` - Get user's jobs

### Services
- `GET /api/services` - Get all services
- `GET /api/services/category/:category` - Get services by category

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/user/:userId` - Get user reviews

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/conversations` - Get all conversations

## Database Schema

### User Model
- Personal information (name, email, phone)
- Authentication (password, JWT tokens)
- Profile data (bio, location, profile picture)
- Worker-specific (services, skills, hourly rate, availability)
- Rating system (average rating, review count)

### Job Model
- Job details (title, description, budget)
- Location information
- Status tracking (open, assigned, completed)
- Applications from workers
- Customer and assigned worker references

### Service Model
- Service categories and descriptions
- Average rate ranges
- Active status

### Review Model
- Rating (1-5 stars)
- Written feedback
- Aspect-based ratings (quality, punctuality, etc.)
- Job and user references

### Message Model
- Real-time messaging between users
- Job-specific conversations
- Read status tracking

## Deployment

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Set environment variables on your hosting platform
2. Ensure MongoDB connection string is updated
3. Deploy the backend code

### Frontend Deployment (Vercel/Netlify)

1. Build the React application
\`\`\`bash
npm run build
\`\`\`

2. Deploy the build folder to your hosting platform
3. Update API endpoints to point to your backend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact [bhumit916@gmail.com]

## Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Video calling integration
- [ ] Background check verification
- [ ] Insurance integration
- [ ] Advanced matching algorithm
# ROZZGARIFINAL

import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import mongoose from 'mongoose'

import AuthRoute from './routes/Auth.route.js'
import UserRoute from './routes/User.route.js'
import CategoryRoute from './routes/Category.route.js'
import BlogRoute from './routes/Blog.route.js'
import CommentRoute from './routes/Comment.route.js'
import BlogLikeRoute from './routes/Bloglike.route.js'
import dashboardRouter from './routes/Dashboard.route.js'
import {
  ForgotPassword,
  ResetPassword,
} from './controllers/Auth.controller.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Allowed frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests without an Origin header, such as server-to-server requests.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`))
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}

// Middleware must be registered before routes
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

// API routes
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRoute)
app.use('/api/blog-like', BlogLikeRoute)
app.use('/api/dashboard', dashboardRouter)

app.post('/api/forgot-password', ForgotPassword)
app.post('/api/reset-password/:token', ResetPassword)

// Basic health-check route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Blog API is running.',
  })
})

// Error handler must be registered after routes
app.use((err, req, res, next) => {
  console.error('API error:', err.message)

  const statusCode = err.statusCode || 500

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || 'Internal server error.',
  })
})

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_CONN, {
    dbName: 'yt-mern-blog',
  })
  .then(() => console.log('Database connected.'))
  .catch((err) => console.error('Database connection failed:', err.message))

// Vercel uses the exported app; run the listener for local development only.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
  })
}

export default app
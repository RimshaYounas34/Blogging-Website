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
import { ForgotPassword, ResetPassword } from './controllers/Auth.controller.js'

dotenv.config()
const PORT = process.env.PORT

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

// Route setup
app.use('/api/auth', AuthRoute)
app.use('/api/user', UserRoute)
app.use('/api/category', CategoryRoute)
app.use('/api/blog', BlogRoute)
app.use('/api/comment', CommentRoute)
app.use('/api/blog-like', BlogLikeRoute)
app.use('/api/dashboard', dashboardRouter)

// Correct forgot/reset password routes:
app.post('/api/forgot-password', ForgotPassword)
app.post('/api/reset-password/:token', ResetPassword)

// Check frontend URL in console
console.log(process.env.FRONTEND_URL)

mongoose
  .connect(process.env.MONGODB_CONN, { dbName: 'yt-mern-blog' })
  .then(() => console.log('Database connected.'))
  .catch((err) => console.log('Database connection failed.', err))

app.listen(PORT, () => {
  console.log('Server running on port:', PORT)
})

// Error handling middleware (must be last)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error.'
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

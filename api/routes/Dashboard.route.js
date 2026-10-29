import express from 'express'
import { onlyadmin } from '../middleware/onlyadmin.js'
import { getDashboardStats } from '../controllers/Dashboard.controller.js'

const dashboardRouter = express.Router()
dashboardRouter.get('/stats', onlyadmin, getDashboardStats)
export default dashboardRouter

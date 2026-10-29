import mongoose from "mongoose";

const dashboardStatsSchema = new mongoose.Schema({
  usersCount: { type: Number, required: true },
  blogsCount: { type: Number, required: true },
  categoriesCount: { type: Number, required: true },
  commentsCount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const DashboardStats = mongoose.model("DashboardStats", dashboardStatsSchema);

export default DashboardStats;

import React, { useEffect, useState } from 'react';
import { FaUsers, FaBlog, FaList, FaComments } from 'react-icons/fa';
import { getEvn } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import Loading from '@/components/Loading';
import { MdSpaceDashboard } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { RouteBlog, RouteCategoryDetails, RouteUser,  RouteCommentDetails } from '@/helpers/RouteName';

const StatCard = ({ icon: Icon, title, value, bgColor, iconColor, navigateTo, children }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.target.closest('ul')) return;
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer bg-white/30 backdrop-blur-md rounded-3xl shadow-lg border border-white/20 p-5 flex flex-col items-center justify-center text-center h-auto transition-transform hover:scale-105 hover:shadow-2xl"
    >
      <div className={`w-16 h-16 flex items-center justify-center rounded-full ${bgColor} ${iconColor} text-3xl mb-3 shadow-md`}>
        <Icon />
      </div>
      <h3 className="text-md font-semibold text-gray-800">{title}</h3>
      <p className="text-3xl font-extrabold text-gray-900 mt-1">{value}</p>
      <div className="mt-3 w-full text-left max-h-32 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, loading, error } = useFetch(
    `${getEvn("VITE_API_BASE_URL")}/dashboard/stats`,
    { method: 'GET', credentials: 'include' },
    [refreshKey]
  );

  const { data: recentUsers, loading: loadingUsers } = useFetch(
    `${getEvn("VITE_API_BASE_URL")}/dashboard/recent-users?limit=5`,
    { method: 'GET', credentials: 'include' },
    [refreshKey]
  );

  const { data: recentBlogs, loading: loadingBlogs } = useFetch(
    `${getEvn("VITE_API_BASE_URL")}/dashboard/recent-blogs?limit=5`,
    { method: 'GET', credentials: 'include' },
    [refreshKey]
  );

  const { data: recentCategories, loading: loadingCategories } = useFetch(
    `${getEvn("VITE_API_BASE_URL")}/dashboard/recent-categories?limit=5`,
    { method: 'GET', credentials: 'include' },
    [refreshKey]
  );

  const { data: recentComments, loading: loadingComments } = useFetch(
    `${getEvn("VITE_API_BASE_URL")}/dashboard/recent-comments?limit=5`,
    { method: 'GET', credentials: 'include' },
    [refreshKey]
  );

  useEffect(() => {
    const handleRefresh = () => setRefreshKey(prev => prev + 1);
    window.addEventListener('user-data-updated', handleRefresh);
    return () => window.removeEventListener('user-data-updated', handleRefresh);
  }, []);

  if (
    loading ||
    loadingUsers ||
    loadingBlogs ||
    loadingCategories ||
    loadingComments
  )
    return <Loading />;

  return (
    <div className="m-0 p-0">
      <h2 className="text-5xl font-bold text-center text-slate-800 mb-0 flex items-center justify-center gap-4 -mt-6">
        <span className="p-4 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-600 shadow-lg border-4 border-white animate-pulse">
          <MdSpaceDashboard className="text-white text-4xl" />
        </span>
        Admin Dashboard
      </h2>

      {error && (
        <div className="text-red-500 text-center mb-4">
          Failed to load dashboard data.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto mt-8">
        <StatCard
          icon={FaUsers}
          title="Total Users"
          value={data?.usersCount || 0}
          bgColor="bg-blue-100"
          iconColor="text-blue-600"
          navigateTo={RouteUser}
        >
          <ul className="text-sm text-gray-700">
            {recentUsers?.map(user => (
              <li key={user._id} className="border-b border-gray-300 py-1 truncate">
                {user.name || user.username || user.email}
              </li>
            )) || <li>Users Detail</li>}
          </ul>
        </StatCard>

        <StatCard
          icon={FaBlog}
          title="Total Blogs"
          value={data?.blogsCount || 0}
          bgColor="bg-green-100"
          iconColor="text-green-600"
          navigateTo={RouteBlog}
        >
          <ul className="text-sm text-gray-700">
            {recentBlogs?.map(blog => (
              <li key={blog._id} className="border-b border-gray-300 py-1 truncate">
                {blog.title}
              </li>
            )) || <li>Blogs Detail</li>}
          </ul>
        </StatCard>

        <StatCard
          icon={FaList}
          title="Total Categories"
          value={data?.categoriesCount || 0}
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          navigateTo={RouteCategoryDetails}
        >
          <ul className="text-sm text-gray-700">
            {recentCategories?.map(category => (
              <li key={category._id} className="border-b border-gray-300 py-1 truncate">
                {category.name}
              </li>
            )) || <li>Categories Detail</li>}
          </ul>
        </StatCard>

        <StatCard
          icon={FaComments}
          title="Total Comments"
          value={data?.commentsCount || 0}
          bgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          navigateTo={RouteCommentDetails}
        >
          <ul className="text-sm text-gray-700">
            {recentComments?.map(comment => (
              <li key={comment._id} className="border-b border-gray-300 py-1 truncate">
                {comment.text.length > 50
                  ? comment.text.substring(0, 47) + '...'
                  : comment.text}
              </li>
            )) || <li>Comments Detail</li>}
          </ul>
        </StatCard>
      </div>
    </div>
  );
};

export default Dashboard;

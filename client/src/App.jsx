import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import {
  RouteAddCategory,
  RouteBlog,
  RouteBlogAdd,
  RouteBlogByCategory,
  RouteBlogDetails,
  RouteBlogEdit,
  RouteCategoryDetails,
  RouteCommentDetails,
  RouteDashboard,
  RouteEditCategory,
  RouteIndex,
  RouteProfile,
  RouteSearch,
  RouteSignIn,
  RouteSignUp,
  RouteUser,
  RouteForgotPassword,   // ⬅️ NEW
  RouteResetPassword     // ⬅️ NEW
} from './helpers/RouteName';

import Index from './pages/Index';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import ForgotPassword from './pages/ForgotPassword';   // ⬅️ NEW
import ResetPassword from './pages/ResetPassword';     // ⬅️ NEW
import Profile from './pages/Profile';
import AddCategory from './pages/Category/AddCategory';
import CategoryDetails from './pages/Category/CategoryDetails';
import EditCategory from './pages/Category/EditCategory';
import AddBlog from './pages/Blog/AddBlog';
import BlogDetails from './pages/Blog/BlogDetails';
import EditBlog from './pages/Blog/EditBlog';
import SingleBlogDetails from './pages/SingleBlogDetails';
import BlogByCategory from './pages/Blog/BlogByCategory';
import SearchResult from './pages/SearchResult';
import Comments from './pages/Comments';
import User from './pages/User';
import AuthRouteProtechtion from './components/AuthRouteProtechtion';
import OnlyAdminAllowed from './components/OnlyAdminAllowed';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={RouteIndex} element={<Layout />}>
          <Route index element={<Index />} />

          <Route path={RouteBlogDetails()} element={<SingleBlogDetails />} />
          <Route path={RouteBlogByCategory()} element={<BlogByCategory />} />
          <Route path={RouteSearch()} element={<SearchResult />} />

          {/* ---------- Auth-protected routes ---------- */}
          <Route element={<AuthRouteProtechtion />}>
            <Route path={RouteProfile} element={<Profile />} />
            <Route path={RouteBlogAdd} element={<AddBlog />} />
            <Route path={RouteBlog} element={<BlogDetails />} />
            <Route path={RouteBlogEdit()} element={<EditBlog />} />
            <Route path={RouteCommentDetails} element={<Comments />} />
          </Route>

          {/* ---------- Admin-only routes ---------- */}
          <Route element={<OnlyAdminAllowed />}>
            <Route path={RouteAddCategory} element={<AddCategory />} />
            <Route path={RouteCategoryDetails} element={<CategoryDetails />} />
            <Route path={RouteEditCategory()} element={<EditCategory />} />
            <Route path={RouteUser} element={<User />} />
            <Route path={RouteDashboard} element={<Dashboard />} />
          </Route>
        </Route>

        {/* ---------- Public auth routes ---------- */}
        <Route path={RouteSignIn} element={<SignIn />} />
        <Route path={RouteSignUp} element={<SignUp />} />
        <Route path={RouteForgotPassword} element={<ForgotPassword />} />    
        <Route path={RouteResetPassword()} element={<ResetPassword />} />     
      </Routes>
    </BrowserRouter>
  );
};

export default App;

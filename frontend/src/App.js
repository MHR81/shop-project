import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";

import ScrollManager from "./components/common/ScrollManager";
import ProtectedRoute from './components/Authentication/ProtectedRoute';
import Layout from './components/common/Layout.jsx';

import Home from './pages/Main.js';
import Auth from './pages/Auth.js';
import Cart from './pages/Cart.js';
import Products from './pages/Products.js';
import Product from './pages/Product.js';
import Categories from './pages/Categories.js';
import CategoryPage from './pages/CategoryPage.js';
import NotFound from './pages/NotFound.js';
import User from './pages/User.js';
import Admin from './pages/Admin.js';
import Support from './pages/Support.js';

function AnimatedRoutes({ theme, setTheme }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout theme={theme} setTheme={setTheme} />}>
          <Route index element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<Product />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/category/:name" element={<CategoryPage />} />
          <Route path="/user" element={
            <ProtectedRoute allowedRoles={["user"]}>
              <User />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/support" element={
            <ProtectedRoute allowedRoles={["support"]}>
              <Support />
            </ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <Router>
      <ScrollManager />
      <AnimatedRoutes theme={theme} setTheme={setTheme} />
    </Router>
  );
}

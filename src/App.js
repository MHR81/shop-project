import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from "react";

import Layout from './components/common/Layout.jsx';
import Home from './pages/Main.js';
import Auth from './pages/Auth.js';
import Cart from './pages/Cart.js';
import ProductsPage from './pages/Products.js';
import Product from './pages/Product.js';
import Categories from './pages/Categories.js';
import NotFound from './pages/NotFound.js';
import User from './pages/User.js';
import Admin from './pages/Admin.js';
import ProtectedRoute from './components/Authentication/ProtectedRoute';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout theme={theme} setTheme={setTheme} />}>
          <Route index element={<Home />} />
          <Route path="/Auth" element={<Auth />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/categories" element={<Categories />} />
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

import "./App.css";
import axios from "axios";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import router from "./routes";
// import PrivateRoute from "./components/PrivateRoute";
import GuestLayout from "./components/GuestLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Collections from "./pages/Admin/Collections";
import Profile from "./pages/Admin/Profile";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Signup";
// import DefaultLayout from "./components/AdminLayout";
import Home from "./pages/Store/Home";
import { useEffect, useState } from "react";
import AdminLayout from "./pages/Admin/AdminLayout";
import DemoStore from "./pages/Admin/DemoStore";
import { useScrollToTop } from "./utils/hooks";
import Contact from "./pages/Store/Contact";
import Catalog from "./pages/Store/Catalog";
import DetailProduct from "./pages/Store/DetailProduct";
import Cart from "./pages/Store/Cart";
const URL_API = import.meta.env.VITE_API_URL;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const accessToken = localStorage.getItem("accessToken");

  const handleLoginSuccess = (accessToken) => {
    // setIsAuthenticated(true);
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);

      const fetchData = async () => {
        try {
          // eslint-disable-next-line no-unused-vars
          const response = await axios.get(`${URL_API}/me`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          // handle successful response
          localStorage.setItem("id_user", response.data.id_user);
          localStorage.setItem("store_name", response.data.storename);

          setIsAuthenticated(true);
        } catch (error) {
          // handle error response
          setIsAuthenticated(false);
        }
      };
      localStorage.setItem("isAuthenticated", isAuthenticated);
      fetchData();
    }
  };
  useEffect(() => {
    handleLoginSuccess(accessToken);
  }, [accessToken]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path='/'
          element={
            isAuthenticated ? (
              <Navigate to='/admin/dashboard' />
            ) : (
              <Navigate to='/auth/login' />
            )
          }
        />
        <Route
          path='/admin'
          element={
            isAuthenticated ? <AdminLayout /> : <Navigate to='/auth/login' />
          }
        >
          <Route
            path='dashboard'
            element={
              isAuthenticated ? <Dashboard /> : <Navigate to='/auth/login' />
            }
          />
          <Route
            path='collections'
            element={
              isAuthenticated ? <Collections /> : <Navigate to='/auth/login' />
            }
          />
          <Route
            path='profile'
            element={
              isAuthenticated ? <Profile /> : <Navigate to='/auth/login' />
            }
          />
          <Route
            path='demo-store'
            element={
              isAuthenticated ? <DemoStore /> : <Navigate to='/auth/login' />
            }
          />
        </Route>
        <Route path='/store/:name' element={<GuestLayout />}>
          <Route path='home' element={<Home />} />
          <Route path='contact' element={<Contact />} />
          <Route path='collections' element={<Catalog />} />
          <Route path='product/:name' element={<DetailProduct />} />
          <Route path='cart' element={<Cart />} />
        </Route>
        <Route path='/auth' element={<GuestLayout />}>
          <Route
            path='login'
            element={<Login onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path='register' element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
const ScrollToTop = () => {
  useScrollToTop();
  return null;
};

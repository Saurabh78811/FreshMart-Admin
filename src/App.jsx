
import {
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./pages/Login/Login";
import { useLayoutEffect } from "react";
import Home from "./pages/Home/Home";
import AddItems from "./pages/AddItem/AddItems";
import OrderPage from "./pages/OrderPage/OrderPage";
import ItemList from "./pages/ItemListPage/ItemList";
import AddHookah from "./pages/AddHookah/AddHookah";
import HookahList from "./pages/HookahList/HookahList";

// Check whether an admin session exists
const hasAdminSession = () => {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("freshmart_user");

  if (!token || !savedUser) return false;

  try {
    return JSON.parse(savedUser)?.role === "admin";
  } catch {
    return false;
  }
};

// Protect admin routes
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  return hasAdminSession() ? (
    children
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: location }}
    />
  );
};

// Redirect logged-in admins away from login
const PublicOnlyRoute = ({ children }) => {
  return hasAdminSession() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    children
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    const root = document.documentElement;
    const previousBehaviour = root.style.scrollBehavior;
    root.style.scrollBehavior = previousBehaviour;
  },[pathname])
  return null
}

const App = () => {
  return (
  <>
  <ScrollToTop />
      <Routes>
      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Home/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-items"
        element={
          <ProtectedRoute>
            <AddItems/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-item"
        element={
          <ProtectedRoute>
            <AddItems/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderPage/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/item-list"
        element={
          <ProtectedRoute>
            <ItemList/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-hookah"
        element={
          <ProtectedRoute>
            <AddHookah/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hookah-list"
        element={
          <ProtectedRoute>
            <HookahList/>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <Navigate to = "/" replace/>
        }
      />
    </Routes>

  </>
  );
};

export default App;

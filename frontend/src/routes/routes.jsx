import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import DashboardPage from '../pages/DashboardPage';
import ProtectedRoutes from '../components/auth/ProtectedRoutes';
import EditorPage from '../pages/EditorPage';
import ViewBookPage from '../pages/ViewBookPage';
import ProfilePage from '../pages/ProfilePage';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />
      </Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <DashboardPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/editor/:bookId"
        element={
          <ProtectedRoutes>
            <EditorPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/view-book/:bookId"
        element={
          <ProtectedRoutes>
            <ViewBookPage />
          </ProtectedRoutes>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoutes>
            <ProfilePage />
          </ProtectedRoutes>
        }
      />
    </Route>
  )
);

import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import ProtectedRoute from './components/ProtectedRoute';
import UserManagement from './pages/UserManagement';
import GalleryPage from './pages/GalleryPage';

import GalleryManagement from './pages/GalleryManagement';
import NewsManagement from './pages/NewsManagement';
import SplashScreen from './components/SplashScreen';
import EventsManagement from './pages/EventsManagement';
import ProjectsManagement from './pages/ProjectsManagement';
import ApplicationsManagement from './pages/ApplicationsManagement';
import EventApplicationsManagement from './pages/EventApplicationsManagement';

import NewsDetail from './pages/NewsDetail';
import EventDetail from './pages/EventDetail';
import ProjectDetail from './pages/ProjectDetail';

export default function App() {
  return (
    <>
      <SplashScreen />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/galeri" element={<GalleryPage />} />
        <Route path="/haber/:id" element={<NewsDetail />} />
        <Route path="/etkinlik/:id" element={<EventDetail />} />
        <Route path="/proje/:id" element={<ProjectDetail />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="news" element={<NewsManagement />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="event-applications" element={<EventApplicationsManagement />} />
            <Route path="projects" element={<ProjectsManagement />} />
            <Route path="applications" element={<ApplicationsManagement />} />
          </Route>
        </Route>
    </Routes>
    </>
  );
}


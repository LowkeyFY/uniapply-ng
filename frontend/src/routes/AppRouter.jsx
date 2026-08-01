import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Landing from "../pages/Landing";
import Explore from "../pages/Explore/Explore";
import UniversityDetail from "../pages/Explore/UniversityDetail";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import UploadWAEC from "../pages/Upload/UploadWAEC";
import UploadJAMB from "../pages/Upload/UploadJAMB";
import EligibilityCheck from "../pages/Eligibility/EligibilityCheck";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/universities/:id" element={<UniversityDetail />} />
          <Route path="/upload/waec" element={<UploadWAEC />} />
          <Route path="/upload/jamb" element={<UploadJAMB />} />
          <Route path="/eligibility" element={<EligibilityCheck />} />
      </Route>

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

      </Routes>
    </BrowserRouter>
  );
}

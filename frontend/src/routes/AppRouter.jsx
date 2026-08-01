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
import Profile from "../pages/Profile/Profile";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Pages with navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/universities/:id" element={<UniversityDetail />} />
          <Route path="/upload/waec" element={<UploadWAEC />} />
          <Route path="/upload/jamb" element={<UploadJAMB />} />
          <Route path="/eligibility" element={<EligibilityCheck />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* Authentication — no navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

import { Routes, Route } from "react-router-dom";
import StudentList from "../pages/StudentList";
import Logout from "../pages/Logout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Dashboard from "../components/Dashoard/Dashboard";
import StudentRegistration from "../pages/StudentRegistration";
import StudentDetails from "../pages/StudentDetails";
import DailyReport from "../components/DailyReport";
import Analytics from "../components/Analytics";
import TeacherRegistration from "../components/Teacher/TeacherRegistration";
import AllTeachers from "../components/Teacher/AllTeachers";
import StudentCard from "../components/Students/StudentCard";
import PoorPerformersList from "../components/Students/PoorPerformersList";
import AllStudentsPerformanceGraph from "../components/AllStudentsPerformanceGraph";
import CreateUser from "../components/Admin/CreateUser";
import UserList from "../components/Admin/UserList";
import ProtectedRoute from "../components/ProtectedRoute"; //Protection of routes
import ForgotPassword from "../pages/ForgotPassword";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ForgotPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/student/studentlist" element={<StudentList />} />
        <Route path="/teachers/allteachers" element={<AllTeachers />} />
        <Route path="/student/registration" element={<StudentRegistration />} />
        <Route path="/teacher/registration" element={<TeacherRegistration />} />
        <Route path="/student/card" element={<StudentCard />} />
        <Route path="/student/:id/performance" element={<PoorPerformersList />} />
        <Route path="/student/:id" element={<DailyReport />} />
        <Route path="/student/:id" element={<Analytics />} />
        <Route
          path="/student/performance/hifz"
          element={<AllStudentsPerformanceGraph />}
        />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin-profile" element={<Profile />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/user-list" element={<UserList />} />
      </Route>

      {/* Fallback Route (Redirect to Login if no match) */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
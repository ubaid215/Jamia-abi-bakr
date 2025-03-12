import { Routes, Route } from "react-router-dom";
import StudentList from "../pages/StudentList";
import Logout from "../pages/Logout";
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/student/studentlist" element={<StudentList />} />
      <Route path="/teachers/allteahcers" element={<AllTeachers />} />
      <Route path="/student/registration" element={<StudentRegistration />} />
      <Route path="/teacher/registration" element={<TeacherRegistration />} />
      <Route path="/student/card" element={<StudentCard />} />
      <Route path="/student/:id/performance" element={<PoorPerformersList />} />
      <Route path="/student/:id" element={<DailyReport />} />
      <Route path="/student/:id" element={<Analytics />} />
      <Route path="/student/performance/hifz" element={<AllStudentsPerformanceGraph />} />
      <Route path="/students/:id" element={<StudentDetails />} /> {/* Fixed this line */}
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default AppRoutes;
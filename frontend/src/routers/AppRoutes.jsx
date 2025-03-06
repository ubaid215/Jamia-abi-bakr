import { Routes, Route } from "react-router-dom";
import StudentList from "../pages/StudentList";
import Logout from "../pages/Logout";
import Dashboard from "../components/Dashoard/Dashboard";
import StudentRegistration from "../pages/StudentRegistration";
import StudentDetails from "../pages/StudentDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/student/studentlist" element={<StudentList />} />
      <Route path="/student/registration" element={<StudentRegistration />} />
      <Route path="/students/:id" element={<StudentDetails />} /> {/* Fixed this line */}
      <Route path="/logout" element={<Logout />} />
    </Routes>
  );
};

export default AppRoutes;
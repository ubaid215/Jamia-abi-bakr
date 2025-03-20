import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import TeacherDetail from "../components/Teacher/TeacherDetail";
import StudentCard from "../components/Students/StudentCard";
import PoorPerformersList from "../components/Students/PoorPerformersList";
import HifzClassesPerformanceGraph from "../components/HifzClassesPerformanceGraph";
import CreateUser from "../components/Admin/CreateUser";
import UserList from "../components/Admin/UserList";
import ProtectedRoute from "../components/ProtectedRoute"; // Protection of routes
import ForgotPassword from "../pages/ForgotPassword";
import Settings from "../pages/Settings";
import VerifyEmail from "../pages/VerifyEmail";

const AppRoutes = () => {
  const location = useLocation(); // Track the current route location

  // Animation variants for page transitions
  const pageVariants = {
    initial: { opacity: 0, y: 50 }, // Start slightly below and invisible
    animate: { opacity: 1, y: 0 }, // Fade in and slide up to normal position
    exit: { opacity: 0, y: -50 }, // Fade out and slide up slightly
  };

  // Transition settings for smooth animations
  const pageTransition = {
    type: "tween", // Smooth transition
    ease: "easeInOut", // Easing function
    duration: 0.3, // Animation duration in seconds
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Login />
            </motion.div>
          }
        />
        <Route
          path="/register"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Register />
            </motion.div>
          }
        />
        <Route
          path="/reset-password"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <ForgotPassword />
            </motion.div>
          }
        />
         <Route
          path="/verify-email"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <VerifyEmail />
            </motion.div>
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Dashboard />
              </motion.div>
            }
          />
          <Route
            path="/student/studentlist"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <StudentList />
              </motion.div>
            }
          />
          <Route
            path="/teachers/allteachers"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <AllTeachers />
              </motion.div>
            }
          />
          <Route
            path="/teacher/:id"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <TeacherDetail />
              </motion.div>
            }
          />
          <Route
            path="/student/registration"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <StudentRegistration />
              </motion.div>
            }
          />
          <Route
            path="/teacher/registration"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <TeacherRegistration />
              </motion.div>
            }
          />
          <Route
            path="/student/card"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <StudentCard />
              </motion.div>
            }
          />
          <Route
            path="/student/:id/performance"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <PoorPerformersList />
              </motion.div>
            }
          />
          <Route
            path="/student/:id"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <DailyReport />
              </motion.div>
            }
          />
          <Route
            path="/student/:id"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Analytics />
              </motion.div>
            }
          />
          <Route
            path="/student/performance/hifz"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <HifzClassesPerformanceGraph />
              </motion.div>
            }
          />
          <Route
            path="/students/:id"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <StudentDetails />
              </motion.div>
            }
          />
          <Route
            path="/logout"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Logout />
              </motion.div>
            }
          />
          <Route
            path="/admin-profile"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Profile />
              </motion.div>
            }
          />
          <Route
            path="/create-user"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <CreateUser />
              </motion.div>
            }
          />
          <Route
            path="/user-list"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <UserList />
              </motion.div>
            }
          />
          <Route
            path="/settings"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
              >
                <Settings />
              </motion.div>
            }
          />
        </Route>

        {/* Fallback Route (Redirect to Login if no match) */}
        <Route
          path="*"
          element={
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Login />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;

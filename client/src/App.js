import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AddInstructor from "./admin/instructors/AddInstructor";
import ClientLayout from "./user/layout/ClientLayout";
import Homepage from "./user/pages/Hompage";
import Login from "./user/componnents/login";
import Register from "./user/componnents/register";
import GoogleLoginSuccess from "./user/componnents/GoogleLoginSuccess";
import ProtectedRoute from "./user/componnents/ProtectedRoute";
import StaffBlockedRoute from "./user/componnents/StaffBlockedRoute";
import PlansPage from "./user/componnents/PlansPage";
import ClassesPage from "./user/componnents/class/ClassesPage";
import MyBookingPage from "./user/componnents/myBooking/MybookinPage";
import ContactPage from"./user/componnents/ContactPage"
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import InstructorLayout from "./instructor/InstructorLayout";
import InstructorDashboard from "./instructor/InstructorDashboard";
import ClassesAdmin from "./admin/classes/classesAdmin";
import PlansAdmin from "./admin/plans/plansAdmin";
import AdminContact from "./admin/AdminContact";
import AdminPayments from "./admin/payments/AdminPayments";
import AdminInstructors from "./admin/instructors/AdminInstructors";
import InstructorClasses from "./instructor/InstructorClasses";
import InstructorContact from "./instructor/InstructorContact";
import AddClass from "./admin/classes/AddClass";
import DeleteClass from "./admin/classes/DeleteClass";
import Update from "./admin/classes/UpdateClass";
import AddPlan from "./admin/plans/AddPlan";
import UpdatePlan from "./admin/plans/UpdatePlan";
import DeletePlan from "./admin/plans/DeletePlan";
import DeleteInstructor from "./admin/instructors/DeleteInstructor";
function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Router>
        <Routes>
          <Route path="/" element={< ClientLayout/>}>
            <Route index element={<Homepage />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login-success" element={<GoogleLoginSuccess />} />

            <Route
              path="/plans"
              element={
                <StaffBlockedRoute>
                  <PlansPage />
                </StaffBlockedRoute>
              }
            />
            <Route
              path="/classes"
              element={
                <StaffBlockedRoute>
                  <ClassesPage />
                </StaffBlockedRoute>
              }
            />


            {/* 🔥 חשוב: lowercase */}
            <Route
              path="/mybookings"
              element={
                <StaffBlockedRoute>
                  <MyBookingPage />
                </StaffBlockedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <StaffBlockedRoute>
                  <ContactPage />
                </StaffBlockedRoute>
              }
            />
            <Route
              path="/ContactPage"
              element={
                <StaffBlockedRoute>
                  <ContactPage />
                </StaffBlockedRoute>
              }
            />
          </Route>
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="classes" element={<ClassesAdmin />} />
            <Route path="plans" element={<PlansAdmin />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="instructors" element={<AdminInstructors />} />
            <Route path="classes/addClass" element={<AddClass />} />
            <Route path="classes/deleteClass/:id" element={<DeleteClass />} />
            <Route path="classes/updateClass/:id" element={<Update />} />
            <Route path="plans/addPlan" element={<AddPlan />} />
            <Route path="plans/deletePlan/:id" element={<DeletePlan />} />
            <Route path="plans/updatePlan/:id" element={<UpdatePlan />} />
            <Route path="instructors/AddInstructor" element={<AddInstructor />} />
            <Route path="instructors/deleteInstructor/:id" element={<DeleteInstructor />} />
          </Route>
          <Route
            path="/instructor"
            element={
              <ProtectedRoute allowedRoles={["instructor"]}>
                <InstructorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<InstructorDashboard />} />
            <Route path="classes" element={<InstructorClasses />} />
            <Route path="contact" element={<InstructorContact />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

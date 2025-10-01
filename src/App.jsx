import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from "./pages/User/dashboard/page";
import Leaves from "./pages/User/leaves/page";
import TimeTracking from "./pages/User/time_tracking/page";
import AttendanceLogs from "./pages/User/attendance-logs/page";
import BreakTracking from "./pages/User/break-tracking/page";
import DashboardAdmin from "./pages/admin/dashboard/page";
import AttendanceAdmin from "./pages/admin/attendance/page";
import PerformanceAdmin from "./pages/admin/Performance/page";
import BreakAdmin from "./pages/admin/break/page";
import LeavesAdmin from "./pages/admin/leaves/page";
import UsersAdmin from "./pages/admin/users/page";
import Performance from "./pages/User/Performance/page";
import TeamWallet from "./pages/User/team-wallet/page";
import AllEmployees from "./pages/admin/all-employees/page";
import NewEmployee from "./pages/admin/new-employee/page";
import AllDepartments from "./pages/admin/all-departments/page";
import NewDepartment from "./pages/admin/new-department/page";
import EditDepartment from "./pages/admin/edit-department/page";
import AllTeamsPage from "./pages/admin/all-teams/page";
import RolesAndPermissions from "./pages/admin/Roles&Permissions/page";
import NewRole from "./pages/admin/New_Role/page";
import Profile from "./pages/Profile";
import ForgetPassword from "./components/forget-password/ForgetPassword";
import ResetPassword from "./components/reset-password/resetPassword";
import ProtectedRoute from "./contexts/ProtectedRoute";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LangProvider } from "./contexts/LangContext";
import { AttendanceUpdateProvider } from "./contexts/AttendanceUpdateContext";
import { BreakUpdateProvider } from "./contexts/BreakUpdateContext";
import { TimerProvider } from "./contexts/TimerContext";
import React, { useContext } from "react";
import Error from "./components/Error/Error";
import { GlobalErrorContext } from "./contexts/GlobalErrorContext";
import { useTokenRefresh } from './hooks/useTokenRefresh';
import AdminTeamWallet from "./pages/admin/TeamWallet/page";

function App() {
  useTokenRefresh();
  const { globalError, setGlobalError } = useContext(GlobalErrorContext);

  return (
    <ThemeProvider>
      <LangProvider>
        <AttendanceUpdateProvider>
          <BreakUpdateProvider>
            <TimerProvider>
              {globalError ? (
                <Error
                  {...globalError}
                  onRefresh={() => {
                    setGlobalError(null);
                    window.location.reload();
                  }}
                  onGoHome={() => {
                    setGlobalError(null);
                    window.location.href = "/";
                  }}
                  onGoBack={() => setGlobalError(null)}
                />
              ) : (
                <BrowserRouter>
                  <Routes>
                    {/* Public Routes - No Protection */}
                    <Route path="/" element={<Login />} />
                    <Route
                      path="/forget-password"
                      element={<ForgetPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />

                    {/* Protected User Routes */}
                    <Route
                      path="/pages/User/dashboard"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pages/User/leaves"
                      element={
                        <ProtectedRoute>
                          <Leaves />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pages/User/Performance"
                      element={
                        <ProtectedRoute>
                          <Performance />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pages/User/team-wallet"
                      element={
                        <ProtectedRoute>
                          <TeamWallet />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pages/User/time_tracking"
                      element={
                        <ProtectedRoute>
                          <TimeTracking />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pages/User/attendance-logs"
                      element={
                        <ProtectedRoute>
                          <AttendanceLogs />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pages/User/break-tracking"
                      element={
                        <ProtectedRoute>
                          <BreakTracking />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/pages/User/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                  {/* Protected Admin Routes */}
                  <Route
                    path="/pages/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/attendance"
                    element={
                      <ProtectedRoute>
                        <AttendanceAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/break"
                    element={
                      <ProtectedRoute>
                        <BreakAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/leaves"
                    element={
                      <ProtectedRoute>
                        <LeavesAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/new-employee"
                    element={
                      <ProtectedRoute>
                        <NewEmployee />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/all-employees"
                    element={
                      <ProtectedRoute>
                        <AllEmployees />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/all-departments"
                    element={
                      <ProtectedRoute>
                        <AllDepartments />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/new-department"
                    element={
                      <ProtectedRoute>
                        <NewDepartment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/edit-department/:id"
                    element={
                      <ProtectedRoute>
                        <EditDepartment />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/all-teams"
                    element={
                      <ProtectedRoute>
                        <AllTeamsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/Roles&Permissions"
                    element={
                      <ProtectedRoute>
                        <RolesAndPermissions />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/New_Role"
                    element={
                      <ProtectedRoute>
                        <NewRole />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/Performance"
                    element={
                      <ProtectedRoute>
                        <PerformanceAdmin />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pages/admin/TeamWallet"
                    element={
                      <ProtectedRoute>
                        <AdminTeamWallet />
                      </ProtectedRoute>
                    }
                  />
                  {/* Catch all route - redirect to login for any unmatched routes */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </BrowserRouter>
              )}
            </TimerProvider>

          </BreakUpdateProvider>
        </AttendanceUpdateProvider>
      </LangProvider>
    </ThemeProvider>
  );
}

export default App;
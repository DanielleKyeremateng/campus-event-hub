import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import EventList from "./components/events/EventList";
import EventCalendar from "./components/events/EventCalendar";
import LoginForm from "./components/auth/LoginForm";
import RegisterForm from "./components/auth/RegisterForm";
import EventForm from "./components/admin/EventForm";
import { ROUTES } from "./utils/constants";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import AdminRoute from "./components/auth/AdminRoute";
import Dashboard from "./components/admin/Dashboard";
import ManageEvents from "./components/admin/ManageEvents";
import EditEvent from "./components/admin/EditEvent";

function App() {
  return (
    <AuthProvider>
      <div className='min-h-screen bg-gray-50'>
        <Navbar />
        <main className='pt-16'>
          <div className='container mx-auto px-4 py-8'>
            <Routes>
              <Route path={ROUTES.HOME} element={<EventList />} />
              <Route path={ROUTES.CALENDAR} element={<EventCalendar />} />
              <Route path={ROUTES.LOGIN} element={<LoginForm />} />
              <Route path={ROUTES.REGISTER} element={<RegisterForm />} />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <AdminRoute>
                    <Dashboard />
                  </AdminRoute>
                }
              />
              <Route
                path={ROUTES.CREATE_EVENT}
                element={
                  <AdminRoute>
                    <EventForm />
                  </AdminRoute>
                }
              />
              <Route
                path={ROUTES.MANAGE_EVENTS}
                element={
                  <AdminRoute>
                    <ManageEvents />
                  </AdminRoute>
                }
              />
              {/* <Route
                path={`${ROUTES.MANAGE_EVENTS}/edit/:id`}
                element={
                  <AdminRoute>
                    <EditEvent />
                  </AdminRoute>
                }
              /> */}
            </Routes>
          </div>
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  );
}

export default App;

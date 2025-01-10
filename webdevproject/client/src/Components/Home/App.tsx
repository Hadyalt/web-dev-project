import React, { JSX } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '../Login/Login';
import { Homepage } from './Homepage';
import { DashboardForm } from '../Dashboard/Dashboard';
import { DashboardPatch } from '../DashboardPatch/dashboardPatch';
import { DashboardPostForm } from '../DashboardPost/DashboardPost';
import { HomepageReview } from './HomepageReview';
import { OfficeAttendance } from '../Office/OfficeAttendance';
import { VotingPost } from '../Voting/VotingPost';



const RequireAdmin: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const userRole = sessionStorage.getItem("userRole");
  if (userRole !== "admin") {
    // Redirect to the homepage if the user is not an admin
    alert("You do not have permission to access this page.");
    return <Navigate to="/homepage" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginForm />} />
      <Route path="/homepage" element={<Homepage backToHome={() => console.log("Back to login")} />} />
      <Route path="/homepage/:eventId" element={<HomepageReview backToHome={() => console.log("Back to login")} />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/officeAttendance" element={<OfficeAttendance backToHome={function (): void {
        throw new Error('Function not implemented.');
      }} />} />
      
      {/* Protecting dashboard-related routes */}
      <Route
        path="/dashboard"
        element={
          <RequireAdmin>
            <DashboardForm />
          </RequireAdmin>
        }
      />
      <Route
        path="/dashboard/edit/:eventId"
        element={
          <RequireAdmin>
            <DashboardPatch backToHome={() => console.log("Back to dashboard")} />
          </RequireAdmin>
      } />
      <Route
        path="/dashboard/post"
        element={
          <RequireAdmin>
            <DashboardPostForm backToHome={() => console.log("Back to dashboard")} />
          </RequireAdmin>
        }
      />
      <Route
        path="/voting"
        element={
          <RequireAdmin>
            <VotingPost backToHome={() => console.log("Back to dashboard")} />
          </RequireAdmin>
        }
      />
      
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
  );
};

export default App;
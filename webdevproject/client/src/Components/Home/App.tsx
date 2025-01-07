import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginForm } from '../Login/Login';
import { Homepage } from './Homepage';
import { DashboardForm } from '../Dashboard/Dashboard';
import { DashboardPatch } from '../DashboardPatch/dashboardPatch';
import { DashboardPostForm } from '../DashboardPost/DashboardPost';
import { HomepageReview } from './HomepageReview';
import { OfficeAttendance } from '../Office/OfficeAttendance';

const App = () => {
  return (
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/homepage" element={<Homepage backToHome={() => console.log("Back to login")} />} />
        <Route path="/homepage/:eventId" element={<HomepageReview backToHome={() => console.log("Back to login")} />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<DashboardForm/>} />
        <Route path="/officeAttendance" element={<OfficeAttendance backToHome={function (): void {
        throw new Error('Function not implemented.');
      } }/>} />
        <Route path="/dashboard/edit/:eventId" element={<DashboardPatch backToHome={function (): void {
        throw new Error('Function not implemented.');
      } }/>} />
        <Route path="/dashboard/post" element={<DashboardPostForm backToHome={function (): void {
        throw new Error('Function not implemented.');
      } } />} />
        <Route path="*" element={<h1>Page Not Found</h1>} />
      </Routes>
  );
};

export default App;


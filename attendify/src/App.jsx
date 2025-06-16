import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Loginpage';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement'; // New import
import AttendanceLogs from './pages/AttendanceLogs';
import AnomalyDetection from './pages/AnomalyDetection';
import StudentRiskProfile from './pages/StudentRiskProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/student-management" element={<StudentManagement />} />
      <Route path="/attendance-logs" element={<AttendanceLogs />} />
      <Route path="/anomaly-detection" element={<AnomalyDetection />} />
      <Route path="/student-risk-profile" element={<StudentRiskProfile />} />

    </Routes>
  );
}

export default App;
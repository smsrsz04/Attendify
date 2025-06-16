import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  BarChart3, 
  FileText, 
  Users, 
  AlertTriangle, 
  Bell, 
  LogOut,
  Search,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import './StudentRiskProfile.css';

const StudentRiskProfile = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Memoize the students data to prevent unnecessary re-renders
  const students = useMemo(() => [
    { id: 'STU001', name: 'John Smith', riskLevel: 'high', attendanceRate: 65 },
    { id: 'STU002', name: 'Jane Doe', riskLevel: 'medium', attendanceRate: 78 },
    { id: 'STU003', name: 'Mike Johnson', riskLevel: 'low', attendanceRate: 92 },
    { id: 'STU004', name: 'Sarah Wilson', riskLevel: 'critical', attendanceRate: 45 },
    { id: 'STU005', name: 'David Brown', riskLevel: 'medium', attendanceRate: 82 },
    { id: 'STU006', name: 'Emily Davis', riskLevel: 'low', attendanceRate: 95 },
  ], []);

  // Mock attendance trend data
  const attendanceTrendData = useMemo(() => [
    { week: 'Week 1', attendance: 85, risk: 20 },
    { week: 'Week 2', attendance: 80, risk: 25 },
    { week: 'Week 3', attendance: 75, risk: 35 },
    { week: 'Week 4', attendance: 70, risk: 45 },
    { week: 'Week 5', attendance: 65, risk: 55 },
    { week: 'Week 6', attendance: 60, risk: 65 },
    { week: 'Week 7', attendance: 55, risk: 75 },
    { week: 'Week 8', attendance: 65, risk: 65 },
  ], []);

  // Mock risk timeline data
  const riskTimelineData = useMemo(() => [
    { month: 'Jan', low: 15, medium: 8, high: 3, critical: 1 },
    { month: 'Feb', low: 12, medium: 10, high: 5, critical: 2 },
    { month: 'Mar', low: 10, medium: 12, high: 6, critical: 3 },
    { month: 'Apr', low: 8, medium: 14, high: 8, critical: 4 },
    { month: 'May', low: 6, medium: 15, high: 10, critical: 5 },
    { month: 'Jun', low: 5, medium: 16, high: 12, critical: 6 },
  ], []);

  // Mock anomalies data
  const anomalies = useMemo(() => [
    {
      date: '2024-06-10',
      description: 'Sudden drop in attendance',
      context: 'Missed 3 consecutive days without prior notice. Pattern started after midterm exams.',
      severity: 'high'
    },
    {
      date: '2024-06-05',
      description: 'Irregular attendance pattern',
      context: 'Attending only morning classes, consistently missing afternoon sessions.',
      severity: 'medium'
    },
    {
      date: '2024-05-28',
      description: 'Extended absence period',
      context: 'Absent for 5 consecutive days. Returned with medical certificate.',
      severity: 'low'
    }
  ], []);

  const filteredStudents = useMemo(() => {
    return students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, students]);

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  const getRiskBadgeClass = (riskLevel) => {
    return `risk-badge risk-${riskLevel}`;
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Attendify</h1>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">TRACK</span>
            <Link 
              to="/anomaly-detection" 
              className={`nav-item ${isActive('/anomaly-detection') ? 'active' : ''}`}
            >
              <Calendar size={20} />
              <span>Anomaly Detection</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <span className="nav-section-title">ANALYZE</span>
            <Link 
              to="/dashboard" 
              className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
            >
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </Link>
          </div>
          
          <div className="nav-section">
            <span className="nav-section-title">MANAGE</span>
            <Link 
              to="/student-management" 
              className={`nav-item ${isActive('/student-management') ? 'active' : ''}`}
            >
              <Users size={20} />
              <span>Student Management</span>
            </Link>
            <Link 
              to="/attendance-logs" 
              className={`nav-item ${isActive('/attendance-logs') ? 'active' : ''}`}
            >
              <FileText size={20} />
              <span>Attendance Logs</span>
            </Link>
            <Link 
              to="/student-risk-profile" 
              className={`nav-item ${isActive('/student-risk-profile') ? 'active' : ''}`}
            >
              <AlertTriangle size={20} />
              <span>Student Risk Profile</span>
            </Link>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <Link to="/logout" className="nav-item">
            <LogOut size={20} />
            <span>Logout</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="page-header">
          <h1 className="page-title">Student Risk Profile</h1>
          <p className="page-description">
            Detailed analysis of individual student attendance patterns and risk assessments
          </p>
        </div>

        {/* Student Selection */}
       {/* Student Selection */}
<div className="student-selector">
  <h2 className="selector-title">Select Student</h2>
  <div style={{ position: 'relative' }}>
    <Search 
      size={20} 
      style={{ 
        position: 'absolute', 
        left: '12px', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        color: '#6b7280' 
      }} 
    />
    <input
      type="text"
      placeholder="Search by name or student ID..."
      className="student-search"
      style={{ paddingLeft: '44px' }}
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>
  
  {/* Updated List Table Format */}
  <div className="student-list-table">
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Student ID</th>
          <th>Risk Level</th>
        </tr>
      </thead>
      <tbody>
        {filteredStudents.map(student => (
          <tr
            key={student.id}
            className={`student-row ${selectedStudent?.id === student.id ? 'selected' : ''}`}
            onClick={() => setSelectedStudent(student)}
          >
            <td className="student-name">{student.name}</td>
            <td className="student-id">{student.id}</td>
            <td>
              <div className={getRiskBadgeClass(student.riskLevel)}>
                {student.riskLevel.toUpperCase()} RISK
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
        {/* Student Risk Profile Details */}
        {selectedStudent && (
          <div className="risk-profile-content">
            {/* Profile Header */}
            <div className="profile-header">
              <div className="student-info">
                <div className="student-details">
                  <h2>{selectedStudent.name}</h2>
                  <div className="student-meta">
                    <p>Student ID: {selectedStudent.id} • Current Attendance: {selectedStudent.attendanceRate}%</p>
                  </div>
                </div>
                <div className={getRiskBadgeClass(selectedStudent.riskLevel)}>
                  {selectedStudent.riskLevel} Risk
                </div>
              </div>
              
              <div className="profile-stats">
                <div className="stat-card">
                  <p className="stat-value">{selectedStudent.attendanceRate}%</p>
                  <p className="stat-label">Overall Attendance</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">8</p>
                  <p className="stat-label">Total Absences</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">3</p>
                  <p className="stat-label">Consecutive Absences</p>
                </div>
                <div className="stat-card">
                  <p className="stat-value">5</p>
                  <p className="stat-label">Risk Incidents</p>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="charts-section">
              {/* Attendance Trend Chart */}
              <div className="chart-container">
                <h3 className="chart-title">Attendance Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={attendanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Attendance %"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="risk" 
                      stroke="#ef4444" 
                      strokeWidth={2}
                      name="Risk Level %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Level Timeline */}
              <div className="chart-container">
                <h3 className="chart-title">Risk Level Timeline</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskTimelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="low" stackId="risk" fill="#10b981" name="Low Risk" />
                    <Bar dataKey="medium" stackId="risk" fill="#f59e0b" name="Medium Risk" />
                    <Bar dataKey="high" stackId="risk" fill="#ef4444" name="High Risk" />
                    <Bar dataKey="critical" stackId="risk" fill="#dc2626" name="Critical Risk" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Anomalies Section */}
            <div className="anomalies-section">
              <h3 className="anomalies-title">Recent Anomalies & Context</h3>
              {anomalies.map((anomaly, index) => (
                <div key={index} className="anomaly-item">
                  <div className="anomaly-icon">
                    <AlertCircle size={20} />
                  </div>
                  <div className="anomaly-content">
                    <p className="anomaly-date">{new Date(anomaly.date).toLocaleDateString()}</p>
                    <p className="anomaly-description">{anomaly.description}</p>
                    <p className="anomaly-context">{anomaly.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!selectedStudent && (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem', 
            color: '#6b7280' 
          }}>
            <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Select a Student</h3>
            <p>Choose a student from the list above to view their detailed risk profile and attendance analysis.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentRiskProfile;
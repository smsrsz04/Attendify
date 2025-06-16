import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  Calendar,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AnomalyDetection from './AnomalyDetection';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Helper function to determine active tab
  const isActive = (path) => location.pathname === path;

  // Sample data
  const summaryData = {
    totalStudents: 1247,
    attendanceRate: 87.3,
    flaggedAnomalies: 23,
    activeAlerts: 5
  };

  const riskOverview = {
    low: 85,
    medium: 12,
    high: 3
  };

  const recentAlerts = [
    { id: 1, student: 'John Smith', type: 'Consecutive Absences', severity: 'high', time: '2 hours ago' },
    { id: 2, student: 'Sarah Johnson', type: 'Pattern Change', severity: 'medium', time: '4 hours ago' },
    { id: 3, student: 'Mike Davis', type: 'Late Arrivals', severity: 'low', time: '6 hours ago' },
    { id: 4, student: 'Emma Wilson', type: 'Irregular Schedule', severity: 'medium', time: '1 day ago' }
  ];

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-low';
    }
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
        {location.pathname === '/anomaly-detection' ? (
          <AnomalyDetection />
        ) : (
          <>
            {/* Header */}
            <header className="main-header">
              <div className="header-left">
                <h2>Dashboard Overview</h2>
                <p>Welcome back! Here's what's happening with your attendance tracking.</p>
              </div>
              <div className="header-right">
                <div className="search-bar">
                  <Search size={20} />
                  <input type="text" placeholder="Search students..." />
                </div>
                <button className="notification-btn">
                  <Bell size={20} />
                  <span className="notification-badge">3</span>
                </button>
              </div>
            </header>

            {/* Summary Cards */}
            <section className="summary-section">
              <div className="summary-cards">
                <div className="summary-card">
                  <div className="card-icon users">
                    <Users size={24} />
                  </div>
                  <div className="card-content">
                    <h3>{summaryData.totalStudents.toLocaleString()}</h3>
                    <p>Total Students</p>
                    <span className="card-trend positive">+12 this month</span>
                  </div>
                </div>
                
                <div className="summary-card">
                  <div className="card-icon attendance">
                    <TrendingUp size={24} />
                  </div>
                  <div className="card-content">
                    <h3>{summaryData.attendanceRate}%</h3>
                    <p>Attendance Rate</p>
                    <span className="card-trend positive">+2.3% from last week</span>
                  </div>
                </div>
                
                <div className="summary-card">
                  <div className="card-icon alerts">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="card-content">
                    <h3>{summaryData.flaggedAnomalies}</h3>
                    <p>Flagged Anomalies</p>
                    <span className="card-trend negative">+5 since yesterday</span>
                  </div>
                </div>
                
                <div className="summary-card">
                  <div className="card-icon active">
                    <Bell size={24} />
                  </div>
                  <div className="card-content">
                    <h3>{summaryData.activeAlerts}</h3>
                    <p>Active Alerts</p>
                    <span className="card-trend neutral">Requires attention</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Risk Overview and Alerts */}
            <section className="content-grid">
              <div className="risk-overview-card">
                <div className="card-header">
                  <h3>Risk Overview</h3>
                  <p>Student attendance risk categorization</p>
                </div>
                <div className="risk-stats">
                  <div className="risk-item">
                    <div className="risk-indicator low"></div>
                    <div className="risk-content">
                      <span className="risk-label">Low Risk</span>
                      <span className="risk-count">{riskOverview.low} students</span>
                    </div>
                    <span className="risk-percentage">85%</span>
                  </div>
                  <div className="risk-item">
                    <div className="risk-indicator medium"></div>
                    <div className="risk-content">
                      <span className="risk-label">Medium Risk</span>
                      <span className="risk-count">{riskOverview.medium} students</span>
                    </div>
                    <span className="risk-percentage">12%</span>
                  </div>
                  <div className="risk-item">
                    <div className="risk-indicator high"></div>
                    <div className="risk-content">
                      <span className="risk-label">High Risk</span>
                      <span className="risk-count">{riskOverview.high} students</span>
                    </div>
                    <span className="risk-percentage">3%</span>
                  </div>
                </div>
              </div>

              <div className="alerts-card">
                <div className="card-header">
                  <h3>Recent Alerts</h3>
                  <p>Latest flagged cases requiring attention</p>
                </div>
                <div className="alerts-list">
                  {recentAlerts.map(alert => (
                    <div key={alert.id} className="alert-item">
                      <div className={`alert-severity ${getSeverityColor(alert.severity)}`}></div>
                      <div className="alert-content">
                        <div className="alert-main">
                          <span className="alert-student">{alert.student}</span>
                          <span className="alert-type">{alert.type}</span>
                        </div>
                        <span className="alert-time">{alert.time}</span>
                      </div>
                      <ChevronRight size={16} className="alert-arrow" />
                    </div>
                  ))}
                </div>
                <button className="view-all-btn">View All Alerts</button>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useState, useEffect } from 'react';
import {
  Users,
  AlertTriangle,
  TrendingUp,
  Calendar,
  BarChart3,
  FileText,
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

  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    flaggedAnomalies: 0,
    activeAlerts: 0,
    riskOverview: {
      low_risk: 0,
      medium_risk: 0,
      high_risk: 0
    },
    recentAlerts: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://attendify-api.vercel.app/dashboard/')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to fetch dashboard data.');
        return response.json();
      })
      .then((data) => {
        setDashboardData({
          totalStudents: data.total_students,
          attendanceRate: parseFloat(data.attendance_rate).toFixed(1),
          flaggedAnomalies: data.flagged_anomalies,
          activeAlerts: data.active_alerts,
          riskOverview: data.risk_overview,
          recentAlerts: data.recent_alerts
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const isActive = (path) => location.pathname === path;

  const getSeverityColor = (index) => {
    // Alternate severity for demo
    const levels = ['low', 'medium', 'high'];
    return `severity-${levels[index % 3]}`;
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
        ) : loading ? (
          <p className="loading-state">Loading dashboard data...</p>
        ) : error ? (
          <p className="error-state">Error: {error}</p>
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
                    <h3>{dashboardData.totalStudents.toLocaleString()}</h3>
                    <p>Total Students</p>
                    <span className="card-trend positive">+12 this month</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon attendance">
                    <TrendingUp size={24} />
                  </div>
                  <div className="card-content">
                    <h3>{dashboardData.attendanceRate}%</h3>
                    <p>Attendance Rate</p>
                    <span className="card-trend positive">+2.3% from last week</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon alerts">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="card-content">
                    <h3>{dashboardData.flaggedAnomalies}</h3>
                    <p>Flagged Anomalies</p>
                    <span className="card-trend negative">+5 since yesterday</span>
                  </div>
                </div>

                <div className="summary-card">
                  <div className="card-icon active">
                    <Bell size={24} />
                  </div>
                  <div className="card-content">
                    <h3>{dashboardData.activeAlerts}</h3>
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
                      <span className="risk-count">
                        {dashboardData.riskOverview.low_risk} students
                      </span>
                    </div>
                    <span className="risk-percentage">
                      {Math.round((dashboardData.riskOverview.low_risk / dashboardData.totalStudents) * 100)}%
                    </span>
                  </div>

                  <div className="risk-item">
                    <div className="risk-indicator medium"></div>
                    <div className="risk-content">
                      <span className="risk-label">Medium Risk</span>
                      <span className="risk-count">
                        {dashboardData.riskOverview.medium_risk} students
                      </span>
                    </div>
                    <span className="risk-percentage">
                      {Math.round((dashboardData.riskOverview.medium_risk / dashboardData.totalStudents) * 100)}%
                    </span>
                  </div>

                  <div className="risk-item">
                    <div className="risk-indicator high"></div>
                    <div className="risk-content">
                      <span className="risk-label">High Risk</span>
                      <span className="risk-count">
                        {dashboardData.riskOverview.high_risk} students
                      </span>
                    </div>
                    <span className="risk-percentage">
                      {Math.round((dashboardData.riskOverview.high_risk / dashboardData.totalStudents) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="alerts-card">
                <div className="card-header">
                  <h3>Recent Alerts</h3>
                  <p>Latest flagged cases requiring attention</p>
                </div>
                <div className="alerts-list">
                  {dashboardData.recentAlerts.map((alert, index) => (
                    <div key={index} className="alert-item">
                      <div className={`alert-severity ${getSeverityColor(index)}`}></div>
                      <div className="alert-content">
                        <div className="alert-main">
                          <span className="alert-student">{alert.name}</span>
                          <span className="alert-type">{alert.reason}</span>
                        </div>
                        <span className="alert-time">
                          {new Date(alert.date).toLocaleString()}
                        </span>
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

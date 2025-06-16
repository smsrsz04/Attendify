import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  BarChart3, 
  FileText, 
  Users, 
  AlertTriangle, 
  Bell, 
  LogOut,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import './AnomalyDetection.css';

const AnomalyDetection = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('all');
  
  // Mock data for flagged records
  const [flaggedRecords, setFlaggedRecords] = useState([
    {
      id: 1,
      student_id: 'STU001',
      student_name: 'John Doe',
      date: '2024-06-10',
      reason: 'Irregular Pattern',
      risk_score: 85,
      status: 'pending',
      details: 'Attendance pattern deviates from normal schedule'
    },
    {
      id: 2,
      student_id: 'STU045',
      student_name: 'Jane Smith',
      date: '2024-06-09',
      reason: 'Multiple Check-ins',
      risk_score: 92,
      status: 'pending',
      details: 'Multiple check-ins detected within short time frame'
    },
    {
      id: 3,
      student_id: 'STU023',
      student_name: 'Mike Johnson',
      date: '2024-06-08',
      reason: 'Late Night Access',
      risk_score: 78,
      status: 'confirmed',
      details: 'Access recorded outside normal hours'
    },
    {
      id: 4,
      student_id: 'STU067',
      student_name: 'Sarah Wilson',
      date: '2024-06-07',
      reason: 'Location Mismatch',
      risk_score: 88,
      status: 'false_positive',
      details: 'Student location doesn\'t match expected classroom'
    }
  ]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleOverride = (recordId, action) => {
    setFlaggedRecords(records =>
      records.map(record =>
        record.id === recordId
          ? { ...record, status: action }
          : record
      )
    );
  };

  const getRiskScoreColor = (score) => {
    if (score >= 90) return 'risk-critical';
    if (score >= 75) return 'risk-high';
    if (score >= 50) return 'risk-medium';
    return 'risk-low';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <XCircle className="status-icon confirmed" />;
      case 'false_positive':
        return <CheckCircle className="status-icon false-positive" />;
      default:
        return <AlertCircle className="status-icon pending" />;
    }
  };

  const filteredRecords = flaggedRecords.filter(record => {
    const matchesSearch = record.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.student_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterReason === 'all' || record.reason === filterReason;
    return matchesSearch && matchesFilter;
  });

  const reasons = [...new Set(flaggedRecords.map(record => record.reason))];

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
        <div className="content-header">
          <h1>Anomaly Detection</h1>
          <p>Monitor and review flagged attendance patterns and irregularities</p>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by student name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-dropdown">
            <Filter size={20} />
            <select
              value={filterReason}
              onChange={(e) => setFilterReason(e.target.value)}
            >
              <option value="all">All Reasons</option>
              {reasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Anomalies</h3>
            <div className="card-value">{flaggedRecords.length}</div>
          </div>
          <div className="summary-card">
            <h3>Pending Review</h3>
            <div className="card-value">
              {flaggedRecords.filter(r => r.status === 'pending').length}
            </div>
          </div>
          <div className="summary-card">
            <h3>High Risk</h3>
            <div className="card-value">
              {flaggedRecords.filter(r => r.risk_score >= 90).length}
            </div>
          </div>
          <div className="summary-card">
            <h3>False Positives</h3>
            <div className="card-value">
              {flaggedRecords.filter(r => r.status === 'false_positive').length}
            </div>
          </div>
        </div>

        {/* Flagged Records Table */}
        <div className="table-container">
          <div className="table-header">
            <h2>Flagged Records</h2>
          </div>
          
          <div className="table-wrapper">
            <table className="anomaly-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Risk Score</th>
                  <th>Details</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id} className={`record-row ${record.status}`}>
                    <td className="status-cell">
                      {getStatusIcon(record.status)}
                    </td>
                    <td className="student-id">{record.student_id}</td>
                    <td className="student-name">{record.student_name}</td>
                    <td className="date">{record.date}</td>
                    <td className="reason">
                      <span className="reason-badge">{record.reason}</span>
                    </td>
                    <td className="risk-score">
                      <span className={`risk-badge ${getRiskScoreColor(record.risk_score)}`}>
                        {record.risk_score}
                      </span>
                    </td>
                    <td className="details">{record.details}</td>
                    <td className="actions">
                      {record.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="btn-confirm"
                            onClick={() => handleOverride(record.id, 'confirmed')}
                            title="Confirm Anomaly"
                          >
                            <XCircle size={16} />
                          </button>
                          <button
                            className="btn-false-positive"
                            onClick={() => handleOverride(record.id, 'false_positive')}
                            title="Mark as False Positive"
                          >
                            <CheckCircle size={16} />
                          </button>
                        </div>
                      )}
                      {record.status !== 'pending' && (
                        <button
                          className="btn-reset"
                          onClick={() => handleOverride(record.id, 'pending')}
                          title="Reset to Pending"
                        >
                          Reset
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRecords.length === 0 && (
            <div className="no-results">
              <AlertCircle size={48} />
              <h3>No anomalies found</h3>
              <p>No records match your current search and filter criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AnomalyDetection;
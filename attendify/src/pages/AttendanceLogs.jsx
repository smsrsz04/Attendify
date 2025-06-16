import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  BarChart3, 
  Users, 
  FileText, 
  AlertTriangle, 
  LogOut,
  Search,
  Filter,
  Download,
  ChevronDown
} from 'lucide-react';
import './AttendanceLogs.css';

const AttendanceLogs = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sample data - replace with actual API call
  const sampleLogs = [
    { id: 1, studentId: 'STU001', studentName: 'John Doe', timestamp: '2025-06-13 08:30:00', subject: 'Mathematics', status: 'Present' },
    { id: 2, studentId: 'STU002', studentName: 'Jane Smith', timestamp: '2025-06-13 08:32:00', subject: 'Mathematics', status: 'Present' },
    { id: 3, studentId: 'STU003', studentName: 'Mike Johnson', timestamp: '2025-06-13 09:15:00', subject: 'Physics', status: 'Late' },
    { id: 4, studentId: 'STU001', studentName: 'John Doe', timestamp: '2025-06-13 10:00:00', subject: 'Chemistry', status: 'Present' },
    { id: 5, studentId: 'STU004', studentName: 'Sarah Wilson', timestamp: '2025-06-13 10:05:00', subject: 'Chemistry', status: 'Present' },
    { id: 6, studentId: 'STU002', studentName: 'Jane Smith', timestamp: '2025-06-12 08:30:00', subject: 'Mathematics', status: 'Absent' },
    { id: 7, studentId: 'STU005', studentName: 'David Brown', timestamp: '2025-06-12 09:00:00', subject: 'English', status: 'Present' },
    { id: 8, studentId: 'STU003', studentName: 'Mike Johnson', timestamp: '2025-06-12 14:30:00', subject: 'History', status: 'Present' },
  ];

  const subjects = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'English', 'History'];

  useEffect(() => {
    setLogs(sampleLogs);
    setFilteredLogs(sampleLogs);
  }, []);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(log =>
        log.timestamp.startsWith(dateFilter)
      );
    }

    if (subjectFilter && subjectFilter !== 'All Subjects') {
      filtered = filtered.filter(log =>
        log.subject === subjectFilter
      );
    }

    setFilteredLogs(filtered);
  }, [searchTerm, dateFilter, subjectFilter, logs]);

  const isActive = (path) => {
    return window.location.pathname === path;
  };

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Student Name', 'Timestamp', 'Subject', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredLogs.map(log => [
        log.studentId,
        log.studentName,
        log.timestamp,
        log.subject,
        log.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_logs.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // Basic PDF export simulation
    alert('PDF export functionality would be implemented here using a library like jsPDF');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Present': return 'status-present';
      case 'Late': return 'status-late';
      case 'Absent': return 'status-absent';
      default: return '';
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
        <div className="page-header">
          <h1>Attendance Logs</h1>
          <p>View and manage daily attendance records</p>
        </div>

        <div className="logs-container">
          {/* Controls */}
          <div className="logs-controls">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search by student ID or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-controls">
              <button 
                className="filter-toggle"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                Filters
                <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
              </button>

              <div className="export-buttons">
                <button onClick={handleExportCSV} className="export-btn csv">
                  <Download size={16} />
                  CSV
                </button>
                <button onClick={handleExportPDF} className="export-btn pdf">
                  <Download size={16} />
                  PDF
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-group">
                <label>Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Subject</label>
                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="filter-select"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <button 
                onClick={() => {
                  setSearchTerm('');
                  setDateFilter('');
                  setSubjectFilter('');
                }}
                className="clear-filters-btn"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="results-summary">
            <span>Showing {filteredLogs.length} records</span>
          </div>

          {/* Logs Table */}
          <div className="table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                  <th>Timestamp</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td className="student-id">{log.studentId}</td>
                    <td className="student-name">{log.studentName}</td>
                    <td className="timestamp">{formatTimestamp(log.timestamp)}</td>
                    <td className="subject">{log.subject}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="empty-state">
                <FileText size={48} />
                <h3>No logs found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceLogs;
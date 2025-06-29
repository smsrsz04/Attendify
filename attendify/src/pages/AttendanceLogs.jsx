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
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const subjects = ['All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'English', 'History'];

  useEffect(() => {
    setLoading(true);
    fetch(`https://attendify-api.vercel.app/attendance_logs/?page=${page}&limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch attendance logs.');
        return res.json();
      })
      .then((data) => {
        setLogs(data.logs || []);
        setFilteredLogs(data.logs || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, limit]);

  useEffect(() => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.student_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        log.student_id,
        log.name,
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

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">Attendify</h1>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <span className="nav-section-title">TRACK</span>
            <Link to="/anomaly-detection" className={`nav-item ${isActive('/anomaly-detection') ? 'active' : ''}`}>
              <Calendar size={20} />
              <span>Anomaly Detection</span>
            </Link>
          </div>
          <div className="nav-section">
            <span className="nav-section-title">ANALYZE</span>
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <BarChart3 size={20} />
              <span>Dashboard</span>
            </Link>
          </div>
          <div className="nav-section">
            <span className="nav-section-title">MANAGE</span>
            <Link to="/student-management" className={`nav-item ${isActive('/student-management') ? 'active' : ''}`}>
              <Users size={20} />
              <span>Student Management</span>
            </Link>
            <Link to="/attendance-logs" className={`nav-item ${isActive('/attendance-logs') ? 'active' : ''}`}>
              <FileText size={20} />
              <span>Attendance Logs</span>
            </Link>
            <Link to="/student-risk-profile" className={`nav-item ${isActive('/student-risk-profile') ? 'active' : ''}`}>
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
      <main className="main-content">
        <div className="page-header">
          <h1>Attendance Logs</h1>
          <p>View and manage daily attendance records</p>
        </div>
        <div className="logs-container">
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
              <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
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
              <button onClick={() => {
                setSearchTerm('');
                setDateFilter('');
                setSubjectFilter('');
              }} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          )}
          <div className="results-summary">
            <span>Showing {filteredLogs.length} of {total} records</span>
          </div>
          <div className="table-container">
            <table className="logs-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Student Name</th>
                  <th>Student ID</th>
                  <th>Subject</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, index) => (
                  <tr key={index}>
                    <td>{formatTimestamp(log.timestamp)}</td>
                    <td>{log.name}</td>
                    <td>{log.student_id}</td>
                    <td>{log.subject}</td>
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
          <div className="pagination">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>Next</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AttendanceLogs;

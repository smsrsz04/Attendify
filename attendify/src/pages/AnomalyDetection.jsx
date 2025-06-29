import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Calendar, BarChart3, FileText, Users, AlertTriangle, LogOut,
  Search, Filter, CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AnomalyDetection.css';

const AnomalyDetection = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('all');
  const [flaggedRecords, setFlaggedRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [totalAnomalies, setTotalAnomalies] = useState(0);
  const [pendingReview, setPendingReview] = useState(0);
  const [highRisk, setHighRisk] = useState(0);
  const [falsePositives, setFalsePositives] = useState(0);

  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    setLoading(true);
    fetch(`https://attendify-api.vercel.app/anomalies/?page=${page}&limit=${limit}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch anomaly data.');
        return res.json();
      })
      .then(async data => {
        const updatedRecords = await Promise.all(
          data.flagged_records.map(async record => {
            if (!record.student_name) {
              try {
                const res = await fetch(`https://attendify-api.vercel.app/students/${record.student_id}`);
                if (res.ok) {
                  const stu = await res.json();
                  return { ...record, student_name: stu.name || 'Unknown' };
                }
              } catch {}
              return { ...record, student_name: 'Unknown' };
            }
            return record;
          })
        );

        setFlaggedRecords(updatedRecords);
        setTotalAnomalies(data.total_anomalies || 0);
        setPendingReview(data.pending_review || 0);
        setHighRisk(data.high_risk || 0);
        setFalsePositives(data.false_positives || 0);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    const result = flaggedRecords.filter(record => {
      if (!record) return false;
      const name = record.student_name || '';
      return (
        (name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.student_id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterReason === 'all' || record.reason === filterReason)
      );
    });
    setFilteredRecords(result);
  }, [flaggedRecords, searchTerm, filterReason]);

  const totalPages = Math.ceil(totalAnomalies / limit);

  const isActive = path => location.pathname === path;

  const handleOverride = (id, newStatus) => {
    const record = flaggedRecords.find(r => r.id === id);
    if (!record) return;

    const prevStatus = record.status;
    const actionLabel = newStatus === 'confirmed'
      ? 'Confirm this anomaly?'
      : newStatus === 'false_positive'
      ? 'Mark as false positive?'
      : 'Reset status to pending?';

    if (!window.confirm(actionLabel)) return;

    if (prevStatus !== newStatus) {
      if (prevStatus === 'pending') setPendingReview(p => p - 1);
      if (prevStatus === 'confirmed') setHighRisk(h => h - 1);
      if (prevStatus === 'false_positive') setFalsePositives(fp => fp - 1);

      if (newStatus === 'pending') setPendingReview(p => p + 1);
      if (newStatus === 'confirmed') setHighRisk(h => h + 1);
      if (newStatus === 'false_positive') setFalsePositives(fp => fp + 1);
    }

    setFlaggedRecords(records =>
      records.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );

    const msg = newStatus === 'pending'
      ? 'Status reset to pending.'
      : newStatus === 'confirmed'
      ? 'Anomaly confirmed.'
      : 'Marked as false positive.';
    toast.success(msg);
  };

  const getRiskScoreColor = score =>
    score >= 90 ? 'risk-critical' :
    score >= 75 ? 'risk-high' :
    score >= 50 ? 'risk-medium' : 'risk-low';

  const getStatusIcon = status =>
    status === 'confirmed' ? <XCircle className="status-icon confirmed" /> :
    status === 'false_positive' ? <CheckCircle className="status-icon false-positive" /> :
    <AlertCircle className="status-icon pending" />;

  const reasons = [...new Set(flaggedRecords.map(r => r.reason))];

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
              <Calendar size={20} /><span>Anomaly Detection</span>
            </Link>
          </div>
          <div className="nav-section">
            <span className="nav-section-title">ANALYZE</span>
            <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
              <BarChart3 size={20} /><span>Dashboard</span>
            </Link>
          </div>
          <div className="nav-section">
            <span className="nav-section-title">MANAGE</span>
            <Link to="/student-management" className={`nav-item ${isActive('/student-management') ? 'active' : ''}`}>
              <Users size={20} /><span>Student Management</span>
            </Link>
            <Link to="/attendance-logs" className={`nav-item ${isActive('/attendance-logs') ? 'active' : ''}`}>
              <FileText size={20} /><span>Attendance Logs</span>
            </Link>
            <Link to="/student-risk-profile" className={`nav-item ${isActive('/student-risk-profile') ? 'active' : ''}`}>
              <AlertTriangle size={20} /><span>Student Risk Profile</span>
            </Link>
          </div>
        </nav>
        <div className="sidebar-footer">
          <Link to="/logout" className="nav-item">
            <LogOut size={20} /><span>Logout</span>
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <div className="content-header">
          <h1>Anomaly Detection</h1>
          <p>Monitor and review flagged attendance patterns and irregularities</p>
        </div>

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
            <select value={filterReason} onChange={(e) => setFilterReason(e.target.value)}>
              <option value="all">All Reasons</option>
              {reasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card"><h3>Total Anomalies</h3><div className="card-value">{totalAnomalies}</div></div>
          <div className="summary-card"><h3>Pending Review</h3><div className="card-value">{pendingReview}</div></div>
          <div className="summary-card"><h3>High Risk</h3><div className="card-value">{highRisk}</div></div>
          <div className="summary-card"><h3>False Positives</h3><div className="card-value">{falsePositives}</div></div>
        </div>

        {loading ? (
          <p className="loading">Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="table-container">
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
                    <tr key={record.id}>
                      <td>{getStatusIcon(record.status)}</td>
                      <td>{record.student_id}</td>
                      <td>{record.student_name}</td>
                      <td>{record.date || 'N/A'}</td>
                      <td><span className="reason-badge">{record.reason}</span></td>
                      <td><span className={`risk-badge ${getRiskScoreColor(record.risk_score)}`}>{record.risk_score}</span></td>
                      <td>{record.details}</td>
                      <td>
                        {record.status === 'pending' ? (
                          <>
                            <button className="btn-confirm" onClick={() => handleOverride(record.id, 'confirmed')}><XCircle /></button>
                            <button className="btn-false-positive" onClick={() => handleOverride(record.id, 'false_positive')}><CheckCircle /></button>
                          </>
                        ) : (
                          <button className="btn-reset" onClick={() => handleOverride(record.id, 'pending')}>Reset</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredRecords.length === 0 && (
                <div className="no-results">
                  <AlertCircle size={48} />
                  <h3>No anomalies found</h3>
                  <p>Try adjusting filters or search keywords.</p>
                </div>
              )}
            </div>

            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Previous</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </>
        )}

        <ToastContainer position="bottom-right" autoClose={2000} />
      </main>
    </div>
  );
};

export default AnomalyDetection;

import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Calendar,
  BarChart3,
  FileText,
  Users,
  AlertTriangle,
  LogOut,
  Search,
  AlertCircle
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import './StudentRiskProfile.css';

const RISK_LEVELS = ['low', 'medium', 'high'];

const detectAnomalies = (attendanceArray) => {
  const data = attendanceArray.map(Number);
  const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
  const std = Math.sqrt(data.reduce((sum, val) => sum + (val - mean) ** 2, 0) / data.length);

  return data.map((value, index) => ({
    index,
    value,
    isAnomaly: Math.abs(value - mean) > 2 * std,
  }));
};

const Dashboard = () => {
  const [anomalies, setAnomalies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [riskFilter, setRiskFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studentAnomalies, setStudentAnomalies] = useState([]);

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

  const riskTimelineData = useMemo(() => [
    { month: 'Jan', low: 15, medium: 8, high: 3},
    { month: 'Feb', low: 12, medium: 10, high: 5 },
    { month: 'Mar', low: 10, medium: 12, high: 6 },
    { month: 'Apr', low: 8, medium: 14, high: 8 },
    { month: 'May', low: 6, medium: 15, high: 10 },
    { month: 'Jun', low: 5, medium: 16, high: 12 },
  ], []);

  const sampleAnomalies = useMemo(() => [
    {
      date: '2024-06-10',
      description: 'Sudden drop in attendance',
      context: 'Missed 3 consecutive days without prior notice.',
      severity: 'high'
    },
    {
      date: '2024-06-05',
      description: 'Irregular attendance pattern',
      context: 'Consistently missing afternoon sessions.',
      severity: 'medium'
    },
    {
      date: '2024-05-28',
      description: 'Extended absence period',
      context: 'Absent for 5 consecutive days with a medical certificate.',
      severity: 'low'
    }
  ], []);

  useEffect(() => {
    const fetchAnomalies = async () => {
      try {
        const res = await fetch('/api/anomalies/today');
        const data = await res.json();

        if (data.length > 0) {
          setAnomalies(data);
          toast.warning(`⚠️ ${data.length} attendance anomal${data.length > 1 ? 'ies' : 'y'} detected today.`);
        }
      } catch (err) {
        console.error('Failed to fetch anomalies:', err);
      }
    };

    fetchAnomalies();
  }, []);

  useEffect(() => {
    setLoading(true);
    let url = `https://attendify-api.vercel.app/student_risk_profile/?page=${page}&limit=${limit}`;
    if (riskFilter !== 'all') url += `&risk_level=${riskFilter}`;
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch student risk data.');
        return res.json();
      })
      .then(data => {
        setProfiles(data.profiles || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [page, limit, riskFilter, searchTerm]);

  useEffect(() => {
    const fetchStudentAnomalies = () => {
      if (!selectedStudent) return;
      const history = selectedStudent.weekly_attendance || [85, 80, 75, 70, 65, 60, 55, 65];
      const detected = detectAnomalies(history).filter(a => a.isAnomaly);
      setStudentAnomalies(detected);
    };
    fetchStudentAnomalies();
  }, [selectedStudent]);

  const totalPages = Math.ceil(total / limit);

  const filteredStudents = useMemo(() => {
    return profiles.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, profiles]);

  const isActive = (path) => window.location.pathname === path;
  const getRiskBadgeClass = (riskLevel) => `risk-badge risk-${riskLevel}`;

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
        {/* 🚨 Anomaly Alert Banner */}
        {anomalies.length > 0 && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-xl shadow-md">
            <p className="font-semibold">⚠️ Alert: {anomalies.length} anomal{anomalies.length > 1 ? 'ies' : 'y'} detected in attendance today.</p>
            <a href="/admin/anomalies" className="text-blue-700 underline hover:text-blue-900">View anomaly details</a>
          </div>
        )}

        <div className="page-header">
          <h1 className="page-title">Student Risk Dashboard</h1>
          <p className="page-description">Comprehensive view of attendance anomalies and student risk profiles</p>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="risk-filters">
            {['all', ...RISK_LEVELS].map(lvl => (
              <button
                key={lvl}
                className={`filter-btn ${riskFilter === lvl ? 'active' : ''}`}
                onClick={() => { setRiskFilter(lvl); setPage(1); }}
              >
                {lvl === 'all' ? 'All' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="search-container">
            <Search size={20} />
            <input
              placeholder="Search name or ID..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            />
          </div>
        </div>

        <div className="student-selector">
          <div className="student-list-table">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : profiles.length === 0 ? (
              <div className="empty-state">
                <AlertCircle size={48} />
                <p>No matching records found.</p>
              </div>
            ) : (
              <>
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
                        key={student.student_id}
                        className={`student-row ${selectedStudent?.student_id === student.student_id ? 'selected' : ''}`}
                        onClick={() => setSelectedStudent(student)}
                      >
                        <td>{student.name}</td>
                        <td>{student.student_id}</td>
                        <td><div className={getRiskBadgeClass(student.risk_level)}>{student.risk_level.toUpperCase()} RISK</div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pagination">
                  <button onClick={() => setPage(prev => Math.max(prev - 1, 1))} disabled={page === 1}>Previous</button>
                  <span>Page {page} of {totalPages}</span>
                  <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} disabled={page === totalPages}>Next</button>
                </div>
              </>
            )}
          </div>
        </div>

        {selectedStudent ? (
          <div className="risk-profile-content">
            <div className="profile-header">
              <div className="student-info">
                <div className="student-details">
                  <h2>{selectedStudent.name}</h2>
                  <p>Student ID: {selectedStudent.student_id} • Current Attendance: {selectedStudent.attendance_rate}%</p>
                </div>
                <div className={getRiskBadgeClass(selectedStudent.risk_level)}>{selectedStudent.risk_level.toUpperCase()} RISK</div>
              </div>

              <div className="profile-stats">
                <div className="stat-card"><p className="stat-value">{selectedStudent.attendance_rate}%</p><p className="stat-label">Overall Attendance</p></div>
                <div className="stat-card"><p className="stat-value">8</p><p className="stat-label">Total Absences</p></div>
                <div className="stat-card"><p className="stat-value">3</p><p className="stat-label">Consecutive Absences</p></div>
                <div className="stat-card"><p className="stat-value">5</p><p className="stat-label">Risk Incidents</p></div>
              </div>
            </div>

            <div className="charts-section">
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
                      dot={({ cx, cy, payload, index }) =>
                        studentAnomalies.find(a => a.index === index) ? (
                          <circle cx={cx} cy={cy} r={6} fill="#ef4444" stroke="#000" strokeWidth={1} />
                        ) : (
                          <circle cx={cx} cy={cy} r={3} fill="#10b981" />
                        )
                      }
                    />
                    <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} name="Risk Level %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

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
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="anomalies-section">
              <h3 className="anomalies-title">AI-Detected Attendance Anomalies</h3>
              {studentAnomalies.length === 0 ? (
                <p>No anomalies detected in recent attendance.</p>
              ) : (
                studentAnomalies.map((anomaly, index) => (
                  <div key={index} className="anomaly-item">
                    <div className="anomaly-icon"><AlertCircle size={20} /></div>
                    <div className="anomaly-content">
                      <p className="anomaly-date">Week {anomaly.index + 1}</p>
                      <p className="anomaly-description">Unusual attendance: {anomaly.value}%</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="anomalies-section">
              <h3 className="anomalies-title">Recent Anomalies & Context</h3>
              {sampleAnomalies.map((anomaly, index) => (
                <div key={index} className="anomaly-item">
                  <div className="anomaly-icon"><AlertCircle size={20} /></div>
                  <div className="anomaly-content">
                    <p className="anomaly-date">{new Date(anomaly.date).toLocaleDateString()}</p>
                    <p className="anomaly-description">{anomaly.description}</p>
                    <p className="anomaly-context">{anomaly.context}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#6b7280' }}>
            <AlertTriangle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h3>Select a Student</h3>
            <p>Choose a student from the list above to view their detailed risk profile and attendance analysis.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
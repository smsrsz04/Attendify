import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Printer, 
  X,
  Calendar,
  BarChart3,
  FileText,
  AlertTriangle,
  LogOut,
  QrCode
} from 'lucide-react';
import axios from 'axios';
import './StudentManagement.css';

const API_BASE_URL = 'https://attendify-api.vercel.app/students';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'Unknown error occurred'}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', grade: '', status: 'active'
  });

  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    inactiveStudents: 0,
    averageAttendance: 0
  });

  const generateQRCode = (studentId) => {
    if (!studentId) return '';
    const qrData = `STUDENT_ID:${studentId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  };

  const fetchStudents = async (reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { 
          page: reset ? 1 : page, 
          limit, 
          search: searchTerm 
        },
        headers: { 'accept': 'application/json' }
      });

      const responseData = response.data || {};
      const newStudents = responseData.students || [];
      
      setStudents(prev => reset ? newStudents : [...prev, ...newStudents]);
      setHasMore(newStudents.length >= limit);
      
      // Update stats from API response
      setStats({
        totalStudents: responseData.total_students || 0,
        activeStudents: responseData.active_students || 0,
        inactiveStudents: responseData.inactive_students || 0,
        averageAttendance: Math.round(responseData.average_attendance || 0)
      });
    } catch (err) {
      console.error("API Error:", err);
      setError(err.response?.data?.message || 'Failed to load students');
      setStudents([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 &&
        !loading && hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  useEffect(() => { fetchStudents(page === 1); }, [page]);
  useEffect(() => { setPage(1); }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await axios.post(API_BASE_URL, formData, {
          headers: { 'accept': 'application/json' }
        });
      } else if (selectedStudent?.student_id) {
        await axios.put(`${API_BASE_URL}/${selectedStudent.student_id}`, formData, {
          headers: { 'accept': 'application/json' }
        });
      }
      setPage(1);
      fetchStudents(true);
      closeModal();
    } catch (err) {
      console.error("Submission Error:", err);
      alert(err.response?.data?.message || 'Failed to save student');
    }
  };

  const handleDelete = async (studentId) => {
    if (!studentId || !window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/${studentId}`, {
        headers: { 'accept': 'application/json' }
      });
      setStudents(prev => prev.filter(student => student?.student_id !== studentId));
    } catch (err) {
      console.error("Deletion Error:", err);
      alert(err.response?.data?.message || 'Failed to delete student');
    }
  };

  const openModal = (mode, student = null) => {
    setModalMode(mode);
    setSelectedStudent(student);
    setFormData({
      name: student?.name || '',
      email: student?.email || '',
      phone: student?.phone || '',
      grade: student?.grade || '',
      status: student?.status || 'active'
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFormData({ name: '', email: '', phone: '', grade: '', status: 'active' });
  };

  const downloadQRCode = (studentId, studentName) => {
    if (!studentId || !studentName) return;
    const qrUrl = generateQRCode(studentId);
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${studentName.replace(/[^a-z0-9]/gi, '_')}_QR_Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printQRCode = (studentId, studentName) => {
    if (!studentId || !studentName) return;
    const qrUrl = generateQRCode(studentId);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${studentName}</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
            .qr-container { margin: 20px 0; }
            .student-info { margin: 10px 0; }
            img { border: 1px solid #ccc; max-width: 300px; height: auto; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>Student QR Code</h2>
            <div class="student-info">
              <p><strong>Name:</strong> ${studentName}</p>
              <p><strong>Student ID:</strong> ${studentId}</p>
            </div>
            <img src="${qrUrl}" alt="QR Code" onload="window.print()" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const isActive = (path) => window.location.pathname === path;

  if (!Array.isArray(students)) {
    return (
      <div className="data-error">
        <Users size={48} />
        <h3>Student data unavailable</h3>
        <button onClick={() => fetchStudents(true)}>Retry</button>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo">Attendify</h1>
          </div>
          
          <nav className="sidebar-nav">
            <div className="nav-section">
              <span className="nav-section-title">TRACK</span>
              <a href="/anomaly-detection" className="nav-item">
                <Calendar size={20} />
                <span>Anomaly Detection</span>
              </a>
            </div>
            
            <div className="nav-section">
              <span className="nav-section-title">ANALYZE</span>
              <a href="/dashboard" className="nav-item">
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </a>
            </div>
            
            <div className="nav-section">
              <span className="nav-section-title">MANAGE</span>
              <a href="/student-management" className={`nav-item ${isActive('/student-management') ? 'active' : ''}`}>
                <Users size={20} />
                <span>Student Management</span>
              </a>
              <a href="/attendance-logs" className="nav-item">
                <FileText size={20} />
                <span>Attendance Logs</span>
              </a>
              <a href="/student-risk-profile" className="nav-item">
                <AlertTriangle size={20} />
                <span>Student Risk Profile</span>
              </a>
            </div>
          </nav>
          
          <div className="sidebar-footer">
            <a href="/logout" className="nav-item">
              <LogOut size={20} />
              <span>Logout</span>
            </a>
          </div>
        </aside>

        <main className="main-content">
          <div className="page-header">
            <h1 className="page-title">Student Management</h1>
            <p className="page-subtitle">Manage student profiles, view attendance statistics, and generate QR codes</p>
          </div>

          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-value">{stats.totalStudents}</div>
              <div className="stat-label">Total Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.activeStudents}</div>
              <div className="stat-label">Active Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.inactiveStudents}</div>
              <div className="stat-label">Inactive Students</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.averageAttendance}%</div>
              <div className="stat-label">Average Attendance</div>
            </div>
          </div>

          <div className="controls-section">
            <div className="search-container">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search students..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>
            <button 
              className="add-student-btn" 
              onClick={() => openModal('add')}
              disabled={loading}
            >
              <Plus size={20} />
              Add Student
            </button>
          </div>

          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Student ID</th>
                  <th>Grade</th>
                  <th>Status</th>
                  <th>Attendance</th>
                  <th>QR Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student?.student_id || Math.random().toString(36).substring(2, 9)}>
                    <td>
                      <div className="student-info-container">
                        <img 
                          src={student?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'} 
                          alt={student?.name || 'Student'} 
                          className="student-avatar" 
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face';
                          }}
                        />
                        <div>
                          <div className="student-name">{student?.name || 'Unknown Student'}</div>
                          <div className="student-email">{student?.email || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td>{student?.student_id || 'N/A'}</td>
                    <td>{student?.grade || 'N/A'}</td>
                    <td>
                      <span className={`status-badge ${student?.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                        {student?.status || 'inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="attendance-rate">{student?.attendance_rate || 0}%</div>
                    </td>
                    <td>
                      <div className="qr-code-container">
                        <img 
                          src={generateQRCode(student?.student_id)} 
                          alt="QR Code" 
                          className="qr-code-image" 
                        />
                        <div className="qr-actions">
                          <button 
                            className="qr-btn" 
                            onClick={() => downloadQRCode(student?.student_id, student?.name)}
                            title="Download QR Code"
                            disabled={!student?.student_id}
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            className="qr-btn" 
                            onClick={() => printQRCode(student?.student_id, student?.name)}
                            title="Print QR Code"
                            disabled={!student?.student_id}
                          >
                            <Printer size={14} />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="action-btn view" 
                          onClick={() => openModal('view', student)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className="action-btn edit" 
                          onClick={() => openModal('edit', student)}
                          title="Edit Student"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => handleDelete(student?.student_id)}
                          title="Delete Student"
                          disabled={!student?.student_id}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="loading-indicator">
                <div className="spinner"></div>
                Loading students...
              </div>
            )}

            {error && (
              <div className="error-message">
                <AlertTriangle size={18} />
                {error}
                <button onClick={() => fetchStudents(true)}>Retry</button>
              </div>
            )}

            {students.length === 0 && !loading && !error && (
              <div className="empty-state">
                <Users size={48} className="empty-icon" />
                <p>No students found</p>
                <button onClick={() => fetchStudents(true)}>Refresh</button>
              </div>
            )}
          </div>

          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h2 className="modal-title">
                    {modalMode === 'add' && 'Add New Student'}
                    {modalMode === 'edit' && 'Edit Student'}
                    {modalMode === 'view' && 'Student Details'}
                  </h2>
                  <button className="close-btn" onClick={closeModal}>
                    <X size={24} />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                          type="text"
                          className="form-input"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                          disabled={modalMode === 'view'}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-input"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                          disabled={modalMode === 'view'}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Phone</label>
                        <input
                          type="tel"
                          className="form-input"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          required
                          disabled={modalMode === 'view'}
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Grade Level</label>
                        <select
                          className="form-select"
                          value={formData.grade}
                          onChange={(e) => setFormData({...formData, grade: e.target.value})}
                          required
                          disabled={modalMode === 'view'}
                        >
                          <option value="">Select Grade</option>
                          <option value="7th Grade">7th Grade</option>
                          <option value="8th Grade">8th Grade</option>
                          <option value="9th Grade">9th Grade</option>
                          <option value="10th Grade">10th Grade</option>
                          <option value="11th Grade">11th Grade</option>
                          <option value="12th Grade">12th Grade</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value})}
                          disabled={modalMode === 'view'}
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>

                    {(modalMode === 'view' || modalMode === 'edit') && selectedStudent && (
                      <div className="qr-section">
                        <h4>Student QR Code</h4>
                        <img 
                          src={generateQRCode(selectedStudent.student_id)} 
                          alt="Student QR Code" 
                          className="qr-code-large"
                        />
                        <div className="qr-download-buttons">
                          <button
                            type="button"
                            className="download-btn"
                            onClick={() => downloadQRCode(selectedStudent.student_id, selectedStudent.name)}
                          >
                            <Download size={16} />
                            Download
                          </button>
                          <button
                            type="button"
                            className="download-btn"
                            onClick={() => printQRCode(selectedStudent.student_id, selectedStudent.name)}
                          >
                            <Printer size={16} />
                            Print
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn-secondary" onClick={closeModal}>
                      {modalMode === 'view' ? 'Close' : 'Cancel'}
                    </button>
                    {modalMode !== 'view' && (
                      <button type="submit" className="btn-primary" disabled={loading}>
                        {modalMode === 'add' ? 'Add Student' : 'Save Changes'}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default StudentManagement;
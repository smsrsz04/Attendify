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
import './StudentManagement.css';

const StudentManagement = () => {
  const [students, setStudents] = useState([
    {
      id: 'STU001',
      name: 'Alex Johnson',
      email: 'alex.johnson@school.edu',
      phone: '+1234567890',
      grade: '9th Grade',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      attendanceRate: 95,
      totalClasses: 120,
      attendedClasses: 114
    },
    {
      id: 'STU002',
      name: 'Emma Wilson',
      email: 'emma.wilson@school.edu',
      phone: '+1234567891',
      grade: '8th Grade',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150&h=150&fit=crop&crop=face',
      attendanceRate: 88,
      totalClasses: 110,
      attendedClasses: 97
    },
    {
      id: 'STU003',
      name: 'Liam Brown',
      email: 'liam.brown@school.edu',
      phone: '+1234567892',
      grade: '7th Grade',
      status: 'inactive',
      avatar: 'https://images.unsplash.com/photo-1568822617270-2c1579f8dfe2?w=150&h=150&fit=crop&crop=face',
      attendanceRate: 72,
      totalClasses: 100,
      attendedClasses: 72
    },
    {
      id: 'STU004',
      name: 'Sophia Davis',
      email: 'sophia.davis@school.edu',
      phone: '+1234567893',
      grade: '12th Grade',
      status: 'active',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      attendanceRate: 92,
      totalClasses: 125,
      attendedClasses: 115
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', 'view'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    grade: '',
    status: 'active'
  });

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generate QR Code URL (using a QR code API)
  const generateQRCode = (studentId) => {
    const qrData = `STUDENT_ID:${studentId}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
  };

  // Calculate statistics
  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.status === 'active').length,
    inactiveStudents: students.filter(s => s.status === 'inactive').length,
    averageAttendance: Math.round(students.reduce((acc, s) => acc + s.attendanceRate, 0) / students.length)
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (modalMode === 'add') {
      const newStudent = {
        ...formData,
        id: `STU${String(students.length + 1).padStart(3, '0')}`,
        avatar: `https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face`,
        attendanceRate: 0,
        totalClasses: 0,
        attendedClasses: 0
      };
      setStudents([...students, newStudent]);
    } else if (modalMode === 'edit') {
      setStudents(students.map(student => 
        student.id === selectedStudent.id ? { ...student, ...formData } : student
      ));
    }
    
    closeModal();
  };

  // Handle delete
  const handleDelete = (studentId) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      setStudents(students.filter(student => student.id !== studentId));
    }
  };

  // Modal functions
  const openModal = (mode, student = null) => {
    setModalMode(mode);
    setSelectedStudent(student);
    
    if (mode === 'add') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        grade: '',
        status: 'active'
      });
    } else if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: student.phone,
        grade: student.grade,
        status: student.status
      });
    }
    
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      grade: '',
      status: 'active'
    });
  };

  // Download QR Code
  const downloadQRCode = (studentId, studentName) => {
    const qrUrl = generateQRCode(studentId);
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${studentName}_QR_Code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print QR Code
  const printQRCode = (studentId, studentName) => {
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
            img { border: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>Student QR Code</h2>
            <div class="student-info">
              <p><strong>Name:</strong> ${studentName}</p>
              <p><strong>Student ID:</strong> ${studentId}</p>
            </div>
            <img src="${qrUrl}" alt="QR Code" />
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Check if current path is active (mock function for demonstration)
  const isActive = (path) => {
    return path === '/student-management';
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

      {/* Main Content */}
      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <h1 className="page-title">Student Management</h1>
          <p className="page-subtitle">Manage student profiles, view attendance statistics, and generate QR codes</p>
        </div>

        {/* Statistics Cards */}
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

        {/* Controls */}
        <div className="controls-section">
          <div className="search-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="add-student-btn" onClick={() => openModal('add')}>
            <Plus size={20} />
            Add Student
          </button>
        </div>

        {/* Students Table */}
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
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={student.avatar} alt={student.name} className="student-avatar" />
                      <div>
                        <div className="student-name">{student.name}</div>
                        <div className="student-email">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{student.id}</td>
                  <td>{student.grade}</td>
                  <td>
                    <span className={`status-badge ${student.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="attendance-rate">{student.attendanceRate}%</div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      {student.attendedClasses}/{student.totalClasses} classes
                    </div>
                  </td>
                  <td>
                    <div className="qr-code-container">
                      <img 
                        src={generateQRCode(student.id)} 
                        alt="QR Code" 
                        className="qr-code-image" 
                      />
                      <div className="qr-actions">
                        <button 
                          className="qr-btn" 
                          onClick={() => downloadQRCode(student.id, student.name)}
                          title="Download QR Code"
                        >
                          <Download size={14} />
                        </button>
                        <button 
                          className="qr-btn" 
                          onClick={() => printQRCode(student.id, student.name)}
                          title="Print QR Code"
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
                        onClick={() => handleDelete(student.id)}
                        title="Delete Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredStudents.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
              <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No students found matching your search criteria.</p>
            </div>
          )}
        </div>

        {/* Modal */}
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

                  {/* Attendance Stats (View Mode Only) */}
                  {modalMode === 'view' && selectedStudent && (
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Attendance Rate</label>
                        <input
                          type="text"
                          className="form-input"
                          value={`${selectedStudent.attendanceRate}%`}
                          disabled
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Classes Attended</label>
                        <input
                          type="text"
                          className="form-input"
                          value={`${selectedStudent.attendedClasses} / ${selectedStudent.totalClasses}`}
                          disabled
                        />
                      </div>
                    </div>
                  )}

                  {/* QR Code Section */}
                  {(modalMode === 'view' || modalMode === 'edit') && selectedStudent && (
                    <div className="qr-section">
                      <h4>Student QR Code</h4>
                      <img 
                        src={generateQRCode(selectedStudent.id)} 
                        alt="Student QR Code" 
                        className="qr-code-large"
                      />
                      <div className="qr-download-buttons">
                        <button
                          type="button"
                          className="download-btn"
                          onClick={() => downloadQRCode(selectedStudent.id, selectedStudent.name)}
                        >
                          <Download size={16} />
                          Download
                        </button>
                        <button
                          type="button"
                          className="download-btn"
                          onClick={() => printQRCode(selectedStudent.id, selectedStudent.name)}
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
                    <button type="submit" className="btn-primary">
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
  );
};

export default StudentManagement;
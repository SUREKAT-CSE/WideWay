import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, FileText, User } from 'lucide-react';

export default function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const url = user?.role === 'student' ? '/applications/me' : '/applications';
      const res = await axios.get(url);
      setApplications(res.data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdating(true);
      await axios.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-semibold uppercase tracking-wider"><CheckCircle size={14} /> Selected</span>;
      case 'Rejected':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold uppercase tracking-wider"><XCircle size={14} /> Rejected</span>;
      case 'Under Review':
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-semibold uppercase tracking-wider"><Clock size={14} /> Reviewing</span>;
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-semibold uppercase tracking-wider"><Clock size={14} /> Applied</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const isStudent = user?.role === 'student';

  return (
    <div className="relative animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
          {isStudent ? 'My Applications' : 'Manage Applications'}
        </h1>
        <p className="text-gray-400 mt-2">
          {isStudent ? 'Track the status of your scholarship applications.' : 'Review and update student application statuses.'}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-primary-900/50 rounded-2xl">
          <FileText size={48} className="mx-auto text-primary-900/50 mb-4" />
          <h3 className="text-lg font-medium text-gray-300">No applications found</h3>
          <p className="text-gray-500">
            {isStudent ? 'You have not applied to any scholarships yet.' : 'There are no active applications to manage.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="glass-panel p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-transform hover:scale-[1.01]">
              <div className="space-y-2 flex-grow">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-100">{app.scholarshipId?.title || 'Unknown Scholarship'}</h3>
                  {!isStudent && app.status && getStatusBadge(app.status)}
                </div>
                
                <p className="text-gray-400 text-sm">Provider: <span className="text-gray-300">{app.scholarshipId?.provider || 'N/A'}</span></p>
                <p className="text-xs text-gray-500">Applied on: {new Date(app.createdAt).toLocaleDateString()}</p>
                
                {!isStudent && (
                  <div className="flex items-center gap-2 mt-3 bg-primary-900/20 p-3 rounded-xl border border-primary-900/30 inline-block w-full md:w-auto">
                    <User size={16} className="text-primary-400" />
                    <div className="text-sm">
                      <p className="text-gray-200 font-medium">{app.studentId?.name || 'Unknown'}</p>
                      <p className="text-gray-500 text-xs">{app.studentId?.email} • {app.studentId?.collegeName}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full md:w-auto flex flex-col items-start md:items-end gap-3 mt-4 md:mt-0">
                {isStudent && app.status && getStatusBadge(app.status)}
                
                {!isStudent && (
                  <select
                    disabled={updating}
                    value={app.status}
                    onChange={(e) => handleStatusChange(app._id, e.target.value)}
                    className="bg-bg-input border border-primary-900/50 text-gray-200 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 outline-none cursor-pointer"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

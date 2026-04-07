import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Calendar, Link as LinkIcon, Building, Briefcase } from 'lucide-react';

export default function Scholarships() {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '', provider: '', description: '', deadline: '', applyLink: '', category: 'Government'
  });

  const isPrivileged = user?.role === 'admin' || user?.role === 'collegeAdmin';

  const fetchData = async () => {
    try {
      setLoading(true);
      const [scholRes, appsRes] = await Promise.all([
        axios.get('/scholarships'),
        user?.role === 'student' ? axios.get('/applications/me') : Promise.resolve({ data: [] })
      ]);
      setScholarships(scholRes.data);
      if (user?.role === 'student') {
        setMyApplications(appsRes.data);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) return;
    try {
      await axios.delete(`/scholarships/${id}`);
      setScholarships(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert('Failed to delete scholarship.');
    }
  };

  const handleApply = async (scholarshipId) => {
    try {
      await axios.post('/applications', { scholarshipId, status: 'Applied' });
      fetchData(); // Refresh applications map to correctly disable button
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to apply. You might have already applied.');
    }
  };

  const hasApplied = (scholarshipId) => {
    return myApplications.some(app => 
      // If populated it's an object _id, else it's slightly different structurally.
      (app.scholarshipId?._id || app.scholarshipId) === scholarshipId
    );
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await axios.post('/scholarships', formData);
      setIsModalOpen(false);
      setFormData({ title: '', provider: '', description: '', deadline: '', applyLink: '', category: 'Government' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add scholarship.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="relative animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">Scholarships</h1>
          <p className="text-gray-400 mt-2">Discover and manage academic opportunities.</p>
        </div>
        
        {isPrivileged && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white py-2 px-4 rounded-xl transition-colors shadow-lg shadow-primary-900/40"
          >
            <Plus size={20} />
            Add Scholarship
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {scholarships.map((scholarship) => {
          const alreadyApplied = user?.role === 'student' && hasApplied(scholarship._id);
          
          return (
            <div key={scholarship._id} className="glass-panel p-6 flex flex-col relative group">
              {isPrivileged && (
                <button
                  onClick={() => handleDelete(scholarship._id)}
                  className="absolute top-4 right-4 bg-red-500/10 text-red-400 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  title="Delete Scholarship"
                >
                  <Trash2 size={18} />
                </button>
              )}
              
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  scholarship.category === 'Government' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                }`}>
                  {scholarship.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-100 leading-tight mb-2 pr-8 truncate" title={scholarship.title}>
                {scholarship.title}
              </h3>
              
              <div className="space-y-2 mb-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Building size={16} className="text-gray-500" />
                  <span className="truncate">{scholarship.provider}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-500" />
                  <span>Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                {scholarship.description || 'No detailed description provided.'}
              </p>

              <div className="flex items-center gap-3 mt-auto border-t border-primary-900/30 pt-4">
                <a 
                  href={scholarship.applyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex justify-center text-sm items-center gap-2 bg-bg-input hover:bg-primary-900/40 text-gray-300 py-2.5 rounded-lg transition-colors border border-primary-900/50"
                >
                  <LinkIcon size={16} /> Official Link
                </a>
                
                {user?.role === 'student' && (
                  <button
                    disabled={alreadyApplied}
                    onClick={() => handleApply(scholarship._id)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      alreadyApplied 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-not-allowed' 
                        : 'bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-900/40'
                    }`}
                  >
                    {alreadyApplied ? 'Applied' : 'Apply Here'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {scholarships.length === 0 && (
          <div className="col-span-full py-16 text-center border-2 border-dashed border-primary-900/50 rounded-2xl">
            <Briefcase size={48} className="mx-auto text-primary-900/50 mb-4" />
            <h3 className="text-lg font-medium text-gray-300">No scholarships available</h3>
            <p className="text-gray-500">Check back later for new opportunities.</p>
          </div>
        )}
      </div>

      {/* Add Scholarship Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl relative border-primary-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Add New Scholarship</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-300">Title <span className="text-red-400">*</span></label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2.5 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 text-gray-100 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-300">Provider <span className="text-red-400">*</span></label>
                  <input type="text" name="provider" required value={formData.provider} onChange={handleChange} className="w-full px-4 py-2.5 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 text-gray-100 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-300">Deadline <span className="text-red-400">*</span></label>
                  <input type="date" name="deadline" required value={formData.deadline} onChange={handleChange} className="w-full px-4 py-2.5 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 text-gray-100 outline-none" style={{ colorScheme: 'dark' }} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-300">Category <span className="text-red-400">*</span></label>
                  <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-4 py-2.5 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 text-gray-100 outline-none appearance-none">
                    <option value="Government">Government</option>
                    <option value="Private">Private</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-300">Official Apply Link <span className="text-red-400">*</span></label>
                <input type="url" name="applyLink" required value={formData.applyLink} onChange={handleChange} className="w-full px-4 py-2.5 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 text-gray-100 outline-none placeholder-gray-600" placeholder="https://" />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-300">Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full px-4 py-2.5 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 text-gray-100 outline-none resize-none" placeholder="Provide details..."></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-primary-900/30">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 bg-bg-input text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-colors shrink-0 outline-none">Cancel</button>
                <button type="submit" disabled={formLoading} className="flex-2 w-full px-4 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors shrink-0 outline-none flex justify-center items-center">
                  {formLoading ? 'Adding...' : 'Add Scholarship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

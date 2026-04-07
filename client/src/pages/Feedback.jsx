import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, ThumbsUp, Send } from 'lucide-react';

export default function Feedback() {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarshipId, setSelectedScholarshipId] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({ experience: '', tips: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get('/scholarships');
        setScholarships(res.data);
        if (res.data.length > 0) {
          setSelectedScholarshipId(res.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to fetch scholarships:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, []);

  useEffect(() => {
    if (selectedScholarshipId) {
      const fetchFeedbacks = async () => {
        try {
          const res = await axios.get(`/feedback/${selectedScholarshipId}`);
          setFeedbacks(res.data);
        } catch (err) {
          console.error('Failed to fetch feedbacks:', err);
        }
      };
      fetchFeedbacks();
    }
  }, [selectedScholarshipId]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.post('/feedback', { ...formData, scholarshipId: selectedScholarshipId });
      setFeedbacks((prev) => [...prev, { ...res.data, studentId: { name: user.name, collegeName: user.collegeName } }]);
      setFormData({ experience: '', tips: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback. Have you applied for it?');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    <div className="relative animate-in fade-in duration-500 flex flex-col lg:flex-row gap-8">
      
      {/* Left Column: List/Feedback viewer */}
      <div className="w-full lg:w-2/3 space-y-6 flex flex-col">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
            Scholarship Feedback
          </h1>
          <p className="text-gray-400 mt-2">Read experiences and tips from previous applicants.</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm text-gray-300 font-medium">Select a Scholarship to view feedback:</label>
          <select 
            value={selectedScholarshipId} 
            onChange={(e) => setSelectedScholarshipId(e.target.value)}
            className="w-full p-3 bg-bg-card border border-primary-900/50 rounded-xl text-gray-100 focus:ring-primary-500 outline-none appearance-none"
          >
            {scholarships.map(s => (
              <option key={s._id} value={s._id}>{s.title} ({s.provider})</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-h-[400px]">
          {feedbacks.length === 0 ? (
            <div className="py-12 px-6 text-center border-2 border-dashed border-primary-900/50 rounded-2xl h-full flex flex-col items-center justify-center">
              <MessageSquare size={40} className="text-primary-900/50 mb-4" />
              <h3 className="text-lg font-medium text-gray-300">No feedback yet</h3>
              <p className="text-gray-500 text-sm mt-1">Be the first to share your experience with this scholarship!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {feedbacks.map((fb, idx) => (
                <div key={idx} className="glass-panel p-5 relative border border-primary-800/40">
                  <div className="flex justify-between items-start mb-4 border-b border-primary-900/30 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-900/50 flex items-center justify-center text-primary-400 font-semibold border border-primary-800">
                        {fb.studentId?.name?.charAt(0) || 'A'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-200">{fb.studentId?.name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-500">{fb.studentId?.collegeName || 'Unknown College'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-400 block font-medium mb-1">💬 Experience:</span>
                      <p className="text-gray-200 leading-relaxed bg-bg-input/50 p-3 rounded-lg">{fb.experience}</p>
                    </div>
                    <div>
                      <span className="text-primary-400 block font-medium mb-1 flex items-center gap-1"><ThumbsUp size={14}/> Top Tips:</span>
                      <p className="text-gray-200 leading-relaxed bg-primary-900/10 border border-primary-900/20 p-3 rounded-lg">{fb.tips}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Submit Form (Only for students) */}
      {isStudent && (
        <div className="w-full lg:w-1/3">
          <div className="glass-panel p-6 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-4">Share Your Experience</h2>
            <p className="text-sm text-gray-400 mb-6">Helps other students succeed by sharing what you've learned.</p>
            
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-300">Your Experience</label>
                <textarea 
                  name="experience" 
                  required 
                  value={formData.experience} 
                  onChange={handleChange} 
                  rows="4" 
                  className="w-full px-4 py-3 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 text-gray-100 outline-none resize-none" 
                  placeholder="How was the process..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-300">Tips & Advice</label>
                <textarea 
                  name="tips" 
                  required 
                  value={formData.tips} 
                  onChange={handleChange} 
                  rows="3" 
                  className="w-full px-4 py-3 bg-bg-input border border-primary-900/50 rounded-xl focus:ring-2 focus:ring-primary-500/50 text-gray-100 outline-none resize-none" 
                  placeholder="What would you recommend..."
                />
              </div>

              <button 
                type="submit" 
                disabled={submitting} 
                className="w-full mt-4 flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white py-3 rounded-xl transition-colors disabled:opacity-70 font-medium"
              >
                {submitting ? 'Submitting...' : 'Post Feedback'}
                {!submitting && <Send size={16} />}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

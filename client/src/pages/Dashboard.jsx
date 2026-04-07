import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, BookOpen, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!user) return;
      
      try {
        let endpoint = '';
        if (user.role === 'student') endpoint = '/dashboard/student';
        else if (user.role === 'collegeAdmin') endpoint = '/dashboard/college-admin';
        else if (user.role === 'admin') endpoint = '/dashboard/admin';

        if (endpoint) {
          const res = await axios.get(endpoint);
          setStats(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="glass-panel p-6 flex items-center gap-4">
      <div className={`p-4 rounded-xl ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400">Here is what's happening with your account today.</p>
      </div>

      {user?.role === 'student' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Scholarships" 
            value={stats.totalScholarships || 0} 
            icon={BookOpen} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="My Applications" 
            value={stats.myApplications || 0} 
            icon={FileText} 
            color="bg-primary-500" 
          />
          {stats.statusBreakdown?.map(item => (
            <StatCard 
              key={item._id}
              title={`${item._id} Applications`}
              value={item.count} 
              icon={item._id === 'approved' ? CheckCircle : item._id === 'pending' ? Clock : XCircle} 
              color={item._id === 'approved' ? 'bg-green-500' : item._id === 'pending' ? 'bg-yellow-500' : 'bg-red-500'} 
            />
          ))}
        </div>
      )}

      {user?.role === 'collegeAdmin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Students" 
            value={stats.totalStudents || 0} 
            icon={Users} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Total Applications" 
            value={stats.totalApplications || 0} 
            icon={FileText} 
            color="bg-primary-500" 
          />
          {stats.statusBreakdown?.map(item => (
            <StatCard 
              key={item._id}
              title={`${item._id.charAt(0).toUpperCase() + item._id.slice(1)}`}
              value={item.count} 
              icon={item._id === 'approved' ? CheckCircle : item._id === 'pending' ? Clock : XCircle} 
              color={item._id === 'approved' ? 'bg-green-500' : item._id === 'pending' ? 'bg-yellow-500' : 'bg-red-500'} 
            />
          ))}
        </div>
      )}

      {user?.role === 'admin' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Users" 
            value={stats.usersCount || 0} 
            icon={Users} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Scholarships" 
            value={stats.scholarshipCount || 0} 
            icon={BookOpen} 
            color="bg-primary-500" 
          />
          <StatCard 
            title="Total Applications" 
            value={stats.applicationCount || 0} 
            icon={FileText} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Feedback Received" 
            value={stats.feedbackCount || 0} 
            icon={CheckCircle} 
            color="bg-green-500" 
          />
        </div>
      )}
    </div>
  );
}

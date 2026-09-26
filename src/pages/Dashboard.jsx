import React from 'react';
import {
  Briefcase,
  Clock,
  Printer,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Plus,
  Calendar,
  User,
  Phone,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const Dashboard = () => {
  const navigate = useNavigate();

  // Visually polished placeholder metrics (Prompt 1 UI shell)
  const stats = [
    {
      title: 'Total Jobs',
      value: '24',
      change: '+12% this week',
      icon: Briefcase,
      color: 'from-indigo-500 to-purple-600',
      badgeStatus: 'default',
    },
    {
      title: 'Pending Jobs',
      value: '6',
      change: 'Needs assignment',
      icon: Clock,
      color: 'from-amber-500 to-orange-600',
      badgeStatus: 'pending',
    },
    {
      title: 'Processing Jobs',
      value: '8',
      change: 'In printing pipeline',
      icon: Printer,
      color: 'from-cyan-500 to-blue-600',
      badgeStatus: 'processing',
    },
    {
      title: 'Completed Jobs',
      value: '10',
      change: 'Ready for pickup',
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      badgeStatus: 'completed',
    },
  ];

  // Placeholder recent / upcoming jobs list
  const recentJobsPlaceholder = [
    {
      id: 'JOB-101',
      client: 'Apex Corporate Solutions',
      description: 'Vinyl Banner Printing (10ft x 4ft)',
      designer: 'Alex Rivers',
      deliveryDate: '2026-09-28',
      phone: '+91 98765 43210',
      status: 'Processing',
      amount: '₹4,500',
    },
    {
      id: 'JOB-102',
      client: 'Sunlight Cafe',
      description: 'Custom Embossed Gift Mugs (Qty 50)',
      designer: 'Sarah Jenkins',
      deliveryDate: '2026-09-29',
      phone: '+91 98123 45678',
      status: 'Pending',
      amount: '₹6,000',
    },
    {
      id: 'JOB-103',
      client: 'Dr. Mehta Clinic',
      description: 'Business Cards & Letterhead Pack',
      designer: 'Alex Rivers',
      deliveryDate: '2026-09-27',
      phone: '+91 99887 76655',
      status: 'Completed',
      amount: '₹2,200',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Operations Dashboard"
        description="Real-time snapshot of your printing and gift shop workflow"
        badge={
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Shell Active
          </span>
        }
        action={
          <Button
            onClick={() => navigate('/jobs')}
            icon={Plus}
            variant="primary"
            size="md"
          >
            Create New Job
          </Button>
        }
      />

      {/* Visually Polished Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} hoverEffect className="relative">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {stat.title}
                  </span>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${stat.color} p-0.5 shadow-md flex items-center justify-center text-white`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <h2 className="text-3xl font-black text-slate-100 tracking-tight">
                    {stat.value}
                  </h2>
                  <Badge status={stat.badgeStatus}>{stat.title.split(' ')[0]}</Badge>
                </div>

                <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5 font-medium">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent / Upcoming Jobs Section Placeholder */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Recent & Upcoming Print Jobs</CardTitle>
            <CardDescription>
              Preview of incoming billing and production tasks (UI Shell Placeholder)
            </CardDescription>
          </div>
          <Button
            onClick={() => navigate('/jobs')}
            variant="ghost"
            size="sm"
            icon={ArrowRight}
            className="self-start sm:self-auto text-indigo-400 hover:text-indigo-300"
          >
            View All Jobs
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Job ID & Client</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Designer</th>
                  <th className="px-6 py-4">Delivery Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentJobsPlaceholder.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-100">{job.client}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <span className="text-indigo-400 font-mono font-medium">{job.id}</span>
                        <span>•</span>
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{job.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-200">
                      {job.description}
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400" />
                        {job.designer}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-300 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {job.deliveryDate}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-100 font-mono">
                      {job.amount}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={job.status}>{job.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-indigo-500/5 border-t border-slate-800 text-center">
            <p className="text-xs text-indigo-300 font-medium">
              💡 Live MongoDB database integration & calculations will be wired up in the next prompt!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

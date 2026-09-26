import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Clock,
  Printer,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Plus,
  Calendar,
  Palette,
  Eye,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

import { dashboardService } from '../services/dashboardService';
import { jobService } from '../services/jobService';
import { JobFormModal } from '../components/jobs/JobFormModal';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';

export const Dashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  // 1. Fetch real MongoDB dashboard metrics via TanStack Query
  const {
    data: dashboardResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardService.getSummary,
  });

  const dashboardData = dashboardResponse?.data || {};
  const metrics = dashboardData.metrics || { totalJobs: 0, pendingJobs: 0, processingJobs: 0, completedJobs: 0 };
  const financials = dashboardData.financials || { totalOrderValue: 0, totalAdvance: 0, totalDue: 0 };
  const recentJobs = dashboardData.recentJobs || [];
  const upcomingDeliveries = dashboardData.upcomingDeliveries || [];
  const designerWorkload = dashboardData.designerWorkload || [];

  // 2. Create Job Mutation
  const createJobMutation = useMutation({
    mutationFn: (jobData) => jobService.createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsFormModalOpen(false);
    },
  });

  const handleFormSubmit = (formData) => {
    createJobMutation.mutate(formData);
  };

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Status breakdown calculations
  const total = metrics.totalJobs || 1;
  const pendingPct = Math.round(((metrics.pendingJobs || 0) / total) * 100);
  const processingPct = Math.round(((metrics.processingJobs || 0) / total) * 100);
  const completedPct = Math.round(((metrics.completedJobs || 0) / total) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Operational Dashboard"
        description="Real-time studio billing, print job status, and designer workload analytics"
        action={
          <Button
            onClick={() => setIsFormModalOpen(true)}
            icon={Plus}
            variant="primary"
            size="md"
          >
            New Job
          </Button>
        }
      />

      {/* Loading State */}
      {isLoading && <LoadingState message="Fetching live shop analytics..." />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to Load Dashboard"
          message={error?.response?.data?.message || error?.message || 'Could not connect to dashboard service.'}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <>
          {/* Top Real Database Metric Cards (2 side-by-side on mobile grid-cols-2) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
            <Card hoverEffect className="relative bg-white border-slate-200">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                    Total Jobs
                  </span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-violet-50 text-violet-600 border border-violet-100 flex items-center justify-center shadow-xs shrink-0">
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-1">
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {metrics.totalJobs}
                  </h2>
                  <Badge status="default" className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5">Total</Badge>
                </div>
              </CardContent>
            </Card>

            <Card hoverEffect className="relative bg-white border-slate-200">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                    Pending Jobs
                  </span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shadow-xs shrink-0">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-1">
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {metrics.pendingJobs}
                  </h2>
                  <Badge status="pending" className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5">Pending</Badge>
                </div>
              </CardContent>
            </Card>

            <Card hoverEffect className="relative bg-white border-slate-200">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                    Processing
                  </span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-xs shrink-0">
                    <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-1">
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {metrics.processingJobs}
                  </h2>
                  <Badge status="process" className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5">In Prod</Badge>
                </div>
              </CardContent>
            </Card>

            <Card hoverEffect className="relative bg-white border-slate-200">
              <CardContent className="p-3 sm:p-5">
                <div className="flex items-center justify-between mb-1.5 sm:mb-3">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate">
                    Completed
                  </span>
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shadow-xs shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-1">
                  <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {metrics.completedJobs}
                  </h2>
                  <Badge status="complete" className="text-[9px] sm:text-xs px-1.5 py-0.5 sm:px-2.5">Delivered</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Operational Financials Summary & Status Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 sm:gap-6">
            {/* Financial Summary Card */}
            <Card className="lg:col-span-2">
              <CardHeader className="p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100">
                <div>
                  <CardTitle className="text-sm sm:text-lg">Shop Billing & Financial Summary</CardTitle>
                  <CardDescription className="text-[11px] sm:text-xs">Live revenue totals calculated from recorded job orders</CardDescription>
                </div>
                <Badge status="active" className="self-start sm:self-auto text-[10px]">Real-Time Totals</Badge>
              </CardHeader>

              <CardContent className="p-3.5 sm:p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-2xl bg-violet-50/60 border border-violet-100 col-span-2 sm:col-span-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-violet-700 block mb-1">
                      Total Order Value
                    </span>
                    <p className="text-lg sm:text-2xl font-black font-mono text-slate-900">
                      ₹{financials.totalOrderValue.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:inline">Sum of billing amounts</span>
                  </div>

                  <div className="p-3 sm:p-4 rounded-2xl bg-blue-50/60 border border-blue-100 col-span-1">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-700 block mb-1 truncate">
                      Advance Rec.
                    </span>
                    <p className="text-lg sm:text-2xl font-black font-mono text-slate-900">
                      ₹{financials.totalAdvance.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:inline">Deposits collected</span>
                  </div>

                  <div className={`p-3 sm:p-4 rounded-2xl border col-span-1 ${
                    financials.totalDue > 0 ? 'bg-amber-50/80 border-amber-200' : 'bg-emerald-50/80 border-emerald-200'
                  }`}>
                    <span className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider block mb-1 truncate ${
                      financials.totalDue > 0 ? 'text-amber-800' : 'text-emerald-800'
                    }`}>
                      Net Due
                    </span>
                    <p className={`text-lg sm:text-2xl font-black font-mono ${
                      financials.totalDue > 0 ? 'text-amber-900' : 'text-emerald-900'
                    }`}>
                      ₹{financials.totalDue.toLocaleString('en-IN')}
                    </p>
                    <span className="text-[10px] sm:text-[11px] text-slate-600 font-semibold hidden sm:inline">Across pending jobs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Breakdown Segment */}
            <Card>
              <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
                <CardTitle className="text-base">Production Status</CardTitle>
                <CardDescription className="text-[11px] sm:text-xs">Ratio of pending vs active print jobs</CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4">
                {/* Visual Progress Bar */}
                <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-0.5 p-0.5">
                  <div style={{ width: `${pendingPct}%` }} className="bg-amber-500 rounded-l-full transition-all duration-500" title={`Pending: ${pendingPct}%`} />
                  <div style={{ width: `${processingPct}%` }} className="bg-blue-500 transition-all duration-500" title={`Processing: ${processingPct}%`} />
                  <div style={{ width: `${completedPct}%` }} className="bg-emerald-500 rounded-r-full transition-all duration-500" title={`Completed: ${completedPct}%`} />
                </div>

                <div className="space-y-2.5 text-xs font-semibold pt-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Pending Approval
                    </span>
                    <span className="font-mono font-bold text-slate-900">{metrics.pendingJobs} ({pendingPct}%)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> In Production
                    </span>
                    <span className="font-mono font-bold text-slate-900">{metrics.processingJobs} ({processingPct}%)</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Complete / Delivered
                    </span>
                    <span className="font-mono font-bold text-slate-900">{metrics.completedJobs} ({completedPct}%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section: Designer Workload & Upcoming Deliveries */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Designer Workload Card */}
            <Card>
              <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between gap-2 border-b border-slate-100">
                <div>
                  <CardTitle className="text-base">Designer Workload</CardTitle>
                  <CardDescription className="text-[11px] sm:text-xs">Active jobs per designer</CardDescription>
                </div>
                <Button
                  onClick={() => navigate('/designers')}
                  variant="ghost"
                  size="sm"
                  icon={ArrowRight}
                  className="text-violet-600 hover:text-violet-700 text-xs px-2"
                >
                  Manage
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                {designerWorkload.length === 0 ? (
                  <EmptyState
                    icon={Palette}
                    title="No active designers found"
                    description="Add graphics designers to view active job workload."
                    actionLabel="Add Designer"
                    onAction={() => navigate('/designers')}
                  />
                ) : (
                  <div className="space-y-2.5">
                    {designerWorkload.map((designer) => (
                      <div
                        key={designer.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-violet-200 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
                            {designer.name ? designer.name.charAt(0).toUpperCase() : 'D'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{designer.name}</h4>
                            <p className="text-[10px] text-slate-500 font-mono truncate">{designer.phone || designer.email || 'Active'}</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-[10px] sm:text-xs font-extrabold font-mono">
                            {designer.activeJobsCount} Active Job{designer.activeJobsCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Deliveries Card */}
            <Card>
              <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between gap-2 border-b border-slate-100">
                <div>
                  <CardTitle className="text-base">Upcoming Deliveries</CardTitle>
                  <CardDescription className="text-[11px] sm:text-xs">Scheduled for delivery soonest</CardDescription>
                </div>
                <Button
                  onClick={() => navigate('/jobs')}
                  variant="ghost"
                  size="sm"
                  icon={ArrowRight}
                  className="text-violet-600 hover:text-violet-700 text-xs px-2"
                >
                  View All
                </Button>
              </CardHeader>

              <CardContent className="p-4 sm:p-6">
                {upcomingDeliveries.length === 0 ? (
                  <EmptyState
                    icon={Calendar}
                    title="No upcoming scheduled deliveries"
                    description="Jobs with specified delivery dates will appear here."
                  />
                ) : (
                  <div className="space-y-2.5">
                    {upcomingDeliveries.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDetailsModalOpen(true);
                        }}
                        className="flex items-center justify-between p-3 rounded-2xl bg-white border border-slate-200 hover:border-violet-300 hover:shadow-xs transition-all cursor-pointer"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 truncate">{job.clientName}</h4>
                            <Badge status={job.status} className="text-[10px] px-1.5 py-0.2">{job.status}</Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{job.description}</p>
                        </div>
                        <div className="text-right shrink-0 ml-2">
                          <span className="text-xs font-bold font-mono text-slate-900 block">
                            ₹{(job.amount || 0).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono font-medium flex items-center justify-end gap-1 mt-0.5">
                            <Calendar className="w-3 h-3 text-violet-600" />
                            {formatDate(job.deliveryDate)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Section: Recent Print Jobs Table / Card */}
          <Card>
            <CardHeader className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-lg">Recent Print Jobs & Billing</CardTitle>
                <CardDescription className="text-[11px] sm:text-xs">Latest orders submitted into your printing database</CardDescription>
              </div>
              <Button
                onClick={() => navigate('/jobs')}
                variant="outline"
                size="sm"
                icon={ArrowRight}
                className="self-start sm:self-auto"
              >
                View Full Jobs List
              </Button>
            </CardHeader>

            <CardContent className="p-0">
              {recentJobs.length === 0 ? (
                <div className="p-6 sm:p-8">
                  <EmptyState
                    icon={Briefcase}
                    title="No print jobs in database"
                    description="Create your first print job order using the New Job button above."
                    actionLabel="Create First Job"
                    onAction={() => setIsFormModalOpen(true)}
                  />
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3.5">Client Name</th>
                          <th className="px-6 py-3.5">Description</th>
                          <th className="px-6 py-3.5">Designer</th>
                          <th className="px-6 py-3.5">Delivery Date</th>
                          <th className="px-6 py-3.5 text-right">Amount</th>
                          <th className="px-6 py-3.5 text-center">Status</th>
                          <th className="px-6 py-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {recentJobs.map((job) => (
                          <tr key={job._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">
                              {job.clientName}
                            </td>
                            <td className="px-6 py-4 text-slate-600 max-w-xs truncate">
                              {job.description}
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {job.designer || 'Unassigned'}
                            </td>
                            <td className="px-6 py-4 font-mono text-slate-500">
                              {formatDate(job.deliveryDate)}
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-violet-700">
                              ₹{(job.amount || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <Badge status={job.status}>{job.status}</Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => {
                                  setSelectedJob(job);
                                  setIsDetailsModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card List View */}
                  <div className="md:hidden p-3.5 space-y-2.5">
                    {recentJobs.map((job) => (
                      <div
                        key={job._id}
                        onClick={() => {
                          setSelectedJob(job);
                          setIsDetailsModalOpen(true);
                        }}
                        className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs cursor-pointer"
                      >
                        <div className="flex items-start justify-between">
                          <h4 className="text-xs font-bold text-slate-900">{job.clientName}</h4>
                          <Badge status={job.status} className="text-[10px] px-1.5 py-0.2">{job.status}</Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{job.description}</p>
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 font-mono">
                          <span className="text-slate-500">Amount: ₹{(job.amount || 0).toLocaleString('en-IN')}</span>
                          <span className="text-violet-600 font-bold text-[11px]">View Details →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {/* Modals */}
      <JobFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createJobMutation.isPending}
      />

      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        job={selectedJob}
        onEdit={(job) => {
          setIsDetailsModalOpen(false);
          navigate('/jobs');
        }}
      />
    </div>
  );
};

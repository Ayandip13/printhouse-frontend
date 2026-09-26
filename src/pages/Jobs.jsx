import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Eye,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

import { jobService } from '../services/jobService';
import { JobFormModal } from '../components/jobs/JobFormModal';
import { JobDetailsModal } from '../components/jobs/JobDetailsModal';
import { DeleteJobModal } from '../components/jobs/DeleteJobModal';
import { JobCard } from '../components/jobs/JobCard';

export const Jobs = () => {
  const queryClient = useQueryClient();

  // Modal visibility states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Selected item states
  const [selectedJob, setSelectedJob] = useState(null);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const statusFilterOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Process', label: 'Process' },
    { value: 'Complete', label: 'Complete' },
  ];

  // 1. Fetch Jobs Query using TanStack Query
  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobService.getJobs,
  });

  const jobs = jobsResponse?.data || [];

  // 2. Create Job Mutation
  const createMutation = useMutation({
    mutationFn: (jobData) => jobService.createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsFormModalOpen(false);
      setSelectedJob(null);
    },
  });

  // 3. Update Job Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, jobData }) => jobService.updateJob(id, jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsFormModalOpen(false);
      setSelectedJob(null);
    },
  });

  // 4. Delete Job Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsDeleteModalOpen(false);
      setSelectedJob(null);
    },
  });

  // Handlers for Modals
  const handleOpenCreate = () => {
    setSelectedJob(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (job) => {
    setSelectedJob(job);
    setIsFormModalOpen(true);
  };

  const handleOpenView = (job) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDelete = (job) => {
    setSelectedJob(job);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (selectedJob) {
      updateMutation.mutate({ id: selectedJob._id, jobData: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedJob) {
      deleteMutation.mutate(selectedJob._id);
    }
  };

  // Client-side filtering logic
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Status filter
      if (selectedStatus !== 'All') {
        const normStatus = (job.status || '').toLowerCase();
        const normSelected = selectedStatus.toLowerCase();
        if (normSelected === 'process' && !normStatus.includes('process')) return false;
        if (normSelected === 'complete' && !normStatus.includes('complete')) return false;
        if (normSelected === 'pending' && normStatus !== 'pending') return false;
      }

      // Search query filter (Client Name, Phone Number, Description)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = (job.clientName || '').toLowerCase().includes(query);
        const matchPhone = (job.phoneNumber || '').toLowerCase().includes(query);
        const matchDesc = (job.description || '').toLowerCase().includes(query);
        return matchName || matchPhone || matchDesc;
      }

      return true;
    });
  }, [jobs, selectedStatus, searchQuery]);

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Jobs & Orders"
        description="Centralized Excel-based billing, order tracking, and print status management"
        badge={
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Total: {jobs.length}
          </span>
        }
        action={
          <Button
            onClick={handleOpenCreate}
            icon={Plus}
            variant="primary"
            size="md"
          >
            + New Job
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-md">
              <Input
                placeholder="Search by client name, description, or phone..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-52 shrink-0 flex items-center gap-2">
              <Select
                options={statusFilterOptions}
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => refetch()}
                icon={RefreshCw}
                title="Refresh jobs list"
                className="p-2.5 text-slate-400 hover:text-slate-100 shrink-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <LoadingState message="Fetching print jobs from database..." />
      )}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to Load Jobs"
          message={error?.response?.data?.message || error?.message || 'Could not connect to job service.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Main Content View (Empty vs List) */}
      {!isLoading && !isError && (
        <>
          {filteredJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title={searchQuery || selectedStatus !== 'All' ? 'No matching jobs found' : 'No print jobs recorded yet'}
              description={
                searchQuery || selectedStatus !== 'All'
                  ? 'Try clearing your search query or changing the status filter.'
                  : 'Start recording jobs from your Excel workflow into this centralized billing and status tracker.'
              }
              actionLabel={searchQuery || selectedStatus !== 'All' ? 'Clear Filters' : 'Create First Job'}
              onAction={
                searchQuery || selectedStatus !== 'All'
                  ? () => {
                      setSearchQuery('');
                      setSelectedStatus('All');
                    }
                  : handleOpenCreate
              }
            />
          ) : (
            <>
              {/* DESKTOP TABLE VIEW (hidden on mobile, visible on md+) */}
              <div className="hidden md:block">
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-900/90 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="px-4 py-3.5">Date</th>
                          <th className="px-4 py-3.5">Client & Phone</th>
                          <th className="px-4 py-3.5">Description</th>
                          <th className="px-4 py-3.5">Designer</th>
                          <th className="px-3 py-3.5 text-center">Qty</th>
                          <th className="px-4 py-3.5 text-right">Rate</th>
                          <th className="px-4 py-3.5 text-right">Amount</th>
                          <th className="px-4 py-3.5 text-right">Advance</th>
                          <th className="px-4 py-3.5 text-right">Due</th>
                          <th className="px-4 py-3.5">Del Date</th>
                          <th className="px-4 py-3.5 text-center">Status</th>
                          <th className="px-4 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium">
                        {filteredJobs.map((job) => {
                          const amt = job.amount || (job.quantity || 0) * (job.rate || 0);
                          const adv = job.advance || 0;
                          const due = Math.max(0, amt - adv);

                          return (
                            <tr key={job._id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono">
                                {formatDate(job.date)}
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-100">
                                <div className="truncate max-w-[150px]" title={job.clientName}>
                                  {job.clientName}
                                </div>
                                {job.phoneNumber && (
                                  <div className="text-[10px] text-slate-400 font-mono font-normal flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5 text-indigo-400" />
                                    <span>{job.phoneNumber}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-200">
                                <div className="line-clamp-2 max-w-[200px]" title={job.description}>
                                  {job.description}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                                {job.designer || 'Unassigned'}
                              </td>
                              <td className="px-3 py-3 text-center font-mono font-bold text-slate-200">
                                {job.quantity}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-slate-300">
                                ₹{job.rate?.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-indigo-300">
                                ₹{amt.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-slate-300">
                                ₹{adv.toLocaleString('en-IN')}
                              </td>
                              <td className={`px-4 py-3 text-right font-mono font-bold ${
                                due > 0 ? 'text-amber-400' : 'text-emerald-400'
                              }`}>
                                ₹{due.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 text-slate-400 whitespace-nowrap font-mono">
                                {formatDate(job.deliveryDate)}
                              </td>
                              <td className="px-4 py-3 text-center whitespace-nowrap">
                                <Badge status={job.status}>{job.status}</Badge>
                              </td>
                              <td className="px-4 py-3 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleOpenView(job)}
                                    title="View Job"
                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEdit(job)}
                                    title="Edit Job"
                                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenDelete(job)}
                                    title="Delete Job"
                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

              {/* MOBILE CARD VIEW (visible on small screens, hidden on md+) */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    onView={handleOpenView}
                    onEdit={handleOpenEdit}
                    onDelete={handleOpenDelete}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Modals */}
      <JobFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        jobToEdit={selectedJob}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <JobDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        job={selectedJob}
        onEdit={handleOpenEdit}
      />

      <DeleteJobModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        job={selectedJob}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

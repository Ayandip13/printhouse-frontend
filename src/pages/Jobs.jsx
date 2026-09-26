import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  Plus,
  Search,
  Phone,
  Eye,
  Edit2,
  Trash2,
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

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const statusFilterOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Process', label: 'Process' },
    { value: 'Complete', label: 'Complete' },
  ];

  // Fetch Jobs Query
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

  // Create Job Mutation
  const createMutation = useMutation({
    mutationFn: (jobData) => jobService.createJob(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsFormModalOpen(false);
      setSelectedJob(null);
    },
  });

  // Update Job Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, jobData }) => jobService.updateJob(id, jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsFormModalOpen(false);
      setSelectedJob(null);
    },
  });

  // Delete Job Mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => jobService.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsDeleteModalOpen(false);
      setSelectedJob(null);
    },
  });

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

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (selectedStatus !== 'All') {
        const normStatus = (job.status || '').toLowerCase();
        const normSelected = selectedStatus.toLowerCase();
        if (normSelected === 'process' && !normStatus.includes('process')) return false;
        if (normSelected === 'complete' && !normStatus.includes('complete')) return false;
        if (normSelected === 'pending' && normStatus !== 'pending') return false;
      }

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
        description="Centralized billing, order tracking, and production status management"
        badge={
          <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold flex items-center gap-1.5">
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
                className="p-2.5 text-slate-500 hover:text-slate-900 shrink-0"
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

      {/* Main Content View */}
      {!isLoading && !isError && (
        <>
          {filteredJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title={searchQuery || selectedStatus !== 'All' ? 'No matching jobs found' : 'No print jobs recorded yet'}
              description={
                searchQuery || selectedStatus !== 'All'
                  ? 'Try clearing your search query or changing the status filter.'
                  : 'Start recording jobs into this centralized billing and status tracker.'
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
              {/* DESKTOP TABLE VIEW */}
              <div className="hidden md:block">
                <Card className="overflow-hidden border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
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
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredJobs.map((job) => {
                          const amt = job.amount || (job.quantity || 0) * (job.rate || 0);
                          const adv = job.advance || 0;
                          const due = Math.max(0, amt - adv);

                          return (
                            <tr key={job._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono">
                                {formatDate(job.date)}
                              </td>
                              <td className="px-4 py-3 font-bold text-slate-900">
                                <div className="truncate max-w-[150px]" title={job.clientName}>
                                  {job.clientName}
                                </div>
                                {job.phoneNumber && (
                                  <div className="text-[10px] text-slate-500 font-mono font-normal flex items-center gap-1">
                                    <Phone className="w-2.5 h-2.5 text-violet-600" />
                                    <span>{job.phoneNumber}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3 text-slate-700">
                                <div className="line-clamp-2 max-w-[200px]" title={job.description}>
                                  {job.description}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                {job.designer || 'Unassigned'}
                              </td>
                              <td className="px-3 py-3 text-center font-mono font-bold text-slate-900">
                                {job.quantity}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-slate-700">
                                ₹{job.rate?.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 text-right font-mono font-bold text-violet-700">
                                ₹{amt.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 text-right font-mono text-slate-700">
                                ₹{adv.toLocaleString('en-IN')}
                              </td>
                              <td className={`px-4 py-3 text-right font-mono font-bold ${
                                due > 0 ? 'text-amber-700' : 'text-emerald-700'
                              }`}>
                                ₹{due.toLocaleString('en-IN')}
                              </td>
                              <td className="px-4 py-3 text-slate-500 whitespace-nowrap font-mono">
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
                                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEdit(job)}
                                    title="Edit Job"
                                    className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenDelete(job)}
                                    title="Delete Job"
                                    className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

              {/* MOBILE CARD VIEW */}
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

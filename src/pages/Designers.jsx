import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Palette,
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Power,
  Sparkles,
  RefreshCw,
  AlertTriangle,
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
import { Modal } from '../components/ui/Modal';

import { designerService } from '../services/designerService';
import { DesignerFormModal } from '../components/designers/DesignerFormModal';
import { DesignerCard } from '../components/designers/DesignerCard';

export const Designers = () => {
  const queryClient = useQueryClient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDesigner, setSelectedDesigner] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const statusFilterOptions = [
    { value: 'All', label: 'All Statuses' },
    { value: 'Active', label: 'Active Only' },
    { value: 'Inactive', label: 'Inactive Only' },
  ];

  const {
    data: designersResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['designers'],
    queryFn: () => designerService.getDesigners(),
  });

  const designers = designersResponse?.data || [];

  const createMutation = useMutation({
    mutationFn: (data) => designerService.createDesigner(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsFormModalOpen(false);
      setSelectedDesigner(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => designerService.updateDesigner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designers'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsFormModalOpen(false);
      setSelectedDesigner(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => designerService.deleteDesigner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['designers'] });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setIsDeleteModalOpen(false);
      setSelectedDesigner(null);
    },
  });

  const handleOpenCreate = () => {
    setSelectedDesigner(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (designer) => {
    setSelectedDesigner(designer);
    setIsFormModalOpen(true);
  };

  const handleOpenDelete = (designer) => {
    setSelectedDesigner(designer);
    setIsDeleteModalOpen(true);
  };

  const handleToggleStatus = (designer) => {
    const nextStatus = designer.status === 'Active' ? 'Inactive' : 'Active';
    updateMutation.mutate({
      id: designer._id,
      data: { status: nextStatus },
    });
  };

  const handleFormSubmit = (formData) => {
    if (selectedDesigner) {
      updateMutation.mutate({ id: selectedDesigner._id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedDesigner) {
      deleteMutation.mutate(selectedDesigner._id);
    }
  };

  const filteredDesigners = useMemo(() => {
    return designers.filter((d) => {
      const isActive = d.status === 'Active' || d.isActive;
      if (selectedStatus === 'Active' && !isActive) return false;
      if (selectedStatus === 'Inactive' && isActive) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = (d.name || '').toLowerCase().includes(q);
        const matchEmail = (d.email || '').toLowerCase().includes(q);
        const matchPhone = (d.phone || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone;
      }

      return true;
    });
  }, [designers, selectedStatus, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Designers Directory"
        description="Manage graphics designers, active job loads, and contact details"
        badge={
          <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Total: {designers.length}
          </span>
        }
        action={
          <Button
            onClick={handleOpenCreate}
            icon={UserPlus}
            variant="primary"
            size="md"
          >
            Add Designer
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-full sm:max-w-md">
              <Input
                placeholder="Search designers by name, email, or phone..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48 shrink-0 flex items-center gap-2">
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
                title="Refresh designers list"
                className="p-2.5 text-slate-500 hover:text-slate-900 shrink-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && <LoadingState message="Loading designers directory..." />}

      {/* Error State */}
      {isError && (
        <ErrorState
          title="Failed to Load Designers"
          message={error?.response?.data?.message || error?.message || 'Could not connect to designer service.'}
          onRetry={() => refetch()}
        />
      )}

      {/* Content View */}
      {!isLoading && !isError && (
        <>
          {filteredDesigners.length === 0 ? (
            <EmptyState
              icon={Palette}
              title={searchQuery || selectedStatus !== 'All' ? 'No matching designers found' : 'No designers added yet'}
              description={
                searchQuery || selectedStatus !== 'All'
                  ? 'Try clearing your search query or changing the status filter.'
                  : 'Add graphic designers to assign incoming print and customization jobs to them.'
              }
              actionLabel={searchQuery || selectedStatus !== 'All' ? 'Clear Filters' : 'Add First Designer'}
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
                          <th className="px-6 py-3.5">Designer Name</th>
                          <th className="px-6 py-3.5">Email</th>
                          <th className="px-6 py-3.5">Phone</th>
                          <th className="px-6 py-3.5 text-center">Status</th>
                          <th className="px-6 py-3.5">Date Added</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredDesigners.map((designer) => {
                          const isActive = designer.status === 'Active' || designer.isActive;

                          return (
                            <tr key={designer._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
                                  {designer.name ? designer.name.charAt(0).toUpperCase() : 'D'}
                                </div>
                                <span>{designer.name}</span>
                              </td>
                              <td className="px-6 py-3.5 text-slate-600">
                                {designer.email || <span className="text-slate-400 italic">None</span>}
                              </td>
                              <td className="px-6 py-3.5 font-mono text-slate-700">
                                {designer.phone || <span className="text-slate-400 italic">None</span>}
                              </td>
                              <td className="px-6 py-3.5 text-center whitespace-nowrap">
                                <Badge status={isActive ? 'active' : 'inactive'}>
                                  {isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </td>
                              <td className="px-6 py-3.5 text-slate-500 font-mono">
                                {designer.createdAt
                                  ? new Date(designer.createdAt).toLocaleDateString('en-IN')
                                  : '-'}
                              </td>
                              <td className="px-6 py-3.5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleToggleStatus(designer)}
                                    title={isActive ? 'Deactivate Designer' : 'Activate Designer'}
                                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                      isActive
                                        ? 'text-amber-600 hover:bg-amber-50'
                                        : 'text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                  >
                                    <Power className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEdit(designer)}
                                    title="Edit Designer"
                                    className="p-1.5 text-slate-500 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenDelete(designer)}
                                    title="Delete / Deactivate Designer"
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
                {filteredDesigners.map((designer) => (
                  <DesignerCard
                    key={designer._id}
                    designer={designer}
                    onEdit={handleOpenEdit}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleOpenDelete}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Modals */}
      <DesignerFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        designerToEdit={selectedDesigner}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Remove or Deactivate Designer?"
        description="Preserves all existing job records associated with this designer"
        maxWidth="max-w-md"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              isLoading={deleteMutation.isPending}
            >
              Confirm Removal / Deactivation
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-slate-900">
              Designer: "{selectedDesigner?.name}"
            </p>
            <p className="text-amber-800 leading-relaxed font-medium">
              If this designer is assigned to existing jobs, they will be set to{' '}
              <strong>Inactive</strong> instead of being physically deleted, so that existing billing records remain 100% intact.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export const DeleteJobModal = ({
  isOpen,
  onClose,
  job,
  onConfirm,
  isLoading = false,
}) => {
  if (!job) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Print Job?"
      description="This action is permanent and cannot be undone."
      maxWidth="max-w-md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete Permanently
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-200">
        <div className="p-2.5 rounded-xl bg-rose-100 text-rose-600 shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1 text-xs text-rose-800">
          <h4 className="font-bold text-sm text-rose-950">Confirm Job Removal</h4>
          <p>
            Are you sure you want to delete the print job for{' '}
            <strong className="text-slate-900 font-bold">"{job.clientName}"</strong> (
            {job.description})?
          </p>
        </div>
      </div>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Palette, Plus, UserPlus, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';

export const Designers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="Designers Directory"
        description="Manage graphics designers, active job loads, and contact details"
        badge={
          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
            Designer Shell
          </span>
        }
        action={
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={UserPlus}
            variant="primary"
            size="md"
          >
            Add Designer
          </Button>
        }
      />

      {/* Clean Empty State */}
      <EmptyState
        icon={Palette}
        title="No designers added yet"
        description="Add graphic designers to assign incoming print and customization jobs to them."
        actionLabel="Add New Designer"
        onAction={() => setIsModalOpen(true)}
      />

      {/* Placeholder Designer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Designer (Preview)"
        description="Designer management will be implemented in subsequent prompts"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                alert('Designer CRUD will be enabled in upcoming prompt!');
                setIsModalOpen(false);
              }}
            >
              Save Designer (Preview)
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs text-slate-300">
          <p className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-300">
            🎨 <strong>Designer Management:</strong> Designer listing, assignment tracking, and performance analytics will be fully enabled in upcoming prompt.
          </p>

          <div className="space-y-3">
            <Input label="Designer Full Name" placeholder="e.g. Alex Rivers" disabled />
            <Input label="Email Address" placeholder="alex@printshop.com" disabled />
            <Input label="Phone Number" placeholder="+91 98765 00000" disabled />
          </div>
        </div>
      </Modal>
    </div>
  );
};

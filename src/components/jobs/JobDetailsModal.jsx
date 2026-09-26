import React from 'react';
import { Calendar, User, Phone, Briefcase, Palette, Hash, DollarSign, Clock, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const JobDetailsModal = ({ isOpen, onClose, job, onEdit }) => {
  if (!job) return null;

  const formatDate = (d) => {
    if (!d) return 'Not specified';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const amount = job.amount || (job.quantity || 0) * (job.rate || 0);
  const advance = job.advance || 0;
  const due = Math.max(0, amount - advance);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Job Details & Summary"
      description={`Reference: #${job._id ? job._id.substring(job._id.length - 6).toUpperCase() : 'JOB'}`}
      maxWidth="max-w-lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onEdit(job);
              }}
            >
              Edit Job
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-5 text-sm">
        {/* Header Status & Client Banner */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">{job.clientName}</h3>
            {job.phoneNumber && (
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>{job.phoneNumber}</span>
              </p>
            )}
          </div>
          <Badge status={job.status}>{job.status}</Badge>
        </div>

        {/* Job Description Card */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Description / Specifications
          </span>
          <p className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-medium text-xs leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Financial Breakdown Card */}
        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Financial & Rates Breakdown
          </span>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Quantity × Rate:</span>
              <p className="font-mono font-bold text-slate-100 mt-0.5">
                {job.quantity} × ₹{job.rate?.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Total Amount:</span>
              <p className="font-mono font-bold text-indigo-300 mt-0.5">
                ₹{amount.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Advance Paid:</span>
              <p className="font-mono font-bold text-slate-200 mt-0.5">
                ₹{advance.toLocaleString('en-IN')}
              </p>
            </div>

            <div className={`p-2.5 rounded-xl border font-mono font-bold ${
              due > 0 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}>
              <span>Balance Due:</span>
              <p className="text-sm mt-0.5">₹{due.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
            <Palette className="w-4 h-4 text-purple-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Designer</span>
              <span className="font-semibold text-slate-200">{job.designer || 'Unassigned'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800">
            <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Order Date</span>
              <span className="font-semibold text-slate-200">{formatDate(job.date)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800 col-span-2">
            <Clock className="w-4 h-4 text-pink-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block">Delivery Date</span>
              <span className="font-semibold text-slate-200">{formatDate(job.deliveryDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

import React from 'react';
import { Phone, Palette, Eye, Edit2, Trash2, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const JobCard = ({ job, onView, onEdit, onDelete }) => {
  const amount = job.amount || (job.quantity || 0) * (job.rate || 0);
  const advance = job.advance || 0;
  const due = Math.max(0, amount - advance);

  const formatDate = (d) => {
    if (!d) return '-';
    return new Date(d).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <Card hoverEffect className="relative overflow-hidden border-slate-200 bg-white">
      <CardContent className="p-4 sm:p-5 space-y-3.5">
        {/* Top Header: Client & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate">
              {job.clientName}
            </h3>
            {job.phoneNumber && (
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Phone className="w-3 h-3 text-violet-600 shrink-0" />
                <span>{job.phoneNumber}</span>
              </p>
            )}
          </div>
          <Badge status={job.status}>{job.status}</Badge>
        </div>

        {/* Job Description */}
        <p className="text-xs text-slate-700 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 line-clamp-2">
          {job.description}
        </p>

        {/* Financial Metrics Row */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-200 text-xs font-mono">
          <div>
            <span className="text-[10px] text-slate-500 block font-sans">Amount</span>
            <span className="font-bold text-violet-700">₹{amount.toLocaleString('en-IN')}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block font-sans">Advance</span>
            <span className="font-semibold text-slate-800">₹{advance.toLocaleString('en-IN')}</span>
          </div>

          <div>
            <span className="text-[10px] text-slate-500 block font-sans">Due</span>
            <span className={`font-bold ${due > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              ₹{due.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Info Line (Designer & Delivery Date) */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <Palette className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="truncate">{job.designer || 'Unassigned'}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 text-slate-700 font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-violet-600" />
            <span>Del: {formatDate(job.deliveryDate)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(job)}
            icon={Eye}
            className="text-xs py-1.5 px-2.5 text-slate-600 hover:text-slate-900"
          >
            View
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(job)}
            icon={Edit2}
            className="text-xs py-1.5 px-2.5 text-violet-700 hover:text-violet-900"
          >
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(job)}
            icon={Trash2}
            className="text-xs py-1.5 px-2.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

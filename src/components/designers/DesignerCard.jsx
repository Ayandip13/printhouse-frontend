import React from 'react';
import { Mail, Phone, Edit2, Trash2, Power } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const DesignerCard = ({
  designer,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const isActive = designer.status === 'Active' || designer.isActive;

  return (
    <Card hoverEffect className="relative overflow-hidden border-slate-200 bg-white">
      <CardContent className="p-4 sm:p-5 space-y-3.5">
        {/* Top Header: Name & Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-xs">
              {designer.name ? designer.name.charAt(0).toUpperCase() : 'D'}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {designer.name}
              </h3>
              <p className="text-[10px] text-slate-500 font-medium">
                Added {designer.createdAt ? new Date(designer.createdAt).toLocaleDateString('en-IN') : 'recently'}
              </p>
            </div>
          </div>
          <Badge status={isActive ? 'active' : 'inactive'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>

        {/* Contact Details */}
        <div className="space-y-1.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
          {designer.email ? (
            <div className="flex items-center gap-2 text-slate-700 truncate">
              <Mail className="w-3.5 h-3.5 text-violet-600 shrink-0" />
              <span className="truncate">{designer.email}</span>
            </div>
          ) : (
            <p className="text-[11px] text-slate-400 italic">No email provided</p>
          )}

          {designer.phone && (
            <div className="flex items-center gap-2 text-slate-700 font-mono">
              <Phone className="w-3.5 h-3.5 text-purple-600 shrink-0" />
              <span>{designer.phone}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(designer)}
            icon={Power}
            className={`text-xs py-1.5 px-2.5 ${
              isActive
                ? 'text-amber-700 hover:bg-amber-50'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {isActive ? 'Deactivate' : 'Activate'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(designer)}
            icon={Edit2}
            className="text-xs py-1.5 px-2.5 text-violet-700 hover:text-violet-900"
          >
            Edit
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(designer)}
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

import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, User, Phone, Briefcase, Palette, Hash, DollarSign, Clock } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { designerService } from '../../services/designerService';

export const JobFormModal = ({
  isOpen,
  onClose,
  jobToEdit = null,
  onSubmit,
  isLoading = false,
}) => {
  const isEdit = !!jobToEdit;

  // Fetch active designers from API
  const { data: activeDesignersRes } = useQuery({
    queryKey: ['designers', 'active'],
    queryFn: () => designerService.getDesigners(true),
    enabled: isOpen,
  });

  const activeDesigners = activeDesignersRes?.data || [];

  // Form states
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    phoneNumber: '',
    description: '',
    designer: 'Unassigned',
    quantity: 1,
    rate: 0,
    advance: 0,
    deliveryDate: '',
    status: 'Pending',
  });

  const [errors, setErrors] = useState({});

  // Reset or pre-fill form data when modal opens/changes
  useEffect(() => {
    if (jobToEdit) {
      setFormData({
        date: jobToEdit.date ? new Date(jobToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        clientName: jobToEdit.clientName || '',
        phoneNumber: jobToEdit.phoneNumber || '',
        description: jobToEdit.description || '',
        designer: jobToEdit.designer || 'Unassigned',
        quantity: jobToEdit.quantity || 1,
        rate: jobToEdit.rate || 0,
        advance: jobToEdit.advance || 0,
        deliveryDate: jobToEdit.deliveryDate ? new Date(jobToEdit.deliveryDate).toISOString().split('T')[0] : '',
        status: jobToEdit.status || 'Pending',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        clientName: '',
        phoneNumber: '',
        description: '',
        designer: 'Unassigned',
        quantity: 1,
        rate: 0,
        advance: 0,
        deliveryDate: '',
        status: 'Pending',
      });
    }
    setErrors({});
  }, [jobToEdit, isOpen]);

  // Build dynamic designer options list with backward compatibility
  const designerOptions = useMemo(() => {
    const list = [{ value: 'Unassigned', label: 'Unassigned (No Designer)' }];

    activeDesigners.forEach((d) => {
      list.push({ value: d.name, label: d.name });
    });

    const currentDes = formData.designer;
    if (
      currentDes &&
      currentDes !== 'Unassigned' &&
      !list.some((opt) => opt.value.toLowerCase() === currentDes.toLowerCase())
    ) {
      list.push({
        value: currentDes,
        label: `${currentDes} (Assigned / Inactive)`,
      });
    }

    return list;
  }, [activeDesigners, formData.designer]);

  // Live calculation of Amount and Due
  const qtyNum = Number(formData.quantity) || 0;
  const rateNum = Number(formData.rate) || 0;
  const calculatedAmount = qtyNum * rateNum;
  const advanceNum = Number(formData.advance) || 0;
  const calculatedDue = Math.max(0, calculatedAmount - advanceNum);

  const statusOptions = [
    { value: 'Pending', label: 'Pending' },
    { value: 'Process', label: 'Process (In Production)' },
    { value: 'Complete', label: 'Complete (Ready / Delivered)' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (isNaN(Number(formData.rate)) || Number(formData.rate) < 0) {
      newErrors.rate = 'Rate cannot be negative';
    }
    if (isNaN(Number(formData.advance)) || Number(formData.advance) < 0) {
      newErrors.advance = 'Advance cannot be negative';
    } else if (Number(formData.advance) > calculatedAmount) {
      newErrors.advance = `Advance (₹${Number(formData.advance).toLocaleString('en-IN')}) cannot exceed total amount (₹${calculatedAmount.toLocaleString('en-IN')})`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      rate: Number(formData.rate),
      advance: Number(formData.advance),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Print Job' : 'Create New Print Job'}
      description={
        isEdit
          ? 'Update job details, rates, assigned designer, and production status'
          : 'Enter new print job billing details and select assigned designer'
      }
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            {isEdit ? 'Save Changes' : 'Create Job'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Client Name & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <Input
            label="Client Name *"
            name="clientName"
            placeholder="e.g. Apex Corporate Solutions"
            icon={User}
            value={formData.clientName}
            onChange={handleChange}
            error={errors.clientName}
            required
          />

          <Input
            label="Phone Number"
            name="phoneNumber"
            placeholder="e.g. +91 98765 43210"
            icon={Phone}
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        {/* Row 2: Description */}
        <Input
          label="Job Description *"
          name="description"
          placeholder="e.g. Vinyl Banner Printing (10ft x 4ft) with grommets"
          icon={Briefcase}
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
        />

        {/* Row 3: Designer Select & Status */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Select
            label="Assigned Designer"
            name="designer"
            options={designerOptions}
            value={formData.designer}
            onChange={handleChange}
            placeholder=""
          />

          <Select
            label="Job Status"
            name="status"
            options={statusOptions}
            value={formData.status}
            onChange={handleChange}
            placeholder=""
          />
        </div>

        {/* Row 4: Quantity, Rate, Live Amount */}
        <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-violet-700 uppercase tracking-wider">
            <span>Pricing & Billing Calculation</span>
            <span className="text-[10px] text-slate-500 font-normal hidden sm:inline">Auto-calculated (Qty × Rate)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
            <Input
              label="Quantity *"
              name="quantity"
              type="number"
              min="1"
              placeholder="1"
              icon={Hash}
              value={formData.quantity}
              onChange={handleChange}
              error={errors.quantity}
              required
            />

            <Input
              label="Rate per Unit (₹) *"
              name="rate"
              type="number"
              min="0"
              placeholder="0"
              icon={DollarSign}
              value={formData.rate}
              onChange={handleChange}
              error={errors.rate}
              required
            />

            {/* Calculated Total Amount Display */}
            <div className="w-full space-y-1.5 col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Calculated Amount
              </label>
              <div className="px-3.5 py-2.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 font-mono font-bold text-sm flex items-center justify-between shadow-xs">
                <span>Total Amount:</span>
                <span className="text-base text-violet-900">₹{calculatedAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Row 5: Advance & Due Calculation */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
            <Input
              label="Advance Paid (₹)"
              name="advance"
              type="number"
              min="0"
              placeholder="0"
              icon={DollarSign}
              value={formData.advance}
              onChange={handleChange}
              error={errors.advance}
            />

            <div className="w-full space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Calculated Due
              </label>
              <div
                className={`px-3.5 py-2.5 rounded-xl border font-mono font-bold text-sm flex items-center justify-between shadow-xs ${
                  calculatedDue > 0
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <span>Due:</span>
                <span className="text-base">₹{calculatedDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Row 6: Dates */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Input
            label="Order Date"
            name="date"
            type="date"
            icon={Calendar}
            value={formData.date}
            onChange={handleChange}
          />

          <Input
            label="Delivery Date"
            name="deliveryDate"
            type="date"
            icon={Clock}
            value={formData.deliveryDate}
            onChange={handleChange}
          />
        </div>
      </form>
    </Modal>
  );
};

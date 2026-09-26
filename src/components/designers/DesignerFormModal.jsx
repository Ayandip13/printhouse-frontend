import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Palette } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export const DesignerFormModal = ({
  isOpen,
  onClose,
  designerToEdit = null,
  onSubmit,
  isLoading = false,
}) => {
  const isEdit = !!designerToEdit;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (designerToEdit) {
      setFormData({
        name: designerToEdit.name || '',
        email: designerToEdit.email || '',
        phone: designerToEdit.phone || '',
        status: designerToEdit.status || (designerToEdit.isActive ? 'Active' : 'Inactive'),
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'Active',
      });
    }
    setErrors({});
  }, [designerToEdit, isOpen]);

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
    if (!formData.name.trim()) {
      newErrors.name = 'Designer name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  const statusOptions = [
    { value: 'Active', label: 'Active (Available for assignments)' },
    { value: 'Inactive', label: 'Inactive (Disabled for new assignments)' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Designer' : 'Add New Designer'}
      description={
        isEdit
          ? 'Update designer contact details or active status'
          : 'Create a new graphic designer record for assigning print jobs'
      }
      maxWidth="max-w-md"
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
            {isEdit ? 'Save Changes' : 'Add Designer'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Designer Full Name *"
          name="name"
          placeholder="e.g. Alex Rivers"
          icon={User}
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="alex@printshop.com"
          icon={Mail}
          value={formData.email}
          onChange={handleChange}
        />

        <Input
          label="Phone Number"
          name="phone"
          placeholder="+91 98765 00000"
          icon={Phone}
          value={formData.phone}
          onChange={handleChange}
        />

        <Select
          label="Status"
          name="status"
          options={statusOptions}
          value={formData.status}
          onChange={handleChange}
          placeholder=""
        />
      </form>
    </Modal>
  );
};

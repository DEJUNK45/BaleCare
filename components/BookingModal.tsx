import React, { useState, useEffect } from 'react';
import { X, Hammer } from 'lucide-react';
import { TranslationData, ServiceItem, FormData } from '../types';

interface BookingModalProps {
  t: TranslationData;
  service: ServiceItem | null;
  initialData: FormData;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ t, service, initialData, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-fade-in-up">
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-lg flex items-center gap-2">
            {service ? <service.icon size={18} className="text-teal-600" /> : <Hammer size={18} className="text-teal-600" />}
            {t.bookModalTitle}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-teal-50 text-teal-800 px-4 py-2 rounded-lg text-sm mb-6 border border-teal-100">
            Service: <strong>{service ? t.categories[service.id] : 'Custom Request'}</strong>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.nameLabel}</label>
              <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="e.g. John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.phoneLabel}</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  +62
                </span>
                <input required type="number" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-r-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="8123456789" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.addressLabel}</label>
              <textarea required name="address" value={formData.address} onChange={handleInputChange} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Jalan, Gang, Nomor Villa..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.dateLabel}</label>
              <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.descLabel}</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition" placeholder="Describe the issue..." />
            </div>

            <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-600/20 mt-4">
              {t.submitButton}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
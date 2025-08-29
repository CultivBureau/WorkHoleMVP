import React, { useState, useEffect } from "react";
import { Coffee } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCreateBreakTypeMutation, useUpdateBreakTypeMutation } from "../../services/apis/BreakApi";

const BreakTypeModal = ({ show, onClose, initialData, isRtl, onSuccess }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(initialData?.name || "");
  const [duration, setDuration] = useState(initialData?.duration || 15);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [createBreakType, { isLoading: isCreating }] = useCreateBreakTypeMutation();
  const [updateBreakType, { isLoading: isUpdating }] = useUpdateBreakTypeMutation();

  useEffect(() => {
    if (show) {
      setName(initialData?.name || "");
      setDuration(initialData?.duration || 15);
      setIsActive(initialData?.isActive ?? true);
    }
  }, [show, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !duration) return;
    try {
      if (initialData?.id) {
        await updateBreakType({ id: initialData.id, name, duration, isActive }).unwrap();
      } else {
        await createBreakType({ name, duration, isActive }).unwrap();
      }
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to save break type");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-40 z-50 flex items-center justify-center">
      <form
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
        onSubmit={handleSubmit}
        style={{ direction: isRtl ? "rtl" : "ltr" }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-[#F3E8FF]">
            <Coffee size={24} style={{ color: "#8B5CF6" }} />
          </div>
          <h2 className="text-2xl font-bold">
            {initialData?.id
              ? isRtl ? "تعديل نوع الراحة" : "Edit Break Type"
              : isRtl ? "إضافة نوع راحة" : "Add Break Type"}
          </h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRtl ? "اسم نوع الراحة" : "Break Type Name"}
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:border-[#8B5CF6] focus:outline-none"
              placeholder={isRtl ? "أدخل اسم النوع" : "Enter type name"}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {isRtl ? "المدة (دقيقة)" : "Duration (minutes)"}
            </label>
            <input
              type="number"
              min={1}
              max={240}
              value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:border-[#8B5CF6] focus:outline-none"
              placeholder={isRtl ? "أدخل المدة" : "Enter duration"}
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={e => setIsActive(e.target.checked)}
              id="isActive"
            />
            <label htmlFor="isActive" className="text-sm">
              {isRtl ? "نشط" : "Active"}
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            type="button"
            className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all duration-300"
            onClick={onClose}
            disabled={isCreating || isUpdating}
          >
            {isRtl ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="submit"
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] text-white font-semibold hover:shadow-lg transition-all duration-300"
            disabled={isCreating || isUpdating}
          >
            {isCreating || isUpdating
              ? isRtl ? "جارٍ الحفظ..." : "Saving..."
              : initialData?.id
                ? isRtl ? "تحديث" : "Update"
                : isRtl ? "إضافة" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BreakTypeModal;
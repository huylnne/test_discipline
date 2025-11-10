"use client";
import CancelButtonComponent from "./CancelButtonComponent";
import DeleteButtonComponent from "./DeleteButtonComponent";

interface ConfirmDeletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

export default function ConfirmDeletePopup({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Xác nhận xóa",
  message = "Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác.",
}: ConfirmDeletePopupProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl !p-6 w-full max-w-md w-[512px] h-[178px] ">
          <h2 className="text-lg !font-bold !mb-2">{title}</h2>
          <p className="text-gray-700 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <CancelButtonComponent onClick={onClose} />
            <DeleteButtonComponent onClick={onConfirm} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
}
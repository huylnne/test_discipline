"use client";
import { useEffect } from "react";
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
  // Lock scroll khi popup mở
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "24px",
          width: "90%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          animation: "modalFadeIn 0.2s ease-out",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 700,
            marginBottom: "12px",
            color: "#1a202c",
          }}
        >
          {title}
        </h2>

        {/* Message */}
        <p
          style={{
            fontSize: "14px",
            color: "#718096",
            marginBottom: "24px",
            lineHeight: "1.6",
          }}
        >
          {message}
        </p>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <CancelButtonComponent onClick={onClose} />
          <DeleteButtonComponent onClick={onConfirm} isLoading={isLoading} />
        </div>
      </div>

      {/* Animation */}
      <style jsx global>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
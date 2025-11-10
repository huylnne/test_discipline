"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DisciplineApi from "../../../api/disciplineApi";
import CancelButtonComponent from "../../../components/CancelButtonComponent";
import SaveButtonComponent from "../../../components/SaveButtonComponent";
import { Discipline, Project } from "../../../@types/discipline";

export default function EditDisciplinePage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Discipline>({
    id: "",
    code: "",
    name: "",
    description: "",
    isActive: true,
    projectId: "",
  });

  // Load discipline data
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const sub = DisciplineApi.getById(id).subscribe({
      next: (data) => {
        if (data) {
          setFormData(data);
        } else {
          setFormData({
            id: "",
            code: "",
            name: "",
            description: "",
            isActive: true,
            projectId: "",
          });
        }
        setInitialLoading(false);
      },
      error: (err) => {
        console.error(" Load discipline error:", err);
        alert("Lỗi khi tải dữ liệu");
        setInitialLoading(false);
      },
    });

    return () => sub.unsubscribe();
  }, [id]);

  // Load projects
  useEffect(() => {
    const sub = DisciplineApi.getProjects().subscribe({
      next: (data) => setProjects(data),
      error: (err) => {
        console.error(" Load projects error:", err);
        setProjects([]);
      },
    });
    return () => sub.unsubscribe();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.projectId) {
      alert("Vui lòng nhập tên danh mục và chọn dự án.");
      return;
    }

    if (typeof id !== "string") return;

    setLoading(true);
    DisciplineApi.update(id, formData).subscribe({
      next: () => {
        setLoading(false);
        router.push("/discipline");
      },
      error: (err) => {
        setLoading(false);
        alert("Lỗi: " + err.message);
      },
    });
  };

  if (initialLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F7FAFC",
        }}
      >
        <p style={{ color: "#718096" }}>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7FAFC", paddingTop: 24 }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderBottom: "none",
          padding: "16px 24px",
          maxWidth: "1200px",
          margin: "0 auto",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => router.back()}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: "1px solid #E2E8F0",
                backgroundColor: "#FFFFFF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="#2D3748" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <h1
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#2D3748",
                margin: 0,
              }}
            >
              CHỈNH SỬA DANH MỤC
            </h1>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <CancelButtonComponent onClick={() => router.back()} />
            <SaveButtonComponent onClick={handleSave} isLoading={loading} />
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: 24 }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "0 0 8px 8px",
            padding: "24px",
            border: "1px solid #E2E8F0",
            borderTop: "none",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Dự án */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2D3748",
                  marginBottom: 8,
                }}
              >
                Dự án <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E0",
                  backgroundColor: "#FFFFFF",
                  fontSize: 14,
                  color: formData.projectId ? "#2D3748" : "#A0AEC0",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="">Chọn dự án</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Mã danh mục */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2D3748",
                  marginBottom: 8,
                }}
              >
                Mã danh mục <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                disabled
                placeholder="Mã danh mục (không thể chỉnh sửa)"
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E0",
                  backgroundColor: "#F7FAFC",
                  fontSize: 14,
                  outline: "none",
                  cursor: "not-allowed",
                  color: "#718096",
                }}
              />
            </div>

            {/* Tên danh mục */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2D3748",
                  marginBottom: 8,
                }}
              >
                Tên danh mục <span style={{ color: "#E53E3E" }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên danh mục"
                style={{
                  width: "100%",
                  height: 40,
                  padding: "0 12px",
                  borderRadius: 6,
                  border: "1px solid #CBD5E0",
                  backgroundColor: "#FFFFFF",
                  fontSize: 14,
                  outline: "none",
                }}
              />
            </div>

            {/* Trạng thái hoạt động */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2D3748",
                  marginBottom: 8,
                }}
              >
                Trạng thái hoạt động
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  style={{
                    width: 20,
                    height: 20,
                    cursor: "pointer",
                    accentColor: "#3182CE",
                  }}
                />
                <span style={{ fontSize: 14, color: "#4A5568" }}>
                  Bật để danh mục được sử dụng
                </span>
              </label>
            </div>

            {/* Mô tả */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2D3748",
                  marginBottom: 8,
                }}
              >
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả chi tiết"
                rows={4}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 6,
                  border: "1px solid #CBD5E0",
                  backgroundColor: "#FFFFFF",
                  fontSize: 14,
                  outline: "none",
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

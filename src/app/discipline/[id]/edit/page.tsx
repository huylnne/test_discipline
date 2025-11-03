"use client";
import { IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getDiscipline$,
  updateDiscipline$,
} from "../../../../services/disciplineService";
import { Discipline } from "../../../../store/disciplineSlice";
import SaveButtonComponent from "../../../components/SaveButtonComponent";
import CancelButtonComponent from "../../../components/CancelButtonComponent";

export default function EditDisciplinePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState<Discipline>({
    id: "",
    code: "",
    name: "",
    description: "",
    isActive: true,
  });

  // Load dữ liệu từ API
  useEffect(() => {
    if (!id) return;

    const sub = getDiscipline$(id).subscribe({
      next: (data) => {
        setFormData(data);
        setInitialLoading(false);
      },
      error: (err) => {
        setError("Lỗi khi tải dữ liệu: " + err.message);
        setInitialLoading(false);
      },
    });

    return () => sub.unsubscribe();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const name = target.name;
    let value: string | boolean;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      value = target.checked;
    } else {
      value = target.value;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim()) {
      setError("Mã danh mục và tên danh mục không được để trống");
      return;
    }

    setLoading(true);
    setError("");

    updateDiscipline$(id, formData).subscribe({
      next: () => {
        setLoading(false);
        router.push("/");
      },
      error: (err) => {
        setLoading(false);
        setError("Lỗi khi cập nhật danh mục: " + err.message);
      },
    });
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] flex justify-center items-center">
      <div className="w-full max-w-3xl px-6 flex flex-col gap-6">
        {/* Back Button + Title */}
        <div className="flex items-center gap-4 ">
          <IconButton
            aria-label="Go back"
            onClick={() => router.back()}
            variant="ghost"
            size="md"
          >
            <ChevronLeftIcon boxSize={6} />
          </IconButton>
          <div>
            <h1 className="custom-title text-2xl font-bold">
              Chỉnh sửa Danh mục
            </h1>
            <p className="custom-desc text-sm text-gray-500 !m-0">
              Cập nhật thông tin danh mục
            </p>
          </div>
        </div>

        {/* Form container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-[672px] p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Mã danh mục */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Nhập mã danh mục"
                className="w-full h-[40px] px-4 py-3 bg-gray-100 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Tên danh mục */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên danh mục"
                className="w-full h-[40px] px-4 py-3 bg-gray-100 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Mô tả */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả chi tiết về danh mục"
                rows={3}
                className="w-full px-4 py-3 bg-gray-100 text-gray-900 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Trạng thái hoạt động */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <label
                htmlFor="isActive"
                className="relative inline-flex items-center cursor-pointer"
              >
                <input
                  id="isActive"
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div
                  className="w-10 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer
                  peer-checked:bg-black transition-all duration-300 after:content-['']
                  after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300
                  after:border after:rounded-full after:h-4 after:w-4 after:transition-all
                  peer-checked:after:translate-x-5 peer-checked:after:border-white"
                ></div>
              </label>

              <div>
                <span className="block text-sm font-medium text-gray-700">
                  Trạng thái hoạt động
                </span>
                <p className="text-xs text-gray-500">
                  Bật để cho phép danh mục được sử dụng trong hệ thống
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-10">
            <CancelButtonComponent onClick={() => router.back()} />
            <SaveButtonComponent onClick={handleSave} isLoading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
}

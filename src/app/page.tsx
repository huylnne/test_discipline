"use client";

import { Box, Heading, Text, Input, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { useEffect, useState, useCallback } from "react";
import { setList, setLoading } from "../store/disciplineSlice";
import {
  getListDiscipline$,
  deleteDiscipline$,
} from "../services/disciplineService";
import CreateButtonComponent from "./components/CreateButtonComponent";
import ConfirmDeletePopup from "./components/ConfirmDeletePopup";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";


export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector((state: RootState) => state.discipline.list);
  const [search, setSearch] = useState("");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    dispatch(setLoading(true));
    const sub = getListDiscipline$().subscribe({
      next: (data) => {
        dispatch(setList(data));
        dispatch(setLoading(false));
      },
      error: (err) => {
        console.error("ERROR:", err);
        dispatch(setLoading(false));
      },
    });
    return () => sub.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredList = list.filter(
    (item) =>
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (id: string) => {
    setSelectedDeleteId(id);
    setDeletePopupOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedDeleteId) return;

    setDeleteLoading(true);
    deleteDiscipline$(selectedDeleteId).subscribe({
      next: () => {
        setDeleteLoading(false);
        setDeletePopupOpen(false);
        setSelectedDeleteId(null);
        loadData(); // Reload danh sách
      },
      error: () => {
        setDeleteLoading(false);
      },
    });
  };

  return (
    <Box p={8}>
      <Heading size="lg" mb={2}>
        Quản lý Danh mục
      </Heading>
      <Text mb={6}>Quản lý danh sách các danh mục trong hệ thống</Text>
      <Flex mb={4} gap={2} align="center">
        <Input
          placeholder="Tìm kiếm theo mã, tên hoặc mô tả..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="400px"
        />
        <CreateButtonComponent
          onClick={() => router.push("/discipline/create")}
        />
      </Flex>

      <Box bg="white" rounded="lg" shadow="sm" p={4}>
        <div className="overflow-x-auto">
          <table
            className="min-w-full border-separate align-middle"
            style={{ borderSpacing: "0 12px" }}
          >
            <thead>
              <tr>
                <th className="text-left px-4 py-2 flex align-middle">Mã</th>
                <th className="text-left px-4 py-2">Tên</th>
                <th className="text-left px-4 py-2">Mô tả</th>
                <th className="text-left px-4 py-2">Trạng thái</th>
                <th className="text-left px-4 py-2">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white shadow-sm rounded-lg border border-gray-300"
                  >
                    <td className="px-4 py-4 align-middle h-12">{item.code}</td>
                    <td className="px-4 py-4 align-middle">{item.name}</td>
                    <td className="px-4 py-4 align-middle">
                      {item.description}
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <span
                        className={`px-2 py-1 align-middle rounded text-sm ${
                          item.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.isActive ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <div className="flex gap-2 items-center h-full">
                        <Button
                          size="sm"
                          onClick={() =>
                            router.push(`/discipline/${item.id}/edit`)
                          }
                        >
                          ✏️ Sửa
                        </Button>
                        <Button
                          size="sm"
                          bg="red.500"
                          color="white"
                          onClick={() => handleDeleteClick(item.id!)}
                        >
                          🗑️ Xóa
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Box>

      
      <ConfirmDeletePopup
        isOpen={deletePopupOpen}
        onClose={() => setDeletePopupOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác."
      />
    </Box>
  );
}
"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store";
import { useEffect, useState, useCallback } from "react";
import { setList, setLoading } from "../store/disciplineSlice";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  getListDiscipline$,
  deleteDiscipline$,
} from "../services/disciplineService";
import CreateButtonComponent from "./components/CreateButtonComponent";
import ConfirmDeletePopup from "./components/ConfirmDeletePopup";

ModuleRegistry.registerModules([AllCommunityModule]);

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
        loadData();
      },
      error: () => {
        setDeleteLoading(false);
      },
    });
  };

  const columnDefs: ColDef[] = [
    {
      field: "code",
      headerName: "Mã danh mục",
      width: 150,
      sortable: true,
      filter: false,
    },
    {
      field: "name",
      headerName: "Tên danh mục",
      width: 250,
      flex: 1,
      sortable: true,
      filter: false,
    },
    {
      field: "description",
      headerName: "Mô tả",
      width: 300,
      flex: 1,
      sortable: true,
      filter: false,
    },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 150,
      sortable: true,
      filter: false,
      cellRenderer: (props: ICellRendererParams) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
            props.value
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {props.value ? "Đang hoạt động" : "Không hoạt động"}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Chức năng",
      width: 120,
      sortable: false,
      filter: false,
      cellClass: "text-center",
      cellRenderer: (props: ICellRendererParams) => (
        <div className="flex items-center justify-center h-full w-full gap-2">
          <button
            onClick={() => router.push(`/discipline/${props.data.id}/edit`)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition"
            title="Sửa"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.06 9.02L14.98 9.94L5.92 19H5V18.08L14.06 9.02ZM17.66 3C17.41 3 17.15 3.1 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C18.17 3.09 17.92 3 17.66 3ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19Z"
                fill="#263E90"
              />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteClick(props.data.id)}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition"
            title="Xóa"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 9V19H8V9H16ZM14.5 3H9.5L8.5 4H5V6H19V4H15.5L14.5 3ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z"
                fill="#F5222D"
              />
            </svg>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#f5f7fa]">
      <div className="flex-1 flex flex-col p-6 max-w-full">
        {/* Header */}
        <div className=" flex justify-between h-[72px] !px-2  align-middle">
          <h1 className=" flex text-3xl !font-bold text-gray-900 items-center">
            DANH SÁCH DANH MỤC
          </h1>

          {/* Search & Create Button */}
          <div className="flex h-full justify-between items-center mb-4 gap-4 ">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Tìm kiếm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-[40px] px-4 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <CreateButtonComponent
              onClick={() => router.push("/discipline/create")}
            />
          </div>
        </div>

        {/* AG-Grid Table */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm ">
          <div className="ag-theme-quartz custom-ag-theme h-full w-full">
            <AgGridReact
              theme="legacy"
              rowData={filteredList}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 15, 20, 50]}
              defaultColDef={{
                resizable: true,
                wrapText: false,
                autoHeight: false,
              }}
              domLayout="normal"
              suppressPaginationPanel={false}
              suppressRowClickSelection={true}
              animateRows={true}
              rowHeight={64}
              headerHeight={55}
            />
          </div>
        </div>

        {/* Delete Confirmation Popup */}
        <ConfirmDeletePopup
          isOpen={deletePopupOpen}
          onClose={() => {
            setDeletePopupOpen(false);
            setSelectedDeleteId(null);
          }}
          onConfirm={handleConfirmDelete}
          isLoading={deleteLoading}
          title="Xác nhận xóa"
          message="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác."
        />
      </div>
    </div>
  );
}

import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { useEffect, useState, useCallback } from "react";
import { setList, setLoading } from "../../redux/controller/discipline.slice";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import DisciplineApi from "../../api/disciplineApi";
import CreateButtonComponent from "../../components/CreateButtonComponent";
import ConfirmDeletePopup from "../../components/ConfirmDeletePopup";
import { Discipline } from "../../@types/discipline";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function HomePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector((state: RootState) => state.discipline.list);
  const [search, setSearch] = useState("");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  // Load danh sách từ API
  const loadData = useCallback(() => {
    dispatch(setLoading(true));
    const sub = DisciplineApi.getAll().subscribe({
      next: (data: Discipline[]) => {
        dispatch(setList(data));
        dispatch(setLoading(false));
      },
      error: (err: Error) => {
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
    (item: Discipline) =>
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
    DisciplineApi.delete(selectedDeleteId).subscribe({
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
    { field: "code", headerName: "Mã danh mục", width: 150, sortable: true },
    { field: "name", headerName: "Tên danh mục", width: 250, flex: 1, sortable: true },
    { field: "description", headerName: "Mô tả", width: 300, flex: 1, sortable: true },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 150,
      cellRenderer: (props: ICellRendererParams) => {
        const active = Boolean(props.value);
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "146px",
              height: "32px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 500,
              backgroundColor: active ? "#F0FFF4" : "#F7FAFC",
              color: active ? "#38A169" : "#718096",
              border: active ? "1px solid #38A169" : "1px solid #CBD5E0",
            }}
          >
            {active ? "Đang hoạt động" : "Không hoạt động"}
          </span>
        );
      },
    },
    {
      colId: "actions",
      headerName: "Chức năng",
      width: 120,
      cellRenderer: (props: ICellRendererParams) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {/* Nút sửa */}
          <button
            onClick={() => router.push(`/discipline/${props.data.id}/edit`)}
            title="Sửa"
            style={{
              padding: 8,
              borderRadius: 6,
              color: "#3182CE",
              background: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#EBF8FF")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ✏️
          </button>

          {/* Nút xoá */}
          <button
            onClick={() => handleDeleteClick(props.data.id)}
            title="Xóa"
            style={{
              padding: 8,
              borderRadius: 6,
              color: "#E53E3E",
              background: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#FFF5F5")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return (
    <div
      className="h-screen flex flex-col"
      style={{ backgroundColor: "var(--chakra-colors-pageBg)" }}
    >
      <div className="flex-1 flex flex-col p-6 max-w-full">
        {/* Header */}
        <div className="flex justify-between h-[72px] !px-2 items-center">
          <h1 className="text-3xl font-bold" style={{ color: "#1A202C" }}>
            DANH SÁCH DANH MỤC
          </h1>

          {/* Search + Button */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-[40px] px-4 rounded-lg"
              style={{
                backgroundColor: "#fff",
                border: "1px solid #CBD5E0",
                color: "#2D3748",
              }}
            />

            <CreateButtonComponent onClick={() => router.push("/discipline/create")} />
          </div>
        </div>

        {/* Bảng AG-Grid */}
        <div
          className="flex-1 rounded-lg shadow-sm mt-4"
          style={{
            backgroundColor: "#fff",
            border: "1px solid #E2E8F0",
          }}
        >
          <div className="ag-theme-quartz h-full w-full">
            <AgGridReact
              rowData={filteredList}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              defaultColDef={{
                resizable: true,
                wrapText: false,
                autoHeight: false,
              }}
              rowHeight={64}
              headerHeight={55}
              animateRows={true}
            />
          </div>
        </div>

        {/* Popup xác nhận xoá */}
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

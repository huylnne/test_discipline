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

export default function DisciplinePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const list = useSelector((state: RootState) => state.discipline.list);
  const [search, setSearch] = useState("");
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    dispatch(setLoading(true));
    const sub = DisciplineApi.getAll().subscribe({
      next: (data: Discipline[]) => {
        dispatch(setList(data));
        dispatch(setLoading(false));
      },
      error: (err: Error) => {
        console.error("❌ DisciplineApi.getAll() error:", err);
        dispatch(setLoading(false));
      },
    });
    return () => sub.unsubscribe();
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredList = list.filter((item: Discipline) => {
    const s = search.toLowerCase();
    return (
      item.code.toLowerCase().includes(s) ||
      item.name.toLowerCase().includes(s) ||
      item.description.toLowerCase().includes(s)
    );
  });

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
      error: (err) => {
        console.error(" Delete error:", err);
        setDeleteLoading(false);
      },
    });
  };

  const columnDefs: ColDef<Discipline>[] = [
    { field: "code", headerName: "Mã danh mục", width: 150, sortable: true },
    { field: "name", headerName: "Tên danh mục", flex: 1, sortable: true },
    { field: "description", headerName: "Mô tả", flex: 1.5, sortable: true },
    {
      field: "isActive",
      headerName: "Trạng thái",
      width: 180,
      cellRenderer: (props: ICellRendererParams<Discipline, boolean>) => {
        const active = Boolean(props.value);
        return (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "150px",
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
      width: 140,
      cellRenderer: (props: ICellRendererParams<Discipline>) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <button
            onClick={() => router.push(`/discipline/${props.data?.id}/edit`)}
            title="Sửa"
            style={{
              padding: 8,
              borderRadius: 6,
              color: "#3182CE",
              background: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#EBF8FF")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
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
            onClick={() => handleDeleteClick(props.data?.id || "")}
            title="Xóa"
            style={{
              padding: 8,
              borderRadius: 6,
              color: "#E53E3E",
              background: "transparent",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#FFF5F5")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
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
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--chakra-colors-pageBg)",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          padding: "16px 24px",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#2D3748",
              margin: 0,
              letterSpacing: "0.3px",
            }}
          >
            DANH SÁCH DANH MỤC
          </h1>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Tìm kiếm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                height: 38,
                width: 280,
                padding: "0 12px",
                borderRadius: 6,
                border: "1px solid #CBD5E0",
                backgroundColor: "#FFFFFF",
                fontSize: 14,
                outline: "none",
              }}
            />
            <CreateButtonComponent
              onClick={() => router.push("/discipline/create")}
            />
          </div>
        </div>
      </div>

      {/* AG Grid - Flex để chiếm hết không gian */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: 1,
            backgroundColor: "#fff",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            className="ag-theme-quartz"
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            <AgGridReact<Discipline>
              theme="legacy"
              rowData={filteredList}
              columnDefs={columnDefs}
              pagination={true}
              paginationPageSize={10}
              paginationPageSizeSelector={[10, 20, 50]}
              defaultColDef={{
                resizable: true,
                wrapText: false,
                autoHeight: false,
              }}
              domLayout="normal"
              rowHeight={64}
              headerHeight={55}
              animateRows={true}
            />
          </div>
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
  );
}
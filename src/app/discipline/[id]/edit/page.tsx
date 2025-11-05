"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Input,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getDiscipline$,
  updateDiscipline$,
  getProjects$,
} from "../../../../services/disciplineService";

export default function EditDisciplinePage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    isActive: true,
    projectId: "",
  });

  // Lấy dữ liệu danh mục
  useEffect(() => {
    if (!id) return;

    const sub = getDiscipline$(id).subscribe({
      next: (data) => {
        setFormData({
          code: data.code,
          name: data.name,
          description: data.description || "",
          isActive: data.isActive,
          projectId: data.projectId || "",
        });
        setInitialLoading(false);
      },
      error: (err) => {
        toast({
          title: "Lỗi khi tải dữ liệu",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
        setInitialLoading(false);
      },
    });

    return () => sub.unsubscribe();
  }, [id, toast]);

  // Lấy danh sách dự án
  useEffect(() => {
    const sub = getProjects$().subscribe({
      next: (data) => setProjects(data),
      error: () => setProjects([]),
    });
    return () => sub.unsubscribe();
  }, []);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked =
      type === "checkbox" ? (target as HTMLInputElement).checked : undefined;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.projectId) {
      toast({
        title: "Thiếu thông tin bắt buộc",
        description: "Vui lòng nhập mã, tên danh mục và chọn dự án.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    updateDiscipline$(id, { ...formData, id }).subscribe({
      next: () => {
        setLoading(false);
        toast({
          title: "Cập nhật thành công",
          status: "success",
          duration: 2500,
          isClosable: true,
        });
        router.push("/");
      },
      error: (err) => {
        setLoading(false);
        toast({
          title: "Lỗi khi cập nhật danh mục",
          description: err.message,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      },
    });
  };

  if (initialLoading) {
    return (
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        bg="pageBg"
      >
        <Text color="mutedText">Đang tải dữ liệu...</Text>
      </Box>
    );
  }

  return (
    <Box bg="pageBg" minH="100vh" py={8}>
      {/* Container giới hạn chiều rộng */}
      <Box px={10} w="full" maxW="6xl" mx="auto">
        {/* Header */}
        <Flex align="center" justify="space-between" mb={6}>
          <Flex align="center" gap={3}>
            <IconButton
              aria-label="Quay lại"
              onClick={() => router.back()}
              variant="ghost"
            >
              <ChevronLeftIcon boxSize={5} />
            </IconButton>
            <Heading size="md">CHỈNH SỬA DANH MỤC</Heading>
          </Flex>

          <Flex gap={3}>
            <Button variant="outline" onClick={() => router.back()}>
              Hủy bỏ
            </Button>
            <Button colorScheme="blue" onClick={handleSave} isLoading={loading}>
              Lưu thay đổi
            </Button>
          </Flex>
        </Flex>

        {/* Form box */}
        <Box bg="surface" borderRadius="md" boxShadow="sm" p={8} w="full">
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Dự án <span style={{ color: "red" }}>*</span>
              </Text>
              <select
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid var(--chakra-colors-border)",
                  backgroundColor: "var(--chakra-colors-inputBg)",
                  fontSize: "14px",
                }}
              >
                <option value="">Chọn dự án</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </GridItem>

            <GridItem>
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Mã danh mục <span style={{ color: "red" }}>*</span>
              </Text>
              <Input
                name="code"
                value={formData.code}
                isDisabled
                placeholder="Mã danh mục (không thể chỉnh sửa)"
                bg="inputBg"
                borderColor="border"
                _disabled={{
                  bg: "inputBg",
                  borderColor: "border",
                  cursor: "not-allowed",
                }}
              />
            </GridItem>

            <GridItem>
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Tên danh mục <span style={{ color: "red" }}>*</span>
              </Text>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên danh mục"
                bg="inputBg"
                borderColor="border"
                _focus={{
                  bg: "surface",
                  borderColor: "focusRing",
                  boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.5)",
                }}
              />
            </GridItem>

            <GridItem>
              <Text fontSize="sm" fontWeight="medium" mb={2}>
                Trạng thái hoạt động
              </Text>
              <Flex align="center" gap={3}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
                <Text fontSize="sm" color="mutedText">
                  Bật để danh mục được sử dụng
                </Text>
              </Flex>
            </GridItem>

            <GridItem colSpan={2}>
              <Text fontSize="sm" fontWeight="medium" mb={1}>
                Mô tả
              </Text>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Nhập mô tả chi tiết"
                rows={3}
                bg="inputBg"
                borderColor="border"
                _focus={{
                  bg: "surface",
                  borderColor: "focusRing",
                  boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.5)",
                }}
              />
            </GridItem>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
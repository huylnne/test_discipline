import { Button } from "@chakra-ui/react";

interface DeleteButtonComponentProps {
  onClick: () => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function DeleteButtonComponent({
  onClick,
  isLoading = false,
  children = "Xóa",
}: DeleteButtonComponentProps) {
  return (
    <Button
      bg="#263E90"
      color="white"
      onClick={onClick}
      isLoading={isLoading}
      fontWeight="bold"
    >
      {children}
    </Button>
  );
}
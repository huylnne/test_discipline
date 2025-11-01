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
      colorScheme="red"
      onClick={onClick}
      loading={isLoading}
      fontWeight="bold"
    >
      {children}
    </Button>
  );
}
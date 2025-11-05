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
      bg="primaryBtn"
      color="primaryBtnText"
      onClick={onClick}
      isLoading={isLoading}
      fontWeight="bold"
    >
      {children}
    </Button>
  );
}
import { Button } from "@chakra-ui/react";

interface SaveButtonComponentProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function SaveButtonComponent({
  onClick,
  isLoading = false,
  disabled = false,
}: SaveButtonComponentProps) {
  return (
    <Button
      bg="#263E90"
      color="white"
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled}
      _hover={{ bg: "gray.800" }}
    >
      Lưu
    </Button>
  );
}
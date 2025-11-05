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
      bg="primaryBtn"
      color="primaryBtnText"
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled}
      _hover={{ bg: "primaryBtnHover" }}
    >
      Lưu
    </Button>
  );
}
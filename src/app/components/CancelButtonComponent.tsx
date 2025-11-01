import { Button } from "@chakra-ui/react";

interface CancelButtonComponentProps {
  onClick: () => void;
}

export default function CancelButtonComponent({
  onClick,
}: CancelButtonComponentProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      _hover={{ bg: "gray.100" }}
    >
      Hủy
    </Button>
  );
}
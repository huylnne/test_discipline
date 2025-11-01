import { Button, ButtonProps } from "@chakra-ui/react";

interface CreateButtonComponentProps extends ButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export default function CreateButtonComponent({
  onClick,
  isLoading = false,
  ...props
}: CreateButtonComponentProps) {
  return (
    <Button
      bg="black"
      color="white"
      onClick={onClick}
      loading={isLoading}
      _hover={{ bg: "gray.800" }}
      {...props}
    >
      + Thêm mới
    </Button>
  );
}
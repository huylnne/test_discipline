// src/theme/index.ts
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  // Cấu hình semantic tokens dùng toàn dự án
  semanticTokens: {
    colors: {
      pageBg: { default: "gray.50", _dark: "gray.800" },
      surface: { default: "white", _dark: "gray.700" },
      inputBg: { default: "gray.50", _dark: "gray.600" },
      border: { default: "gray.300", _dark: "gray.600" },
      focusRing: { default: "blue.500", _dark: "blue.300" },
      mutedText: { default: "gray.600", _dark: "gray.300" },
      accentHover: { default: "blue.50", _dark: "blue.900" },
      primaryBtn: { default: "#263E90" },
      primaryBtnHover: { default: "gray.100" },
      primaryBtnText: { default: "white" },
    },
  },

  // Style global cho toàn bộ app
  styles: {
    global: {
      body: {
        bg: "pageBg",
      },
    },
  },

  // Custom style cho các component Chakra
  components: {
    Input: {
      baseStyle: {
        field: {
          bg: "inputBg",
          borderColor: "border",
          _placeholder: { color: "mutedText" },
          _focus: {
            bg: "surface",
            borderColor: "focusRing",
            boxShadow: "0 0 0 1px rgba(66,153,225,0.5)",
          },
        },
      },
    },
    Select: {
      baseStyle: {
        field: {
          bg: "inputBg",
          borderColor: "border",
          _focus: {
            bg: "surface",
            borderColor: "focusRing",
            boxShadow: "0 0 0 1px rgba(66,153,225,0.5)",
          },
        },
      },
    },
    Textarea: {
      baseStyle: {
        bg: "inputBg",
        borderColor: "border",
        _placeholder: { color: "mutedText" },
        _focus: {
          bg: "surface",
          borderColor: "focusRing",
          boxShadow: "0 0 0 1px rgba(66,153,225,0.5)",
        },
      },
    },
    Button: {
      baseStyle: {
        borderRadius: "md",
      },
      sizes: {
        md: { h: 10, fontSize: "sm" },
      },
      defaultProps: {
        colorScheme: "blue",
      },
    },
    IconButton: {
      baseStyle: {
        borderRadius: "md",
      },
    },
  },
});

export default theme;

"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store";

const theme = extendTheme({
  // cấu hình color/semantic token để dùng toàn dự án
  semanticTokens: {
    colors: {
      pageBg: { default: "gray.50", _dark: "gray.800" },
      surface: { default: "white", _dark: "gray.700" },
      inputBg: { default: "gray.50", _dark: "gray.600" },
      border: { default: "gray.300", _dark: "gray.600" },
      focusRing: { default: "blue.500", _dark: "blue.300" },
      mutedText: { default: "gray.600", _dark: "gray.300" },
      accentHover: { default: "blue.50", _dark: "blue.900" },
    },
  },

  styles: {
    global: {
      body: {
        bg: "pageBg",
      },
    },
  },

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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ReduxProvider>
  );
}
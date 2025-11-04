"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store";

// ✅ Khai báo theme (thay cho system preset)
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      {/* ✅ Dùng theme thay vì value={system} */}
      <ChakraProvider theme={theme}>
        {children}
      </ChakraProvider>
    </ReduxProvider>
  );
}

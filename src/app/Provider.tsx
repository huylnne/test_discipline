"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@chakra-ui/react/preset";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "../store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <ChakraProvider value={system}>
        {children}
      </ChakraProvider>
    </ReduxProvider>
  );
}
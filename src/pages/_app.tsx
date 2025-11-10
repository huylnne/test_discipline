import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme"; 


import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import "../theme/ag-theme.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

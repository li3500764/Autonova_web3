import '@rainbow-me/rainbowkit/styles.css'; 
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { config } from "../wagmi.config";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import { Inter } from "next/font/google";

import { darkTheme } from "@rainbow-me/rainbowkit";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} font-sans`}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>
          <RainbowKitProvider
            theme={darkTheme({
              accentColor: "#7c3aed",
              borderRadius: "medium",
              overlayBlur: "small",
            })}
            modalSize="compact"
          >
            <Component {...pageProps} />
          </RainbowKitProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </div>
  );
}

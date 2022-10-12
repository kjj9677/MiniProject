import React, { useEffect } from "react";
import { AppProps } from "next/app";
import Head from "next/head";

const KAKAO_KEY = "9d4f0287a16fbc1af34ac4a3fc7f065d";
declare global {
  interface Window {
    Kakao: any;
  }
}

const App = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_KEY);
    }
  }, []);
  return <Component {...pageProps} />;
};

export default App;

import '@solana/wallet-adapter-react-ui/styles.css';
import 'styles/index.scss';
import dynamic from 'next/dynamic';

import { createGlobalStyle } from 'styled-components';
import type { AppProps } from 'next/app';

import Header from 'components/header';
import Footer from 'components/footer';
import Head from 'next/head';
import { Provider } from 'react-redux';
import store from '../state';
import styled from 'styled-components';
import { ReactNode } from 'react';
// import { WalletProvider } from '../contexts/Wallet';
// import ResultModal from '@/components/ResultModal';

const GlobalStyle = createGlobalStyle``;

const Main = styled.section`
  padding-top: 0.72rem;
  height: 100%;
  position: relative;
  z-index: 2;
  overflow-y: auto;
  overflow-x: hidden;
  @media screen and (max-width: 768px) {
    padding-top: 0;
  }
`;

const SolanaProvider = dynamic(() => import('../contexts/Solana/Provider').then(({ SolanaProvider }) => SolanaProvider), { ssr: false });

function AppContext({ children }: { children: ReactNode }) {
  return (
    <SolanaProvider>{children}</SolanaProvider>
    // <Provider store={store}>
    //   <WalletProvider>
    //   {children}
    //   </WalletProvider>
    // </Provider>
  );
}

export async function getServerSideProps(context: any) {
  const { params, query } = context;

  return {
    props: {
      params: params ?? {},
      searchParams: query,
      headers: context.req.headers
    }
  };
}

function AiApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="icon" href="/logo.ico" />
        <title>GEAR</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="msapplication-tap-highlight" content="no" />
      </Head>
      <GlobalStyle />
      <Provider store={store}>
        <AppContext>
          <Header headers={pageProps.headers} />
          <Main id="_main_app">
            <Component {...pageProps} />
          </Main>
          <Footer />
        </AppContext>
      </Provider>
    </>
  );
}

export default AiApp;

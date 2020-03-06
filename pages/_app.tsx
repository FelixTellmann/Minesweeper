import App, { AppProps } from 'next/app';
import React from 'react';
import fetch from 'isomorphic-unfetch';
import './_app.scss';


function Layout({ pageProps, Component }) {
  return (
    <Component {...pageProps} />
  );
}


Layout.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};


export default Layout;
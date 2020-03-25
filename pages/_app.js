import Router from 'next/router';

import '../components/NProgress/style.css';
import '../components/BaseLayout/global.css';

import { initAnalytics } from '@pinjollist/next-with-analytics';

const options = {
  trackingCode: 'UA-22858312-5',
  respectDNT: true,
};

const analyticsInstance = initAnalytics(options);

export default class MyApp extends React.PureComponent {
  componentDidMount() {
    const { handleRouteChange } = analyticsInstance;
    Router.events.on('routeChangeComplete', handleRouteChange);
  }

  componentWillUnmount() {
    const { handleRouteChange } = analyticsInstance;
    Router.events.off('routeChangeComplete', handleRouteChange);
  }

  render() {
    const { Component, pageProps } = this.props;

    return <Component {...pageProps} />;
  }
}

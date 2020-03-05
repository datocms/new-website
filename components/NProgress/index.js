import React from "react";
import NProgress from "nprogress";
import Router from "next/router";
import './style.css';

class NProgressContainer extends React.Component {
  static defaultProps = {
    showAfterMs: 300
  };

  timer = null;

  routeChangeStart = () => {
    const { showAfterMs } = this.props;
    clearTimeout(this.timer);
    this.timer = setTimeout(NProgress.start, showAfterMs);
  }

  routeChangeEnd = () => {
    clearTimeout(this.timer);
    NProgress.done();
  }

  componentDidMount() {
    const { options } = this.props;

    if (options) {
      NProgress.configure(options);
    }

    Router.events.on('routeChangeStart', this.routeChangeStart);
    Router.events.on('routeChangeComplete', this.routeChangeEnd);
    Router.events.on('routeChangeError', this.routeChangeEnd);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    Router.events.off('routeChangeStart', this.routeChangeStart);
    Router.events.off('routeChangeComplete', this.routeChangeEnd);
    Router.events.off('routeChangeError', this.routeChangeEnd);
  }

  render() {
    return <div />;
  }
}

export default NProgressContainer;
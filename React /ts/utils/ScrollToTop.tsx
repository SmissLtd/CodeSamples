import React, { Component, ReactElement } from 'react';
import { Location } from 'history';
import { withRouter } from 'react-router-dom';

type ScrollToTopProps = {
  location: Location;
};

class ScrollToTop<T extends ScrollToTopProps> extends Component<T> {
  componentDidUpdate(prevProps: ScrollToTopProps): void {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      window.scrollTo(0, 0);
    }
  }

  render(): ReactElement {
    return <></>;
  }
}

export default withRouter(ScrollToTop);

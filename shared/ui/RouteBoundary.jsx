import React from 'react';

export default class RouteBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="zh-status-page" role="alert" data-route-error>
        <h1>This guide couldn’t load.</h1>
        <p>Your connection may have dropped, or a new version may be available. Reload to try again.</p>
        <button className="zh-status-page__action" onClick={() => window.location.reload()}>Reload guide</button>
        <a href="/">Return to the Hub</a>
      </section>
    );
  }
}

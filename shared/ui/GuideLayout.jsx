import React from 'react';
import './GuideLayout.css';

export function GuideHero({ kicker, title, description, children }) {
  return (
    <header className="zh-guide-hero">
      {kicker && <span className="zh-guide-kicker">{kicker}</span>}
      <h2 className="zh-guide-title">{title}</h2>
      {description && <p className="zh-guide-description">{description}</p>}
      {children && <div className="zh-guide-hero-actions">{children}</div>}
    </header>
  );
}

export function GuideSection({ kicker, title, description, children, className = '' }) {
  return (
    <section className={`zh-guide-section ${className}`.trim()}>
      {(kicker || title || description) && (
        <div className="zh-guide-section-heading">
          {kicker && <span className="zh-guide-kicker">{kicker}</span>}
          {title && <h3>{title}</h3>}
          {description && <p>{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

export function GuideStepList({ children, className = '' }) {
  return <div className={`zh-guide-step-list ${className}`.trim()}>{children}</div>;
}

export function GuideStepCard({ step, title, summary, label, children, className = '' }) {
  return (
    <article className={`zh-guide-step-card ${className}`.trim()}>
      <div className="zh-guide-step-marker" aria-hidden="true">
        {step ?? '•'}
      </div>
      <div className="zh-guide-step-content">
        {label && <span className="zh-guide-step-label">{label}</span>}
        <h4>{title}</h4>
        {summary && <p>{summary}</p>}
        {children}
      </div>
    </article>
  );
}

export function GuideCallout({ label, children, tone = 'info', className = '' }) {
  return (
    <aside className={`zh-guide-callout zh-guide-callout--${tone} ${className}`.trim()}>
      {label && <strong>{label}</strong>}
      <div>{children}</div>
    </aside>
  );
}

export function GuideChip({ children }) {
  return <span className="zh-guide-chip">{children}</span>;
}

import React from 'react';
import {
  GuideCallout,
  GuideChip,
  GuideHero,
} from '../../../../shared/ui/GuideLayout';
import '../styles/pages/Bows.css';
import '../styles/pages/BowGuideCompact.css';

type BowStep = {
  title: string;
  detail: string;
};

type BowGuideData = {
  id: string;
  name: string;
  shortName: string;
  kicker: string;
  accent: string;
  difficulty: string;
  start: string;
  intro: string;
  warning?: string;
  video: {
    id: string;
    start: number;
    author: string;
    link: string;
  };
  steps: readonly BowStep[];
  tips: readonly string[];
};

interface BowGuideProps {
  guide: BowGuideData;
}

const BowGuide: React.FC<BowGuideProps> = ({ guide }) => {
  const embedUrl = `https://www.youtube.com/embed/${guide.video.id}?start=${guide.video.start}&rel=0&modestbranding=1`;

  return (
    <article className={`de-bow-guide de-bow-guide--${guide.accent}`}>
      <GuideHero kicker={guide.kicker} title={guide.shortName} description={guide.intro}>
        <GuideChip>{guide.difficulty}</GuideChip>
        <GuideChip>Start: {guide.start}</GuideChip>
      </GuideHero>

      {guide.warning && (
        <GuideCallout label="Important" tone="warning" className="de-bow-warning">
          {guide.warning}
        </GuideCallout>
      )}

      <section className="de-bow-sheet">
        <div className="de-bow-sheet__heading">
          <span>Upgrade Route</span>
          <h2>{guide.shortName}</h2>
        </div>

        <ol className="de-bow-steps">
          {guide.steps.map((step, index) => (
            <li key={`${guide.id}-${step.title}`}>
              <span className="de-bow-step-number">{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {guide.tips.length > 0 && (
        <section className="de-bow-notes">
          <h2>Quick Notes</h2>
          <ul>
            {guide.tips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </section>
      )}

      <details className="de-bow-video-reference">
        <summary>Need to see the shot? Open video reference</summary>
        <div className="de-bow-video">
          <iframe
            src={embedUrl}
            title={`${guide.shortName} video guide`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="de-bow-credit">
          Video reference by{' '}
          <a href={guide.video.link} target="_blank" rel="noopener noreferrer">
            {guide.video.author}
          </a>
        </p>
      </details>
    </article>
  );
};

export default BowGuide;

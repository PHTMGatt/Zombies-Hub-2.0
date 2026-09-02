import React from 'react';
import {
  GuideCallout,
  GuideChip,
  GuideHero,
  GuideSection,
  GuideStepCard,
  GuideStepList,
} from '../../../../shared/ui/GuideLayout';
import '../styles/pages/Bows.css';

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
        <GuideChip>{guide.name}</GuideChip>
        <GuideChip>{guide.difficulty}</GuideChip>
        <GuideChip>Start: {guide.start}</GuideChip>
      </GuideHero>

      {guide.warning && (
        <GuideCallout label="Important" tone="warning" className="de-bow-warning">
          {guide.warning}
        </GuideCallout>
      )}

      <GuideSection
        kicker="Upgrade Route"
        title={`${guide.shortName} — Step by Step`}
        description="Built for a live run: read the objective, finish it in game, then move straight to the next card."
      >
        <GuideStepList>
          {guide.steps.map((step, index) => (
            <GuideStepCard
              key={`${guide.id}-${step.title}`}
              step={index + 1}
              label={index === guide.steps.length - 1 ? 'Finish' : `Step ${index + 1}`}
              title={step.title}
              summary={step.detail}
            />
          ))}
        </GuideStepList>
      </GuideSection>

      <GuideSection kicker="Run Notes" title="What usually saves the attempt">
        <div className="de-bow-tips">
          {guide.tips.map((tip) => (
            <GuideCallout key={tip} label="Tip">
              {tip}
            </GuideCallout>
          ))}
        </div>
      </GuideSection>

      <GuideSection
        kicker="Video Reference"
        title="Need to see the shot?"
        description="The written route is the primary guide. Use the video only when a location, symbol, or angle is easier to recognize visually."
      >
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
      </GuideSection>
    </article>
  );
};

export default BowGuide;

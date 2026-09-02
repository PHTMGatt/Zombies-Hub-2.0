import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import { deGuide } from '../data/deGuide';
import '../styles/pages/Home.css';

const Home: React.FC = () => {
  const playerRef = useRef<any>(null);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);

  const seekTo = (time: string, label: string) => {
    const [min = 0, sec = 0] = time.split(':').map(Number);
    const seconds = min * 60 + sec;

    setSelectedStep(label);
    playerRef.current?.seekTo?.(seconds, true);
    playerRef.current?.playVideo?.();
  };

  const videoId = 'NhDv6R5YPEs';

  return (
    <main className="de-home-page">
      <GuideHero
        kicker="Der Eisendrache"
        title="Main Easter Egg Guide"
        description="A quick-reference path through the quest. Choose the step you are on and the video jumps directly to that section."
      >
        <GuideChip>Castle</GuideChip>
        <GuideChip>Main Easter Egg</GuideChip>
        <GuideChip>Timestamp-assisted</GuideChip>
      </GuideHero>

      <GuideSection
        kicker="Video Reference"
        title="See the step, then get back in game"
        description="Use the written order first. The video is there when a location, interaction, or timing is easier to recognize visually."
        className="de-video-section"
      >
        <div className="de-video-panel">
          <YouTube
            videoId={videoId}
            opts={{
              width: '100%',
              height: '440',
              playerVars: {
                autoplay: 0,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                playsinline: 1,
              },
            }}
            onReady={(event) => {
              playerRef.current = event.target;
            }}
            className="de-youtube"
            iframeClassName="de-youtube__iframe"
            title="Der Eisendrache Easter Egg guide video"
          />
          <div className="de-video-status">
            <span>Current reference</span>
            <strong>{selectedStep ?? 'Choose a step below'}</strong>
          </div>
        </div>
      </GuideSection>

      <GuideSection
        kicker="Quest Flow"
        title="Main Easter Egg Steps"
        description="The page is intentionally ordered like a run. Read the objective, tap it only when you need the matching video reference."
      >
        <GuideStepList>
          {deGuide.mainEE.map((step, index) => (
            <button
              key={`${step.time}-${step.label}`}
              type="button"
              className={`de-step-button ${selectedStep === step.label ? 'is-active' : ''}`}
              onClick={() => seekTo(step.time, step.label)}
              title={`Jump to ${step.time}`}
            >
              <GuideStepCard
                step={index + 1}
                label={`Video ${step.time}`}
                title={step.label}
                summary="Open this timestamp only if you need a visual reference for the objective."
              />
            </button>
          ))}
        </GuideStepList>
      </GuideSection>

      {Array.isArray(deGuide.bossFight) && deGuide.bossFight.length > 0 && (
        <GuideSection
          kicker="Finale"
          title="Boss Fight"
          description="Keep the boss sequence separate from the setup so the endgame is easy to scan when the run gets hectic."
        >
          <GuideStepList>
            {deGuide.bossFight.map((step, index) => (
              <button
                key={`${step.time}-${step.label}`}
                type="button"
                className={`de-step-button de-step-button--boss ${selectedStep === step.label ? 'is-active' : ''}`}
                onClick={() => seekTo(step.time, step.label)}
                title={`Jump to ${step.time}`}
              >
                <GuideStepCard
                  step={index + 1}
                  label={`Boss · ${step.time}`}
                  title={step.label}
                  summary="Tap for the matching boss-fight video segment."
                />
              </button>
            ))}
          </GuideStepList>
        </GuideSection>
      )}
    </main>
  );
};

export default Home;

import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import {
  GuideCallout,
  GuideChip,
  GuideHero,
  GuideSection,
  GuideStepCard,
  GuideStepList,
} from '../../../../shared/ui/GuideLayout';
import { deGuide } from '../data/deGuide';
import '../styles/pages/Home.css';

const Home: React.FC = () => {
  const playerRef = useRef<any>(null);
  const [selectedReference, setSelectedReference] = useState('Choose a phase below');

  const seekTo = (time: string, label: string) => {
    const [min = 0, sec = 0] = time.split(':').map(Number);
    playerRef.current?.seekTo?.(min * 60 + sec, true);
    playerRef.current?.playVideo?.();
    setSelectedReference(label);
  };

  return (
    <main className="de-home-page">
      <GuideHero
        kicker="Der Eisendrache · My Brother’s Keeper"
        title="Main Easter Egg Run Guide"
        description="A complete run-first path from the three dragons to the Summoning Key. The written guide is primary; timestamps are there only when you need to see something."
      >
        <GuideChip>Black Ops III</GuideChip>
        <GuideChip>Main Quest</GuideChip>
        <GuideChip>Solo & Co-op</GuideChip>
        <GuideChip>Boss Fight Included</GuideChip>
      </GuideHero>

      <nav className="de-run-nav" aria-label="Der Eisendrache quest phases">
        {deGuide.phases.map((phase) => (
          <a key={phase.id} href={`#de-${phase.id}`}>{phase.kicker.replace('Phase ', '')}</a>
        ))}
        <Link to="/maps/der-eisendrache/boss">Boss</Link>
      </nav>

      <GuideSection
        kicker="Before Round Management Gets Ugly"
        title="Run Setup"
        description="Do these naturally while opening the castle. You do not need to finish every gear item immediately, but starting them early prevents dead rounds later."
      >
        <div className="de-preflight-grid">
          {deGuide.preflight.map((item, index) => (
            <div key={item} className="de-preflight-item">
              <span>{index + 1}</span>
              <p>{item}</p>
            </div>
          ))}
        </div>
        <GuideCallout label="Bow count">
          Solo normally needs one upgraded bow. Co-op normally needs one upgraded bow per player. Local/private rule quirks can force additional bows, so do not assume a solo requirement applies to every lobby type.
        </GuideCallout>
      </GuideSection>

      <GuideSection
        kicker="Reference Video"
        title="Keep it parked until you need it"
        description="Each phase has a jump button. Finish the written objective in game first; use the video when an interaction or location is easier to recognize visually."
      >
        <div className="de-video-panel">
          <YouTube
            videoId={deGuide.videoId}
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
            onReady={(event) => { playerRef.current = event.target; }}
            className="de-youtube"
            iframeClassName="de-youtube__iframe"
            title="Der Eisendrache main Easter Egg video reference"
          />
          <div className="de-video-status">
            <span>Current reference</span>
            <strong>{selectedReference}</strong>
          </div>
        </div>
      </GuideSection>

      {deGuide.phases.map((phase) => (
        <div key={phase.id} id={`de-${phase.id}`} className="de-phase-anchor">
          <GuideSection
            kicker={phase.kicker}
            title={phase.title}
            description={phase.summary}
          >
            <div className="de-phase-toolbar">
              <span>{phase.steps.length} objectives</span>
              <button type="button" onClick={() => seekTo(phase.time, phase.title)}>
                Watch from {phase.time}
              </button>
            </div>

            {'warning' in phase && phase.warning && (
              <GuideCallout label="Do this exactly" tone="warning">
                {phase.warning}
              </GuideCallout>
            )}

            <GuideStepList>
              {phase.steps.map((step, index) => (
                <GuideStepCard
                  key={`${phase.id}-${step.title}`}
                  step={index + 1}
                  label={step.danger ? 'Do not miss this' : phase.kicker}
                  title={step.title}
                  summary={step.detail}
                  className={step.danger ? 'de-danger-step' : ''}
                />
              ))}
            </GuideStepList>
          </GuideSection>
        </div>
      ))}

      <GuideSection
        kicker="No-Return Point"
        title="The Keeper Boss"
        description="Once everyone plants the Ragnaroks on the Pyramid tiles, stop using the main run page. The dedicated boss page is built to stay readable while you are actually fighting."
      >
        <div className="de-boss-launch">
          <div>
            <strong>5 phases</strong>
            <span>Keeper → Panzers → Keeper → Panzers → Keeper</span>
          </div>
          <Link to="/maps/der-eisendrache/boss">Open Boss Fight Guide →</Link>
        </div>
      </GuideSection>

      <GuideSection kicker="After the Fight" title="Finish My Brother’s Keeper">
        <GuideStepList>
          {deGuide.ending.map((step, index) => (
            <GuideStepCard
              key={step}
              step={index + 1}
              label="Ending"
              title={index === 0 ? 'Take the Summoning Key' : index === 1 ? 'Return to the Clock Tower terminal' : 'Trigger the ending'}
              summary={step}
            />
          ))}
        </GuideStepList>
      </GuideSection>
    </main>
  );
};

export default Home;

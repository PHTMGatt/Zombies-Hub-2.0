import React from "react";
import { Link } from "react-router-dom";
import CompleteEasterEgg from "../../../../shared/achievements/CompleteEasterEgg";
import useHashLanding from "../../../../shared/guide/useHashLanding";
import GuideReferences from "../../../../shared/guide/GuideReferences";
import originsGuide, { originsTips } from "../data/originsGuide";
import SkullIcon from "../assets/images/Skull.png";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";

type Ref = { type: string; [key: string]: unknown };
type Step = {
  id: string;
  title: string;
  goal: string;
  critical?: string[];
  refs?: Ref[];
  how?: string[];
  problems?: string[];
};

/*
 * The Main Guide owns the sequence: step name, one action, next step. Warnings sit in the step they
 * belong to; a closed Details holds the rest of that Easter Egg step. Staff how-to never appears here:
 * the staff tabs own it.
 */
function MainStep({ step }: { step: Step }) {
  const details = [...(step.how ?? []), ...(step.problems ?? [])];
  // Facts and chips are the answer at a glance (which robot, which footprints); sequences only restate
  // the action, so they wait in Details.
  const glance = step.refs?.filter((ref) => ref.type === 'facts' || ref.type === 'chips') ?? [];
  const deeper = step.refs?.filter((ref) => !glance.includes(ref)) ?? [];
  return (
    <li className="run-step" id={step.id}>
      <h3>{step.title}</h3>
      <p className="run-step__goal">{step.goal}</p>
      {step.critical?.map((text) => (
        <p key={text} className="run-step__warn" role="note"><strong>Watch out:</strong> {text}</p>
      ))}
      {glance.length > 0 && <GuideReferences refs={glance} />}
      {(details.length > 0 || deeper.length > 0) && (
        <details className="run-step__details">
          <summary>Details</summary>
          {deeper.length > 0 && <GuideReferences refs={deeper} />}
          {details.length > 0 && <ul>{details.map((line) => <li key={line}>{line}</li>)}</ul>}
        </details>
      )}
    </li>
  );
}

const SpeedRunLink = ({ className }: { className: string }) => (
  <Link to="/maps/origins/speed-run" className={`origins-speedrun ${className}`}>
    <span className="origins-speedrun__label">Origins Speed Run</span>
    <span className="origins-speedrun__desc">Routing, skips, staff dupes and the Lightning quick reference</span>
  </Link>
);

const steps = originsGuide as Step[];

const MainGuide = () => {
  useHashLanding(steps.map((step) => step.id));
  return (
    <div className="origins-page origins-guide">
      <section className="origins-panel origins-steps" aria-labelledby="main-steps-title">
        <h2 id="main-steps-title"><img src={SkullIcon} alt="" className="origins-panel__icon" /> Main Steps</h2>
        <ol className="run-sheet__steps">
          {steps.map((step) => <MainStep key={step.id} step={step} />)}
        </ol>
        <div className="origins-steps__complete"><CompleteEasterEgg mapId="origins" /></div>
      </section>

      <SpeedRunLink className="origins-speedrun--phone" />

      <aside className="origins-guide__side">
        <section className="origins-panel origins-tips" aria-labelledby="tips-title">
          <h2 id="tips-title"><img src={SkullIcon} alt="" className="origins-panel__icon" /> Tips</h2>
          <ul>{originsTips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
          <p className="origins-tips__credits">
            <em>MrRoflWaffles – Staff Images</em>
            <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">Kronorium.com</a>
          </p>
          <div className="audio-players">
            <audio controls aria-label="Origins robot radio message" src={Audio1} preload="none"></audio>
            <audio controls aria-label="Origins zombie intro" src={Audio2} preload="none"></audio>
          </div>
        </section>
        <SpeedRunLink className="origins-speedrun--wide" />
      </aside>
    </div>
  );
};

export default MainGuide;

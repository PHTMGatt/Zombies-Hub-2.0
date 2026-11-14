import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CompleteEasterEgg from "../../../../shared/achievements/CompleteEasterEgg";
import useHashLanding from "../../../../shared/guide/useHashLanding";
import GuideReferences from "../../../../shared/guide/GuideReferences";
import OriginsMap from "../components/OriginsMap";
import originsGuide, { originsTips } from "../data/originsGuide";
import { stepPlaces, TUNNELS } from "../data/originsPlaces";
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
type Pin = { kind: string; x: number; y: number; text: string };
type Places = { pins: Pin[]; layers?: string[] };

/*
 * The shape of Little Lost Girl: eight named quest steps (Secure the Keys → Freedom), numbered as the
 * game names them, with the three builds they need (the staffs, Thunder Fists, G-Strike) set in sequence
 * as unnumbered prep marked with the step they unlock. Staff how-to never appears here: the staff tabs own it.
 */
const QUEST_NUMBER: Record<string, number> = {
  "upgrade-staffs": 1,
  "secure-keys": 2,
  "rain-fire": 3,
  "unleash-horde": 4,
  "winged-beast": 5,
  "fist-of-iron": 6,
  "raise-hell": 7,
  freedom: 8,
};
const NEEDED_FOR: Record<string, number> = { "build-staffs": 1, "thunder-fists": 6, "g-strike": 3 };
const PLACES = stepPlaces as Record<string, Places>;

// Wide screens keep the map beside the steps; narrower ones open it inside the step.
const WIDE = "(min-width: 1000px)";
function useWide() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(WIDE).matches);
  useEffect(() => {
    const query = window.matchMedia(WIDE);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return wide;
}

const TunnelLegend = () => (
  <>
    <p className="omap__note">Choose Map on a step to mark where it happens.</p>
    <ul className="omap__legend">
      {TUNNELS.map((tunnel) => (
        <li key={tunnel.staff}><span className={`omap__legend-dot omap__legend-dot--${tunnel.staff}`} aria-hidden="true" />{tunnel.label}</li>
      ))}
    </ul>
  </>
);

type MainStepProps = { step: Step; mapped: boolean; wide: boolean; onMap: (id: string) => void; inlineMap: React.ReactNode };

// The Map button's id for the map it opens inside its step (below the wide layout).
const inlineMapId =(id: string) => `map-${id}`;

function MainStep({ step, mapped, wide, onMap, inlineMap }: MainStepProps) {
  const details = [...(step.how ?? []), ...(step.problems ?? [])];
  // Facts and chips are the answer at a glance (which robot, which footprints); sequences only restate
  // the action, so they wait in Details.
  const glance = step.refs?.filter((ref) => ref.type === "facts" || ref.type === "chips") ?? [];
  const deeper = step.refs?.filter((ref) => !glance.includes(ref)) ?? [];
  const number = QUEST_NUMBER[step.id];
  const neededFor = NEEDED_FOR[step.id];
  return (
    <li className={`run-step ${number ? "run-step--quest" : "run-step--prep"}${mapped ? " is-mapped" : ""}`} id={step.id}>
      <span className="run-step__mark" aria-hidden="true">{number ?? ""}</span>
      <span className="visually-hidden">{number ? `Step ${number}.` : `Prep for step ${neededFor}.`}</span>
      <div className="run-step__head">
        <h3>{step.title}</h3>
        {/* Wide: a toggle for the side map, whose heading announces the step. Narrow: a disclosure that
            opens the map inside this step. */}
        {PLACES[step.id] && (
          <button
            type="button"
            className="run-step__map"
            {...(wide
              ? { "aria-pressed": mapped, "aria-controls": "origins-map" }
              : { "aria-expanded": mapped, "aria-controls": inlineMapId(step.id) })}
            onClick={() => onMap(step.id)}
          >
            <svg viewBox="0 0 16 20" aria-hidden="true"><path d="M8 1a7 7 0 0 0-7 7c0 5 7 11 7 11s7-6 7-11a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 8 5.5a2.5 2.5 0 0 1 0 5Z" /></svg>
            Map
          </button>
        )}
      </div>
      {neededFor && <p className="run-step__for">Needed for step {neededFor}</p>}
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
      {inlineMap}
    </li>
  );
}

const steps = originsGuide as Step[];

const MainGuide = () => {
  useHashLanding(steps.map((step) => step.id));
  const wide = useWide();
  const [mapped, setMapped] = useState<string | null>(null);
  const toggle = (id: string) => setMapped((current) => (current === id ? null : id));
  const mappedStep = steps.find((step) => step.id === mapped);
  const places = mapped ? PLACES[mapped] : undefined;

  return (
    <div className="origins-page origins-guide">
      <section className="origins-panel origins-steps" aria-labelledby="main-steps-title">
        <h2 id="main-steps-title"><img src={SkullIcon} alt="" className="origins-panel__icon" /> Main Steps</h2>
        <ol className="run-sheet__steps">
          {steps.map((step) => (
            <MainStep
              key={step.id}
              step={step}
              mapped={mapped === step.id}
              wide={wide}
              onMap={toggle}
              inlineMap={!wide && mapped === step.id && places
                ? <OriginsMap id={inlineMapId(step.id)} className="run-step__inline-map" title={`Where: ${step.title}`} pins={places.pins} layers={places.layers} />
                : null}
            />
          ))}
        </ol>
        <div className="origins-steps__complete"><CompleteEasterEgg mapId="origins" /></div>
      </section>

      {wide && (
        <aside className="origins-guide__map" id="origins-map" aria-labelledby="origins-map-title">
          <h2 id="origins-map-title" aria-live="polite">{mappedStep ? mappedStep.title : "The map"}</h2>
          <OriginsMap
            title={mappedStep ? `Where: ${mappedStep.title}` : "Origins zones and the four staff tunnels"}
            pins={places?.pins ?? []}
            layers={places?.layers ?? []}
            empty={<TunnelLegend />}
          />
        </aside>
      )}

      <div className="origins-guide__more">
        <Link to="/maps/origins/speed-run" className="origins-speedrun">
          <span className="origins-speedrun__label">Origins Speed Run</span>
          <span className="origins-speedrun__desc">Routing, skips, staff dupes and the Lightning quick reference</span>
        </Link>
        <section className="origins-panel origins-tips" aria-labelledby="tips-title">
          <h2 id="tips-title"><img src={SkullIcon} alt="" className="origins-panel__icon" /> Tips</h2>
          <ul>{originsTips.map((tip) => <li key={tip}>{tip}</li>)}</ul>
          <p className="origins-tips__credits">
            <em>MrRoflWaffles – Staff Images</em>
            <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">Kronorium.com</a>
          </p>
          <div className="audio-players">
            <figure>
              <figcaption aria-hidden="true">Robot radio message</figcaption>
              <audio controls aria-label="Origins robot radio message" src={Audio1} preload="none"></audio>
            </figure>
            <figure>
              <figcaption aria-hidden="true">Zombie intro</figcaption>
              <audio controls aria-label="Origins zombie intro" src={Audio2} preload="none"></audio>
            </figure>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainGuide;

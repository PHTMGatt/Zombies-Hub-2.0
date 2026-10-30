import React, { useEffect } from "react";
import GuideSteps from "../../../../shared/guide/GuideSteps";
import { useGuideDepth, useGuideProgress } from "../../../../shared/guide/useGuideProgress";
import originsGuide from "../data/originsGuide";
import { SpeedrunLocked, SpeedrunUnlocked } from "../components/SpeedrunGate";
import { useSpeedrunUnlock } from "../components/speedrunUnlock";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";

// Three depths over one progression. A fourth, Speedrun, is earned (tracker or the Electrical Panel).
const DEPTHS = [
  { id: "low", label: "Low", sub: "codes", show: { critical: true } },
  { id: "medium", label: "Medium", sub: "steps", show: { goal: true, critical: true } },
  { id: "high", label: "High", sub: "full", show: { goal: true, critical: true, detail: true } },
];
const DEPTH_IDS = [...DEPTHS.map((depth) => depth.id), "speedrun"];

const QUICK_REFS = [
  { label: "Staff build codes", stepId: "build-staffs" },
  { label: "Staff upgrades", stepId: "upgrade-staffs" },
  { label: "Lightning switch board", to: "/maps/origins/lightning-staff" },
];

const MainGuide = () => {
  const progress = useGuideProgress("origins", originsGuide);
  const [depth, setDepth] = useGuideDepth(DEPTH_IDS, "zh-origins-depth");
  const { unlocked, unlock } = useSpeedrunUnlock();
  const finished = progress.completed === progress.total;

  // Finishing the tracker earns Speedrun mode for good (announced by the hub's achievement popup).
  useEffect(() => {
    if (finished && !unlocked) unlock();
  }, [finished, unlocked, unlock]);

  const speedrun = depth === "speedrun";

  return (
    <div className="main-guide origins-guide">
      <div className="origins-guide__inner">
        <GuideSteps
          guideId="origins"
          mapId="origins"
          quickRefs={QUICK_REFS}
          label="Little Lost Girl"
          steps={originsGuide}
          depths={DEPTHS}
          depth={speedrun ? "" : depth}
          onDepthPress={setDepth}
          progress={progress}
          selectorExtra={(
            <button
              type="button"
              className={`guide-mode__secret${unlocked ? " is-unlocked" : ""}`}
              aria-pressed={speedrun}
              aria-label={unlocked ? "Speedrun mode" : "Speedrun mode (locked) — complete the circuit"}
              onClick={() => setDepth("speedrun")}
            >
              <span aria-hidden="true">{unlocked ? "⏱" : "???"}</span>
              <span className="guide-mode__secret-label">{unlocked ? " Speedrun" : " Complete the circuit"}</span>
            </button>
          )}
          override={speedrun ? (
            unlocked ? <SpeedrunUnlocked /> : <SpeedrunLocked completed={progress.completed} total={progress.total} />
          ) : undefined}
        />


        {/* Credits and the two radio clips are extras: tucked away so they never sit between the step and play. */}
        <details className="origins-guide__credits">
          <summary>Credits + radio audio</summary>
          <p className="credits">
            <em>MrRoflWaffles – Staff Images</em>
            <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">Kronorium.com</a>
          </p>
          <div className="audio-players">
            <audio controls aria-label="Origins robot radio message" src={Audio1} preload="none"></audio>
            <audio controls aria-label="Origins zombie intro" src={Audio2} preload="none"></audio>
          </div>
        </details>
      </div>
    </div>
  );
};

export default MainGuide;

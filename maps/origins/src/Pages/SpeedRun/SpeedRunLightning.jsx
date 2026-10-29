import React from 'react';
import { Link } from 'react-router-dom';
import LightningSwitchBoard from '../../components/LightningSwitchBoard';
import SwitchDial, { DIRECTION_ANGLE } from '../../components/SwitchDial';
import originsSpeedRun from '../../../../../shared/data/originsSpeedRun';
import {
  originsLightningSwitchRoute,
  originsLightningSwitchVerification,
} from '../../../../../shared/data/originsLightning';

const hildaless = originsSpeedRun.hildalessLightning;

export default function SpeedRunLightning() {
  return (
    <div className="speedrun-lightning">
      <p className="speedrun-glance" aria-label="All seven switches at a glance">
        {originsLightningSwitchRoute.map((item) => (
          <span key={item.id}>
            {item.shortLabel} <strong>×{item.turnsFromUntouched} {item.arrow}</strong>
          </span>
        ))}
      </p>

      <div className="speedrun-lightning__grid">
        <LightningSwitchBoard
          extraSlot={(
            <Link to="/maps/origins/lightning-staff">
              <strong>Lightning Staff guide →</strong>
              <small>Parts, piano code, Excavation rings</small>
            </Link>
          )}
        />

        <section className="speedrun-card">
          <h3>Route order</h3>
          <ol className="speedrun-switch-order">
            {originsLightningSwitchRoute.map((item) => (
              <li key={item.id}>
                <SwitchDial angle={DIRECTION_ANGLE[item.direction]} size={30} />
                <div>
                  <strong>{item.shortLabel} {item.arrow}</strong>
                  <span>{item.speedrunNote}</span>
                </div>
              </li>
            ))}
          </ol>
          <p className="speedrun-fineprint">{originsLightningSwitchVerification.clickRule}</p>
        </section>
      </div>

      <section className="speedrun-card speedrun-card--alt">
        <span className="speedrun-kicker">Advanced alternate</span>
        <h3>{hildaless.title}</h3>
        <p className="speedrun-panel__summary">{hildaless.summary}</p>
        <ol className="speedrun-panel__steps">
          {hildaless.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
        <div className="speedrun-alt-foot">
          <a href={hildaless.videoUrl} target="_blank" rel="noreferrer">Watch the hildaless demo ↗</a>
          <p>{hildaless.warning}</p>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import FlatGuide from '../../../../shared/guide/FlatGuide';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import zetsGuideSteps from '../data/zetsGuideSteps';
// Guide.css also carries styles the cog and boss pages share (this route chunk always loads it).
import '../styles/Guide.css';
import '../styles/MainGuideFlat.css';

// Zetsubou main guide: the Easter Egg steps in order, one line each. Detail lives on the tabs.
const MainGuide = () => (
  <div className="zets-main-guide zets-main-flat">
    <FlatGuide label="Seeds of Doubt" steps={zetsGuideSteps} footer={<CompleteEasterEgg mapId="zetsubou-no-shima" />} />
  </div>
);

export default MainGuide;

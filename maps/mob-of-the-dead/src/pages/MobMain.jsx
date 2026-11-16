import React from 'react';
import FlatGuide from '../../../../shared/guide/FlatGuide';
import CompleteEasterEgg from '../../../../shared/achievements/CompleteEasterEgg';
import mobGuideSteps from '../data/mobGuideSteps';
import '../styles/MobMainFlat.css';

// Mob of the Dead main guide: the Easter Egg steps in order, one line each. Detail lives on the tabs.
const MobMain = () => (
  <div className="mobmain-page mob-main-flat">
    <FlatGuide label="Pop Goes the Weasel" steps={mobGuideSteps} footer={<CompleteEasterEgg mapId="mob-of-the-dead" />} />
  </div>
);

export default MobMain;

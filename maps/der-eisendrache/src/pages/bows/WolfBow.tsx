import React from 'react';
import BowGuide from '../../components/BowGuide';
import { bowGuides } from '../../data/bowGuides';

const WolfBow: React.FC = () => <BowGuide guide={bowGuides.wolf} />;

export default WolfBow;

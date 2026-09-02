import React from 'react';
import BowGuide from '../../components/BowGuide';
import { bowGuides } from '../../data/bowGuides';

const ElectricBow: React.FC = () => <BowGuide guide={bowGuides.storm} />;

export default ElectricBow;

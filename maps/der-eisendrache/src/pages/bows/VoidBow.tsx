import React from 'react';
import BowGuide from '../../components/BowGuide';
import { bowGuides } from '../../data/bowGuides';

const VoidBow: React.FC = () => <BowGuide guide={bowGuides.void} />;

export default VoidBow;

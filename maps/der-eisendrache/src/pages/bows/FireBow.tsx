import React from 'react';
import BowGuide from '../../components/BowGuide';
import { bowGuides } from '../../data/bowGuides';

const FireBow: React.FC = () => <BowGuide guide={bowGuides.fire} />;

export default FireBow;

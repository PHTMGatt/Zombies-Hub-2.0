import React from 'react';
import BowGuide from '../../components/BowGuide';
import { bowGuides } from '../../data/bowGuides';

const BaseBow: React.FC = () => <BowGuide guide={bowGuides.base} />;

export default BaseBow;

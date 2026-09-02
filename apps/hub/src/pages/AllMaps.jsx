import React from 'react';
import { Link } from 'react-router-dom';

const dedicated = [
  ['Origins', '/maps/origins'],
  ['Mob of the Dead', '/maps/mob-of-the-dead'],
  ['Der Eisendrache', '/maps/der-eisendrache'],
  ['Zetsubou No Shima', '/maps/zetsubou-no-shima'],
  ['Gorod Krovi', '/maps/gorod-krovi'],
  ['Revelations', '/maps/revelations'],
];

export default function AllMaps() {
  return (
    <section className="hub-page">
      <h1>All Maps</h1>
      <p>The complete original map catalog is being imported from Zombies Hub. Dedicated guides are already routed internally:</p>
      <ul>
        {dedicated.map(([name, to]) => <li key={to}><Link to={to}>{name}</Link></li>)}
      </ul>
    </section>
  );
}

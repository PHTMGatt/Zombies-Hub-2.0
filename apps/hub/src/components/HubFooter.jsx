import React from 'react';
import { IoLogoGithub } from 'react-icons/io5';
import '../styles/hub-footer.css';

export default function HubFooter() {
  return (
    <footer className="hub-footer">
      <div className="hub-footer__brand">
        <strong>Zombies Hub 2.0</strong>
        <span>Unified Zombies guides, quests, and map resources.</span>
      </div>

      <div className="hub-footer__meta">
        <span>Fan-made companion</span>
        <a
          href="https://github.com/PHTMGatt/Zombies-Hub-2.0"
          target="_blank"
          rel="noreferrer"
        >
          <IoLogoGithub aria-hidden="true" />
          Source
        </a>
      </div>
    </footer>
  );
}

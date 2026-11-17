/*
 * Seeds of Doubt, main guide: a FLAT list (Bryen, 2026-11-16). Each step is { id, title, goal, links }: number, title, one
 * short line, small links. Warnings, how-to lines, task lines and reference lists moved to the Step details tab
 * (stepDetails.js, section #step-N). Facts come only from zetsRun.js and zetsGear.js (test-guarded).
 */
const BASE = '/maps/zetsubou-no-shima';
const DETAILS = `${BASE}/step-details`;

const zetsGuideSteps = [
  {
    id: 'trials',
    title: 'Three Trials each',
    goal: 'Every player completes all three of their own Trials from the challenge tablets near spawn.',
    links: [{ to: DETAILS, section: 'step-1', label: 'Step details' }],
  },
  {
    id: 'skulls',
    title: 'Clean the four skulls',
    goal: 'Match each skull to its symbol pedestal, defend it until clean, return it. Repeat four times.',
    links: [{ to: DETAILS, section: 'step-2', label: 'Step details' }],
  },
  {
    id: 'bunker',
    title: 'Bunker + Pack-a-Punch',
    goal: 'Power both labs with green and blue water, open the bunker, survive the lockdown, take the three parts.',
    links: [{ to: `${BASE}/buildables`, label: 'Buildables' }, { to: DETAILS, section: 'step-3', label: 'Step details' }],
  },
  {
    id: 'kt4',
    title: 'Build the KT-4',
    goal: 'Collect the three parts, then build the KT-4 at its workbench.',
    links: [{ to: `${BASE}/buildables`, label: 'Buildables' }, { to: DETAILS, section: 'step-4', label: 'Step details' }],
  },
  {
    id: 'reveal',
    title: 'Reveal the elevator',
    goal: 'Mesmerize the hidden blueprint and the concealed elevator panel with the Skull of Nan Sapwe.',
    links: [{ to: `${BASE}/reveal-blueprint`, label: 'Reveal Blueprint' }, { to: DETAILS, section: 'step-5', label: 'Step details' }],
  },
  {
    id: 'masamune',
    title: 'Upgrade to the Masamune',
    goal: 'Gather the upgrade ingredients, then build the Masamune at the KT-4 workbench.',
    links: [{ to: `${BASE}/buildables`, label: 'Buildables' }, { to: DETAILS, section: 'step-6', label: 'Step details' }],
  },
  {
    id: 'cog-1',
    title: 'Cog 1 — Anywhere But Here!',
    goal: 'With the elevator quest active, use Anywhere But Here! to reach the hidden room and take the cog.',
    links: [{ to: `${BASE}/cogs/1`, label: 'Cog 1 details' }, { to: DETAILS, section: 'step-7', label: 'Step details' }],
  },
  {
    id: 'cog-2',
    title: 'Cog 2 — AA Cannon',
    goal: 'Grow an artillery shell, fire the AA cannon at the cargo plane, find the cog where it lands.',
    links: [{ to: `${BASE}/cogs/2`, label: 'Cog 2 details' }, { to: DETAILS, section: 'step-8', label: 'Step details' }],
  },
  {
    id: 'cog-3',
    title: 'Cog 3 — Zipline',
    goal: 'Charge the shield with the challenge lightning, electrify the zipline panel, drop onto the hidden dock.',
    links: [{ to: `${BASE}/cogs/3`, label: 'Cog 3 details' }, { to: DETAILS, section: 'step-9', label: 'Step details' }],
  },
  {
    id: 'elevator',
    title: 'Open the elevator',
    goal: 'Install all three cogs, put on a fresh gas mask, then descend to the boss arena.',
    links: [{ to: DETAILS, section: 'step-10', label: 'Step details' }],
  },
  {
    id: 'thrasher',
    title: 'Defeat the Giant Thrasher',
    goal: 'Masamune the vine spores, keep moving, and damage the boss whenever its weak point opens.',
    links: [{ to: `${BASE}/elevator-battle`, label: 'Boss Fight' }, { to: DETAILS, section: 'step-11', label: 'Step details' }],
  },
];

export default zetsGuideSteps;

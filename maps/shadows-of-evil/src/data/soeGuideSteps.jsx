/*
 * Shadows of Evil, main guide: a FLAT list (Bryen, 2026-11-16). Each step is { id, title, goal, links }: number, title, one
 * short line, small links. Warnings, how-to lines, task lines and reference lists moved to the Step details tab
 * (stepDetails.js, section #step-N). Facts come only from soeGuide.js (test-guarded). Per-game state (train symbols, Keeper picker) lives on the Step details tab.
 */
const BASE = '/maps/shadows-of-evil';
const DETAILS = `${BASE}/step-details`;

const soeGuideSteps = [
  {
    id: 'rituals',
    title: 'Four district rituals',
    goal: 'In Beast Mode, open each ritual room and item, finish the ritual, take its Gateworm. Note the train symbols.',
    links: [{ to: DETAILS, section: 'step-1', label: 'Step details' }],
  },
  {
    id: 'sword',
    title: 'Apothicon Sword',
    goal: 'In the Footlight rift, shock your three train symbols in order in Beast Mode, then charge the egg at all four statues.',
    links: [{ to: DETAILS, section: 'step-2', label: 'Step details' }],
  },
  {
    id: 'pap',
    title: 'Open Pack-a-Punch',
    goal: 'Place all four Gateworms and the Summoning Key in the underground ritual room, then survive until it ends.',
    links: [{ to: DETAILS, section: 'step-3', label: 'Step details' }],
  },
  {
    id: 'upgrade',
    title: 'Upgrade the sword',
    goal: 'Get your Arch-Ovum from your Keeper, then finish one Margwa challenge per round at all four spots.',
    links: [{ to: DETAILS, section: 'step-4', label: 'Step details' }],
  },
  {
    id: 'flag',
    title: 'The flag',
    goal: 'Raise the book in Nero’s room, take the flag underground, defend it at each district, deliver it to that ritual table.',
    links: [{ to: DETAILS, section: 'step-5', label: 'Step details' }],
  },
  {
    id: 'shadowman',
    title: 'Defeat the Shadowman',
    goal: 'Activate the Keeper(s), shoot the Shadowman over the ritual table, then trap him in the Summoning Key.',
    links: [{ to: DETAILS, section: 'step-6', label: 'Step details' }],
  },
  {
    id: 'finale',
    title: 'Four-player train finale',
    goal: 'Everyone takes a post. The train caller starts the train; the centre player shocks the three Keepers at the Gateworm.',
    links: [{ to: DETAILS, section: 'step-7', label: 'Step details' }],
  },
];

export default soeGuideSteps;

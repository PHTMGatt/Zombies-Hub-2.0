import React from 'react';
import SafeCodeNote from '../components/SafeCodeNote';
import { deGuide } from './deGuide';
import { bowGuides } from './bowGuides';

/*
 * My Brother's Keeper as guide steps. Facts come from the existing Der Eisendrache data (deGuide.ts
 * phases, bowGuides.ts, the wisp / gear / boss pages, and the Fire Bow video notes); this file only
 * reorganises them into what / quick reference / how / problems.
 */
const BASE = '/maps/der-eisendrache';

const TONE = {
  base: '#d8edff',
  storm: '#59bfff',
  fire: '#ff9853',
  wolf: '#a7d7ff',
  void: '#b58cff',
};

const seconds = (time) => time.split(':').reduce((total, part) => total * 60 + Number(part), 0);
const video = (time, label = 'Watch this section') => ({
  url: `https://www.youtube.com/watch?v=${deGuide.videoId}&t=${seconds(time)}s`,
  label,
});

const phase = (id) => deGuide.phases.find((item) => item.id === id);
const howFrom = (id, titles) =>
  phase(id).steps.filter((step) => !titles || titles.includes(step.title)).map((step) => `${step.title}: ${step.detail}`);

const stepTitles = (bow) => bowGuides[bow].steps.map((step) => step.title);

const wispObjects = [
  'Spawn / Quick Revive — phone on the table',
  'Spawn → Double Tap — broken car front wheel',
  'Above Double Tap — cabinet / box',
  'Samantha / Richtofen rooms — globe',
  'Power Room — phone',
  'Mission Control — clock near the dragon',
  'Lower Mission Control — radio / machinery',
  'Courtyard → Clock Tower route — clock upstairs',
];

const deGuideSteps = [
  {
    id: 'base-bow',
    title: 'Wrath of the Ancients',
    goal: 'Feed all three dragons, then take the base bow from the Family Crypt.',
    refs: [
      { type: 'chips', label: 'Dragons · 8 single kills each', items: ['Courtyard — above the Double Tap tunnel', 'Mission Control — fireplace by Speed Cola', 'Undercroft — Pyramid'] },
      { type: 'facts', items: [{ k: 'Bow', v: 'Family Crypt / Knight’s Tomb, above the Undercroft' }] },
    ],
    tasks: [
      { id: 'courtyard', label: 'Courtyard dragon' },
      { id: 'mission', label: 'Mission Control dragon' },
      { id: 'undercroft', label: 'Undercroft dragon' },
      { id: 'bow', label: 'Bow collected', tone: TONE.base },
    ],
    how: bowGuides.base.steps.map((step) => `${step.title}: ${step.detail}`),
    problems: [...bowGuides.base.tips, bowGuides.base.warning],
    video: video('00:30'),
    links: [{ to: `${BASE}/bows/base`, label: 'Base bow guide', tone: TONE.base }],
  },
  {
    id: 'upgrade-bow',
    title: 'Upgrade your bow',
    goal: 'Ranked / online: one upgraded bow per player. Local / offline or unranked: all four bows.',
    refs: [
      {
        type: 'tabs',
        label: 'Bow',
        tabs: [
          {
            id: 'storm', label: 'Storm', tone: TONE.storm,
            refs: [
              { type: 'facts', items: [{ k: 'Start', v: bowGuides.storm.start }, { k: 'Difficulty', v: bowGuides.storm.difficulty }] },
              { type: 'chips', label: 'Bonfires (charged shots)', items: ['Overlooking village / spawn', 'Outside the Clock Tower', 'Mountain near Rocket Test'] },
              { type: 'chips', label: 'Urns (souls)', items: ['Under the Clock Tower stairs', 'Above Double Tap by the workbench', 'Rocket tunnel'] },
              { type: 'list', items: stepTitles('storm') },
            ],
          },
          {
            id: 'fire', label: 'Fire', tone: TONE.fire,
            refs: [
              { type: 'facts', items: [{ k: 'Start', v: bowGuides.fire.start }, { k: 'Difficulty', v: bowGuides.fire.difficulty }] },
              { type: 'facts', label: 'Circle → Wundersphere to use', items: [
                { k: 'Death Ray circle', v: 'Courtyard sphere', tone: TONE.fire },
                { k: 'Clock Tower circle', v: 'Double Tap sphere', tone: TONE.fire },
                { k: 'Double Tap circle', v: 'Rocket Test sphere', tone: TONE.fire },
              ] },
              { type: 'facts', label: 'Lit circle → fireplace', items: [
                { k: 'Death Ray circle', v: 'Church fireplace', tone: TONE.fire },
                { k: 'Clock Tower circle', v: 'Near Wonderfizz, outside Samantha’s room', tone: TONE.fire },
                { k: 'Double Tap circle', v: 'Inside Samantha’s room', tone: TONE.fire },
              ] },
              { type: 'warning', text: 'Four shots total to land the rock in the fireplace.' },
              { type: 'list', items: stepTitles('fire') },
            ],
          },
          {
            id: 'wolf', label: 'Wolf', tone: TONE.wolf,
            refs: [
              { type: 'facts', items: [{ k: 'Start', v: bowGuides.wolf.start }, { k: 'Difficulty', v: bowGuides.wolf.difficulty }] },
              { type: 'sequence', label: 'Painting order (positions vary, order doesn’t)', items: ['King on throne with wolves', 'King on horseback with flag', 'Castle struck by lightning', 'Slain king, servant mourning'] },
              { type: 'list', items: stepTitles('wolf').slice(1) },
            ],
          },
          {
            id: 'void', label: 'Void', tone: TONE.void,
            refs: [
              { type: 'facts', items: [{ k: 'Start', v: bowGuides.void.start }, { k: 'Difficulty', v: bowGuides.void.difficulty }] },
              { type: 'chips', label: '6 skulls', items: ['Mule Kick side', 'Double Tap side', 'Samantha’s room', 'Upper Trophy / field window', 'Teleporter-room sink', 'Truck bed at Rocket Test'] },
              { type: 'facts', items: [{ k: 'Success cue', v: '“That is my name.”' }] },
              { type: 'list', items: stepTitles('void') },
            ],
          },
        ],
      },
    ],
    tasks: [
      { id: 'storm', label: 'Storm', tone: TONE.storm },
      { id: 'fire', label: 'Fire', tone: TONE.fire },
      { id: 'wolf', label: 'Wolf', tone: TONE.wolf },
      { id: 'void', label: 'Void', tone: TONE.void },
    ],
    how: [
      'Pick the upgrade your lobby needs (each tab shows its start point, the key references, and the step order).',
      'Every path ends the same way: place the reforged arrow in that bow’s altar around the Pyramid, feed it zombie souls, insert the Wrath of the Ancients, and collect the upgraded bow.',
      'Finish the required upgrade before starting the wisp cycle — the wisps are shot with an upgraded bow.',
    ],
    problems: [
      'Only tick the bows you need; mark the step done when your lobby’s requirement is met.',
      ...bowGuides.fire.tips.slice(1),
      ...bowGuides.void.tips,
      ...bowGuides.wolf.tips,
    ],
    video: video('00:48', 'Watch the Storm Bow route'),
    links: [
      { to: `${BASE}/bows/electric`, label: 'Storm', tone: TONE.storm },
      { to: `${BASE}/bows/fire`, label: 'Fire', tone: TONE.fire },
      { to: `${BASE}/bows/wolf`, label: 'Wolf', tone: TONE.wolf },
      { to: `${BASE}/bows/void`, label: 'Void', tone: TONE.void },
    ],
  },
  {
    id: 'gear',
    title: 'Gear up: Shield + Ragnaroks',
    goal: 'Build as you go — every player needs a Ragnarok DG-4 before the boss.',
    critical: ['Activate the Death Ray at least once before the quest reaches the fuse and safe sequence.'],
    refs: [
      { type: 'facts', label: 'Ragnarok DG-4 parts', items: [
        { k: 'Panzer', v: 'First Panzersoldat drop' },
        { k: 'Death Ray', v: 'Death Ray on → Wundersphere to the part above the Bastion' },
        { k: 'Rocket Test', v: 'Arm the stair switch, survive the bunker, green teleporter console' },
      ] },
      { type: 'chips', label: 'Shield · one part per zone', items: ['Lower Courtyard / Gate Trap', 'Clock Tower / Mission Control', 'Undercroft — anti-gravity'] },
      { type: 'facts', items: [{ k: 'Workbench', v: 'Church · Gatehouse above Double Tap · Undercroft' }] },
    ],
    tasks: [
      { id: 'shield', label: 'Rocket Shield' },
      { id: 'panzer', label: 'Panzer part' },
      { id: 'deathray', label: 'Death Ray part' },
      { id: 'rocket', label: 'Rocket Test part' },
      { id: 'ragnarok', label: 'Ragnaroks built' },
    ],
    how: [
      'Ragnarok parts: kill the first Panzersoldat; activate the Death Ray and use the correct Wundersphere route to catch the part floating above the Bastion; during a Rocket Test, arm the stair switch, survive in the bunker, then use the green teleporter console.',
      'Build the Ragnaroks at a workbench. Every player needs one before the boss-entry tiles.',
      'Shield parts sit in three zones (Lower Courtyard / Gate Trap, Clock Tower / Mission Control, Undercroft anti-gravity). Build it early.',
      'Stand on all four Pyramid floor plates so anti-gravity cycles become available, and move the three Pack-a-Punch teleporter pieces into position early.',
    ],
    video: video('04:22', 'Watch the Ragnarok parts'),
    links: [{ to: `${BASE}/parts`, label: 'Full gear page' }],
  },
  {
    id: 'first-wisps',
    title: 'First wisp cycle',
    goal: 'Prime the teleporter, hit four wisps, travel to the past together.',
    critical: [phase('first-wisps').warning],
    refs: [
      { type: 'sequence', items: ['Base bow → 6 prongs', 'Upgraded bow → 4 wisps', 'Purple teleporter · everyone'] },
      { type: 'list', label: '8 possible wisp objects', items: wispObjects },
    ],
    tasks: [
      { id: 'prongs', label: '6 prongs primed' },
      { id: 'wisps', label: '4 wisps hit' },
      { id: 'travel', label: 'Teleported' },
    ],
    how: howFrom('first-wisps', ['Prime all six teleporter prongs', 'Shoot four wisps', 'Travel together']),
    problems: [
      'Only one wisp is active at a time, and it moves after every hit.',
      'If the cycle fails, wait for the next round and prime the teleporter again.',
    ],
    video: { url: 'https://www.youtube.com/watch?v=NhDv6R5YPEs&t=109s', label: 'Watch the wisp locations (1:49)' },
    links: [{ to: `${BASE}/wisps`, label: 'Wisp reference' }],
  },
  {
    id: 'past-lab-1',
    title: 'Past lab: canister, fuses, safe code',
    goal: 'Grab the blue Soul Canister and the small fuses, and record the three safe symbols.',
    critical: ['The safe code changes every game — record it before you are sent back.'],
    refs: [
      { type: 'chips', label: 'Take', items: ['Blue Soul Canister', 'Small fuses'] },
      { type: 'custom', key: 'safe-code', render: () => <SafeCodeNote /> },
    ],
    tasks: [
      { id: 'canister', label: 'Soul Canister' },
      { id: 'fuses', label: 'Small fuses' },
      { id: 'code', label: 'Safe code noted' },
    ],
    how: howFrom('first-wisps', ['Take the Soul Canister and fuses', 'Memorize the safe code']),
    video: video('02:01'),
  },
  {
    id: 'death-ray-safe',
    title: 'Death Ray + safe',
    goal: 'Fuses into the Death Ray, enter the safe code, loot the safe, power the pylons.',
    refs: [
      { type: 'sequence', items: ['Kill the Panzer', 'Fuses → Death Ray panel', 'Lever: Protect', 'Code at Clock Tower terminal', 'Loot safe', 'Coils → pylons', 'Lever: Destroy', 'Key card at terminal'] },
      { type: 'custom', key: 'safe-code-entry', render: () => <SafeCodeNote /> },
    ],
    tasks: [
      { id: 'panzer', label: 'Panzer killed' },
      { id: 'safe', label: 'Safe opened' },
      { id: 'coils', label: 'Coils + key card in' },
    ],
    how: howFrom('safe', ['Kill the returning Panzer', 'Install the fuses and set Protect', 'Enter the safe code', 'Loot the safe', 'Install the large coils']),
    video: video('02:45'),
  },
  {
    id: 'simon-vril',
    title: 'Simon Says + Vril Generator',
    goal: 'Solve both memory terminals, crash Dempsey’s pod, take the Vril Generator.',
    critical: ['TAKE THE VRIL GENERATOR from the crashed pod — the game does not make the pickup obvious.'],
    refs: [
      { type: 'sequence', items: ['Clock Tower terminal', 'Rocket Platform terminal', 'Green Death Ray button', 'Pod crashes in courtyard', 'Take Vril Generator'] },
    ],
    tasks: [
      { id: 'clock', label: 'Clock Tower terminal' },
      { id: 'rocket', label: 'Rocket Platform terminal' },
      { id: 'vril', label: 'Vril Generator taken' },
    ],
    how: howFrom('safe', ['Complete both Simon Says terminals', 'Bring Dempsey’s pod down', 'TAKE THE VRIL GENERATOR']),
    problems: ['Hellhounds may pressure you while a Simon Says puzzle is active.'],
    video: video('02:45'),
  },
  {
    id: 'second-wisps',
    title: 'Second wisp cycle + Keeper Stone',
    goal: 'Repeat the wisps, go back to the past, take the Keeper Stone.',
    critical: [phase('first-wisps').warning],
    refs: [
      { type: 'sequence', items: ['Base bow → 6 prongs', 'Upgraded bow → 4 wisps', 'Past lab: open the case', 'Take the Keeper Stone'] },
      { type: 'list', label: 'Same 8 wisp objects', items: wispObjects },
    ],
    tasks: [
      { id: 'wisps', label: '4 wisps hit' },
      { id: 'stone', label: 'Keeper Stone' },
    ],
    how: howFrom('second-wisps'),
    video: video('03:37'),
    links: [{ to: `${BASE}/wisps`, label: 'Wisp reference' }],
  },
  {
    id: 'keeper-ritual',
    title: 'Ghost Keeper ritual',
    goal: 'Summon the Keeper, follow it to four circles, charge each with the bow it asks for.',
    refs: [
      { type: 'sequence', items: ['Vril Generator → Family Crypt knight socket', 'Follow the Keeper', 'Stand in the circle', 'Kill with the bow colour shown'] },
      { type: 'facts', items: [
        { k: 'Which bow?', v: 'The colour at the edge of your screen while standing in the circle' },
        { k: 'Double Tap circle', v: 'Insert the Keeper Stone into the wall / lamppost slot' },
      ] },
    ],
    tasks: [
      { id: 'c1', label: 'Circle 1' },
      { id: 'c2', label: 'Circle 2' },
      { id: 'c3', label: 'Circle 3' },
      { id: 'c4', label: 'Circle 4' },
    ],
    how: howFrom('keeper'),
    problems: ['Zombies do not need to be standing inside the circle — only the player does.'],
    video: video('03:59'),
  },
  {
    id: 'mpd-prep',
    title: 'MPD + boss prep',
    goal: 'Soul Canister into the MPD, every player ready, then plant Ragnaroks together.',
    critical: ['No return: planting the Ragnaroks on the pyramid tiles starts the boss fight.'],
    refs: [
      { type: 'chips', label: 'Before you plant', items: ['Soul Canister in the MPD', 'Ragnarok for every player', 'Perks + ammo', 'Shield repaired', 'Upgraded bow ready'] },
    ],
    tasks: [
      { id: 'canister', label: 'Canister in MPD' },
      { id: 'ragnaroks', label: 'Everyone has a Ragnarok' },
      { id: 'ready', label: 'Perks / ammo / shield' },
    ],
    how: howFrom('mpd'),
    video: video('04:15'),
  },
  {
    id: 'keeper-boss',
    title: 'Keeper boss',
    goal: 'Three Keeper damage phases with Panzer waves between. Stun with a Ragnarok, shoot the chest.',
    critical: ['Missed the stun? Get behind a blue pillar before the shockwave.'],
    refs: [
      { type: 'sequence', label: 'Damage loop', items: ['Orb under the Keeper', 'Plant Ragnarok in it', 'Chest opens', 'Dump damage'] },
      { type: 'sequence', label: 'Fight order', items: ['Keeper', 'Panzers', 'Keeper', 'Panzers', 'Keeper'] },
    ],
    tasks: [
      { id: 'k1', label: 'Keeper phase 1' },
      { id: 'k2', label: 'Keeper phase 2' },
      { id: 'k3', label: 'Keeper phase 3' },
    ],
    how: deGuide.bossFight.map((item) => `${item.title}: ${item.detail}`),
    problems: ['Recharge the Ragnaroks during every Panzer wave.', 'Hellhounds join from the second damage phase; keep the arena controlled.'],
    video: video('05:22'),
    links: [{ to: `${BASE}/boss`, label: 'Boss survival sheet' }],
  },
  {
    id: 'ending',
    title: 'Ending',
    goal: 'Take the Summoning Key from the MPD to the Clock Tower terminal.',
    refs: [
      { type: 'sequence', items: ['Summoning Key at the MPD', 'Clock Tower terminal', 'Griffin Station destroyed'] },
    ],
    how: deGuide.ending,
  },
];

export default deGuideSteps;

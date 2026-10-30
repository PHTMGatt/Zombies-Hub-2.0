import { useCallback, useEffect, useMemo, useState } from 'react';
import { PROGRESS_RESET_EVENT } from '../achievements/achievements';
import { progressKey, read, write } from '../storage';

/*
 * Easter Egg progress, stored only in this browser (localStorage), one record per guide:
 *   { current: stepId, done: { [stepId]: true, [`${stepId}/${taskId}`]: true }, total: stepCount }
 * (`total` lets the achievement shelf show "4 / 11" without loading the guide.)
 * Quick and Full mode read the same record, so switching depth never loses your place.
 */
const PROGRESS_KEY = progressKey;
const MODE_KEY = 'zh-guide-mode';

export const taskKey = (stepId, taskId) => `${stepId}/${taskId}`;

// Pass a null guideId for an inert instance (used when a page already owns the progress).
export function useGuideProgress(guideId, steps) {
  const stepIds = useMemo(() => steps.map((step) => step.id), [steps]);
  const [state, setState] = useState(() => {
    const saved = guideId ? read(PROGRESS_KEY(guideId), null) : null;
    const current = saved && stepIds.includes(saved.current) ? saved.current : stepIds[0];
    return { current, done: saved?.done ?? {} };
  });

  useEffect(() => {
    if (guideId) write(PROGRESS_KEY(guideId), { ...state, total: stepIds.length });
  }, [guideId, state, stepIds.length]);

  // A reset from the progress menu or the achievement shelf clears storage; start this guide over too.
  useEffect(() => {
    if (!guideId) return undefined;
    const onReset = (event) => {
      const { all, guideId: target } = event.detail ?? {};
      if (all || target === guideId) setState({ current: stepIds[0], done: {} });
    };
    window.addEventListener(PROGRESS_RESET_EVENT, onReset);
    return () => window.removeEventListener(PROGRESS_RESET_EVENT, onReset);
  }, [guideId, stepIds]);

  const isDone = useCallback((stepId) => Boolean(state.done[stepId]), [state.done]);
  const isTaskDone = useCallback((stepId, taskId) => Boolean(state.done[taskKey(stepId, taskId)]), [state.done]);

  const goTo = useCallback((stepId) => {
    if (stepIds.includes(stepId)) setState((previous) => ({ ...previous, current: stepId }));
  }, [stepIds]);

  // Marking a step done moves you to the next unfinished step; unmarking keeps you where you are.
  const toggleStep = useCallback((stepId) => {
    setState((previous) => {
      const done = { ...previous.done };
      if (done[stepId]) {
        delete done[stepId];
        return { ...previous, done };
      }
      done[stepId] = true;
      const after = stepIds.slice(stepIds.indexOf(stepId) + 1).find((id) => !done[id]);
      return { done, current: after ?? stepId };
    });
  }, [stepIds]);

  // Ticking a step's last task completes the step and moves on, exactly like "Mark step done";
  // unticking one reopens it.
  const toggleTask = useCallback((stepId, taskId) => {
    setState((previous) => {
      const step = steps.find((item) => item.id === stepId);
      const done = { ...previous.done };
      const key = taskKey(stepId, taskId);
      if (done[key]) {
        delete done[key];
        delete done[stepId];
        return { ...previous, done };
      }
      done[key] = true;
      const allTasks = step?.tasks?.every((task) => done[taskKey(stepId, task.id)]);
      if (!allTasks || done[stepId]) return { ...previous, done };
      done[stepId] = true;
      const after = stepIds.slice(stepIds.indexOf(stepId) + 1).find((id) => !done[id]);
      return { done, current: after ?? stepId };
    });
  }, [steps, stepIds]);

  const reset = useCallback(() => setState({ current: stepIds[0], done: {} }), [stepIds]);

  const completed = stepIds.filter((id) => state.done[id]).length;

  return { current: state.current, isDone, isTaskDone, goTo, toggleStep, toggleTask, reset, completed, total: stepIds.length };
}

// Reading depth is a preference, remembered per storage key (shared by all maps unless a map uses its own).
export function useGuideDepth(depthIds, storageKey = MODE_KEY) {
  const [depth, setDepth] = useState(() => {
    const saved = read(storageKey, depthIds[0]);
    return depthIds.includes(saved) ? saved : depthIds[0];
  });
  useEffect(() => {
    write(storageKey, depth);
  }, [depth, storageKey]);
  return [depth, setDepth];
}

export const readStored = read;
export const writeStored = write;

import { useCallback, useEffect, useMemo, useState } from 'react';

/*
 * Easter Egg progress, stored only in this browser (localStorage), one record per guide:
 *   { current: stepId, done: { [stepId]: true, [`${stepId}/${taskId}`]: true } }
 * Quick and Full mode read the same record, so switching depth never loses your place.
 * Every storage access is guarded: private windows or blocked storage just mean no persistence.
 */
const PROGRESS_KEY = (guideId) => `zh-guide-progress:${guideId}`;
const MODE_KEY = 'zh-guide-mode';

const read = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: progress still works for this visit.
  }
};

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
    if (guideId) write(PROGRESS_KEY(guideId), state);
  }, [guideId, state]);

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

  // Ticking a step's last task completes the step; unticking one reopens it.
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
      if (allTasks && !done[stepId]) done[stepId] = true;
      return { ...previous, done };
    });
  }, [steps]);

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

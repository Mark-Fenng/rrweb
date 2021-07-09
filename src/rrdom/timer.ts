// @ts-nocheck
import {
  actionWithDelay,
  eventWithTime,
  EventType,
  IncrementalSource,
} from '../types';
if (!performance) const { performance } = require('perf_hooks');
const fps = 60;
const funcs = [];

const skip = Symbol('skip');
const start = Date.now();
let time = start;
let setTimeoutId = -1;

const animFrame = () => {
  const fns = funcs.slice();
  funcs.length = 0;

  const t = Date.now();
  const dt = t - start;
  const t1 = 1e3 / fps;

  for (const f of fns) if (f !== skip) f(dt);

  while (time <= t + t1 / 4) time += t1;
  setTimeoutId = setTimeout(animFrame, time - t);
};

const requestAnimationFrame = (func) => {
  if (setTimeoutId === -1) animFrame();
  funcs.push(func);
  return funcs.length - 1;
};

const cancelAnimationFrame = (id) => {
  funcs[id] = skip;
  if (setTimeoutId !== -1) {
    clearTimeout(setTimeoutId);
    setTimeoutId = -1;
  }
};

export class Timer {
  public timeOffset: number = 0;
  public speed: number;

  private actions: actionWithDelay[];
  private raf: number | null = null;
  private liveMode: boolean;

  constructor(actions: actionWithDelay[] = [], speed: number) {
    this.actions = actions;
    this.speed = speed;
  }
  /**
   * Add an action after the timer starts.
   * @param action
   */
  public addAction(action: actionWithDelay) {
    const index = this.findActionIndex(action);
    this.actions.splice(index, 0, action);
  }
  /**
   * Add all actions before the timer starts
   * @param actions
   */
  public addActions(actions: actionWithDelay[]) {
    this.actions = this.actions.concat(actions);
  }

  public start() {
    this.timeOffset = 0;
    let lastTimestamp = performance.now();
    const { actions } = this;
    const self = this;
    function check() {
      const time = performance.now();
      self.timeOffset += (time - lastTimestamp) * self.speed;
      lastTimestamp = time;
      while (actions.length) {
        const action = actions[0];
        if (self.timeOffset >= action.delay) {
          actions.shift();
          action.doAction();
        } else {
          break;
        }
      }
      if (actions.length > 0 || self.liveMode) {
        self.raf = requestAnimationFrame(check);
      }
    }
    this.raf = requestAnimationFrame(check);
  }

  public clear() {
    if (this.raf !== null) {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
    this.actions.length = 0;
  }

  public setSpeed(speed: number) {
    this.speed = speed;
  }

  public toggleLiveMode(mode: boolean) {
    this.liveMode = mode;
  }

  public isActive() {
    return this.raf !== null;
  }

  private findActionIndex(action: actionWithDelay): number {
    let start = 0;
    let end = this.actions.length - 1;
    while (start <= end) {
      let mid = Math.floor((start + end) / 2);
      if (this.actions[mid].delay < action.delay) {
        start = mid + 1;
      } else if (this.actions[mid].delay > action.delay) {
        end = mid - 1;
      } else {
        return mid;
      }
    }
    return start;
  }
}

// TODO: add speed to mouse move timestamp calculation
export function addDelay(event: eventWithTime, baselineTime: number): number {
  // Mouse move events was recorded in a throttle function,
  // so we need to find the real timestamp by traverse the time offsets.
  if (
    event.type === EventType.IncrementalSnapshot &&
    event.data.source === IncrementalSource.MouseMove
  ) {
    const firstOffset = event.data.positions[0].timeOffset;
    // timeOffset is a negative offset to event.timestamp
    const firstTimestamp = event.timestamp + firstOffset;
    event.delay = firstTimestamp - baselineTime;
    return firstTimestamp - baselineTime;
  }
  event.delay = event.timestamp - baselineTime;
  return event.delay;
}

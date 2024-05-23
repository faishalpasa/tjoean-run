import { BOSS_MAX_LEVEL } from '../constants/boss.js';

export const getCurrentBossLevel = (level) => {
  return ((level - 1) % BOSS_MAX_LEVEL) + 1
  // return level > BOSS_MAX_LEVEL ? BOSS_MAX_LEVEL : level;
}
import { BOSS_MAX_LEVEL } from '../constants/boss.js';

export const getCurrentBossLevel = (level) => {
  return level > BOSS_MAX_LEVEL ? BOSS_MAX_LEVEL : level;
}
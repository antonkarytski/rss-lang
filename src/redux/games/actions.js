import {RESET_GAME_STATISTICS} from "./action-types";

export const setGameStatistics = (type, gameStatistics) => ({
  type,
  gameStatistics,
});

export const getGameStatistics = (type, gameStatistics) => ({
  type,
  gameStatistics,
});

export const resetGameStatistics = () => ({
  type: RESET_GAME_STATISTICS,
});
import {SET_LEVEL, SET_GAME_STATUS} from "./action-types";

export const setStatusGame = (statusGame) => ({
  type: SET_GAME_STATUS,
  statusGame,
});

export const setLevel = (level) => ({
  type: SET_LEVEL,
  level,
});

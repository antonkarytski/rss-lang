import { createSelector } from 'reselect';

export const gameSelector = (state) => {
    return state.gameWords;
};

export const statusGameSelector = createSelector(
  gameSelector,
  ({ statusGame }) => {
      return statusGame;
  },
);

export const levelSelector = createSelector(
  gameSelector,
  ({ level }) => {
      return level;
  },
);
export const statisticsSelector = createSelector(
  gameSelector,
  ({ gameStatistics }) => {
      return {...gameStatistics};
  },
);

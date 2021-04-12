import { createSelector } from 'reselect';

export const gameSelector = (state) => {
    return state.gameWords;
};

export const statisticsSelector = createSelector(
  gameSelector,
  ({ gameStatistics }) => {
      return gameStatistics;
  },
);

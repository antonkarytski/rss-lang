import { createSelector } from 'reselect';

export const savannahSelector = (state) => {
    return state.savannahWords;
};

export const statusGameSelector = createSelector(
  savannahSelector,
  ({ statusGame }) => {
      return statusGame;
  },
);

export const levelSelector = createSelector(
  savannahSelector,
  ({ level }) => {
      return level;
  },
);

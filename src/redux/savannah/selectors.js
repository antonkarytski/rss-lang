import { createSelector } from 'reselect';

export const savannahSelector = (state) => state.words;

export const statusGameSelector = createSelector(
  savannahSelector,
  ({ statusGame }) => statusGame,
);

export const levelSelector = createSelector(
  savannahSelector,
  ({ level }) => level,
);

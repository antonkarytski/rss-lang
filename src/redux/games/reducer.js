import {
  SET_LEVEL,
  SET_GAME_STATUS,
  SET_GAME_STATISTICS, GET_GAME_STATISTICS
} from "./action-types";

const initialState = {
  statusGame: '',
  level: 1,
  gameStatistics: {
    learnedWords: 0,
    optional: {
      savannah: [],
    },
  },
  isUpdating: false,
  isFetching: false,
};

const gameReducer = (state = initialState, action) => {
  const {
    type,
    ...payload
  } = action;

  switch (type) {
    case SET_GAME_STATUS:
      return {
        ...state,
        ...payload,
      };
    case SET_LEVEL:
      return {
        ...state,
        ...payload,
      };
    case GET_GAME_STATISTICS.START:
      return {
        ...state,
        isFetching: true
      };

    case GET_GAME_STATISTICS.FINISHED:
      return {
        ...state,
        ...payload,
        isFetching: false
      };

    case SET_GAME_STATISTICS.START:
      return {
        ...state,
        isUpdating: true
      };

    case SET_GAME_STATISTICS.FINISHED:
      return {
        ...state,
        ...payload,
        isUpdating: false
      };
    default:
      return state;
  }
};

export default gameReducer;
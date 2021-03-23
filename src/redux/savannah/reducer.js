import {SET_LEVEL, SET_GAME_STATUS} from "./action-types";

const initialState = {
  statusGame: '',
  level: 0,
};

const savannahReducer = (state = initialState, action) => {
  const {
    type,
    ...payload
  } = action;

  switch (type) {
    case SET_GAME_STATUS:
    case SET_LEVEL:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};

export default savannahReducer;

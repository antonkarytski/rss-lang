import {getGameStatistics, setGameStatistics} from "./actions";
import {GET_GAME_STATISTICS, SET_GAME_STATISTICS} from "./action-types";
import {getUserData} from "../../helpers/gameUtils";

const server = "https://rss-words-3.herokuapp.com";

export const addStatisticsThunk = (id, gameStatistics) => (dispatch) => {
  const token =  getUserData()?.token;
  dispatch(setGameStatistics(SET_GAME_STATISTICS.START));
  fetch(`${server}/users/${id}/statistics`, {
    method: "PUT",
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gameStatistics),
  })
    .then(res => res.json())
    .then(res => {
      // add success
      dispatch(setGameStatistics(SET_GAME_STATISTICS.FINISHED, res));
    })
    .catch(res => {
      //add failing
      dispatch(setGameStatistics(SET_GAME_STATISTICS.FAILED));
    });
};

export const getStatisticsThunk = (id) => (dispatch) => {
  const token =  getUserData()?.token;
  dispatch(getGameStatistics(GET_GAME_STATISTICS.START));
  fetch(`${server}/users/${id}/statistics`, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  })
    .then(res => res.json())
    .then(res => {
      // add success
      dispatch(getGameStatistics(GET_GAME_STATISTICS.FINISHED, res));
    })
    .catch(res => {
      //add failing
      dispatch(getGameStatistics(GET_GAME_STATISTICS.FAILED));
    });
};
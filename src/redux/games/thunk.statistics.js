import {getGameStatistics, setGameStatistics} from "./actions";
import {GET_GAME_STATISTICS, SET_GAME_STATISTICS} from "./action-types";

const server = "https://rss-words-3.herokuapp.com";
const token =  JSON.parse(localStorage.getItem("userData")).token;

export const addStatisticsThunk = (id, gameStatistics) => (dispatch) => {
  dispatch(setGameStatistics(SET_GAME_STATISTICS.START));
  //dispatch(setGameStatistics(SET_GAME_STATISTICS.FINISHED, res));
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
//export const getStatisticsThunk = (id, fetchAllStatistics = false) => (dispatch) => {
export const getStatisticsThunk = (id) => (dispatch) => {
  dispatch(getGameStatistics(GET_GAME_STATISTICS.START));
  //dispatch(getGameStatistics(GET_GAME_STATISTICS.FINISHED, res));
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
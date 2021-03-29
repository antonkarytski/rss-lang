import { userWordsRequest } from "./requests/server"
import {checkToken} from "./actions.auth"
import { ADD_WORD_TO_USER, SET_USER_WORDS, } from "./types"
//import {indexedDBRequest} from "./requests/indexedDB"

export const addStatisticsThunk = (gameStatistics) => (dispatch) => {
	dispatch(setGameStatistics(SET_GAME_STATISTICS.START));
	dispatch(setGameStatistics(SET_GAME_STATISTICS.FINISHED, res));
	// fetch(`${config.api}/api/scores/add`, {
	// 		method: "POST",
	// 		headers: {
	// 				'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(gameStatistics),
	// })
	// 		.then(res => res.json())
	// 		.then(res => {
	// 				// add success
	// 				dispatch(setGameStatistics(SET_GAME_STATISTICS.FINISHED, res));
	// 		})
	// 		.catch(res => {
	// 				//add failing
	// 				dispatch(setGameStatistics(SET_GAME_STATISTICS.FAILED));
	// 		});
};

export const getStatisticsThunk = (fetchAllStatistics = false) => (dispatch) => {
	dispatch(getGameStatistics(GET_GAME_STATISTICS.START));
	dispatch(getGameStatistics(GET_GAME_STATISTICS.FINISHED, res));
	// fetch(`${config.api}/api/scores/add?all=${fetchAllStatistics}`, {
	// 		method: "GET",
	// 		headers: {
	// 				'Content-Type': 'application/json'
	// 		}
	// })
	// 		.then(res => res.json())
	// 		.then(res => {
	// 				// add success
	// 				dispatch(getGameStatistics(GET_GAME_STATISTICS.FINISHED, res));
	// 		})
	// 		.catch(res => {
	// 				//add failing
	// 				dispatch(getGameStatistics(GET_GAME_STATISTICS.FAILED));
	// 		});
};
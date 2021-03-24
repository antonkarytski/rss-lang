import { combineReducers } from "redux"
import userReducer from "./userReducer"
import wordsReducer from "./wordsReducer"
import savannahReducer from "./savannah/reducer"

const rootReducer = combineReducers({
	user: userReducer,
	words: wordsReducer,
	savannahWords: savannahReducer,
})

export default rootReducer

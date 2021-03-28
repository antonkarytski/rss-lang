import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getWords } from "../redux/actions.words"

const initialRequest = {
	group: null,
	page: null,
}

//Usage
//const {currentWords, getWordsChunk, onLoading} = useWords()

export function useWords(){
	const dispatch = useDispatch()
	const words = useSelector(state => state.words)
	const [currentWords, setCurrentWords] = useState(null)
	const [currentRequest, setCurrentRequest] = useState(initialRequest)
	const [onLoading, setOnLoading] = useState(false)

	const getWordsChunk = useCallback((group, page) => {
		if (words[group] && words[group][page]) {
			setCurrentWords(words[group][page])
			setOnLoading(false)
			return words[group][page]

		} else {
			setCurrentRequest({group, page})
			return "loading"
			setOnLoading(true)
			return dispatch(getWords(group, page))
		}
	}, [dispatch, words])


	useEffect(() => {
		if (words[currentRequest.group]
			&& words[currentRequest.group][currentRequest.page]
			&& currentRequest.page !== null
			&& currentRequest.group !== null) {
			setCurrentWords(words[currentRequest.group][currentRequest.page])
			setCurrentRequest(initialRequest)
		}
	}, [words, currentRequest.group, currentRequest.page])

	return {currentWords, getWordsChunk, onLoading}
}

const initialGroupRequest = {
	group: null,
}


//Usage
//const {currentWordsGroup, getWordsGroup, onGroupLoading} = useWordsGroup()

export function useWordsGroup(){
	const dispatch = useDispatch()
	const words = useSelector(state => state.words)
	const [onGroupLoading, setGroupLoading] = useState(false)
	const [currentRequest, setCurrentRequest] = useState(initialGroupRequest)
	const [currentWordsGroup, setCurrentWordsGroup] = useState(null)

	const getWordsGroup = useCallback((group) => {
		if (!words[group] || Object.keys(words[group]).length < 30) {
			setGroupLoading(true)
			const pageQueue = []
			for (let i = 0; i < 30; i++) {
				if (!words[group] || !(i in words[group])) {
					pageQueue.push(i)
				}
			}
			setCurrentRequest({group})
			return dispatch(getWords(group, pageQueue))
		} else {
			setCurrentWordsGroup(words[group])
			return words[group]
		}
	}, [words, dispatch])

	useEffect(() => {
		if (words[currentRequest.group]
			&& Object.keys(words[currentRequest.group]).length >= 30
			&& currentRequest.group !== null) {
			setGroupLoading(false)
			setCurrentWordsGroup(words[currentRequest.group])
			setCurrentRequest(initialGroupRequest)
		}
	}, [words, currentRequest.group])

	return {currentWordsGroup, getWordsGroup, onGroupLoading}
}

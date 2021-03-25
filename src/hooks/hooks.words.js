import { useState, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getWords } from "../redux/actions"

const initialRequest = {
	group: null,
	page: null,
}
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
			dispatch(getWords(group, page))
			setCurrentRequest({group, page})
			setOnLoading(true)
			return "loading"
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


//Using
//{currentWordsGroup, getWordsGroup, onGroupLoading} = useWordsGroup()

export function useWordsGroup(){

	const dispatch = useDispatch()
	const words = useSelector(state => state.words)
	const [onGroupLoading, setGroupLoading] = useState(false)
	const [currentRequest, setCurrentRequest] = useState(initialGroupRequest)
	const [currentWordsGroup, setCurrentWordsGroup] = useState(null)

	const getWordsGroup = useCallback((group) => {
		if (!words[group] || Object.keys(words[group]).length < 30) {
			setGroupLoading(true)
			for (let i = 0; i < 30; i++) {
				if (!words[group] || !(i in words[group])) {
					dispatch(getWords(group, i))
				}
			}
			setCurrentRequest({group})
			return "loading"
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

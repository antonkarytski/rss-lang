
//1. Как брать данные о словах
//1.1 Нерптимизированный способ:


import { useDispatch, useSelector } from "react-redux"
const dispatch = useDispatch()
const words = useSelector(state => state.words)

// в words хранится все дерево слов в формате:

const wordTreeFormat = {
	0: {        //0 - номер группы (всего 6, отсчет начинается с 0)
		1: [],    //1 - номер страницы (всего 20, отсчет начинается с 0)
		2: [],    //в каждом массиве 20 объектов слова
		3: [],
	},
	//...
	5:{
		2:[],
		3:[],
		4:[]
	}
}

//API позволяет скачивать слова из базы чанками (по 20 штук), таким образом, в самом начале words будет пустой
//для того чтобы получить значение вы использовать экшн getWords и передавать в него номер группы и номер страницы
//после выполнения запроса в words появится соответствующий чанк слова

//import { getWords } from "../redux/actions.words"
dispatch(getWords(group, page))

//минус такого подхода заключается в том что getWords делает запрос к базе данных каждый раз, независимо оттого есть
//у нас уже этот чанк слов или нет


//1.2 Оптимизированный способ:
//использование хука useWords

//import useWords from "./src/hooks/hooks.words"
const {currentWords, getWordsChunk, onLoading} = useWords()

//если используется этот хук то диспатч и юзселектор использовать не надо
//для получения нужного чанка необходимо вызвать функцию:

const res = getWordsChunk(group, page)

//getWordsChunk осуществляет поиск по дереву words нужного чанка и возвращает его, а также записывает в
//currentWords текущий чанк (в случае если чанк уже находится в words).
//В случае если такой чанк еще не был загружен, функция делает запрос и загружает
//данные с сервера. При этом вам будет возвращена строка "loading", а флаг onLoading будет установлен в true,
//это можно использовать для индикатора загрузки страницы
//когда придет ответ с сервера в currentWords запишется текущий чанк, а флаг onLoading будет установлен
//в false.

//Если вы используете getWordsChunk c currentWords - не вызвыйте getWordsChunk  в теле функции, только
//на ивентах или в useEffect иначе это вызовет бесконечное зацикливание и приведет к ошибке


//------------------------------------------------------------------------
//Хук useWordsGroup аналогичный useWords:

//import { useWordsGroup } from "./hooks/hooks.words"

const {currentWordsGroup, getWordsGroup, onGroupLoading} = useWordsGroup()

//делает тоже самое только загружает целый раздел, getWordsGroup принимает номер раздела


//-------------------------------------------------------------------------
//Хук для нахождения пересечения с данными юзера:
// if user and words array have words in requested words - will be set immediately
// getUserWordsChunk return this value too
// if user have, but words array doesn't have requested words - will be set after response come from server
// and getUserWordsChunk return Promise
// if user doesn't have requested words - will never set for this group-page
// and getUserWordsChunk return False
// BUT when user get at least one word on this page, value will be set in subscribedUserWords
//перед использованием надо убедиться что пользователь аутентифицирован иначу вернут пустой массив
//import {useUserWords} from "../../../hooks/hooks.user"
const {currentUserWords, getUserWordsChunk, subscribedUserWords, onLoading: onUserLoading} = useUserWords()

const filters = {
	difficulty: "hard | normal | weak" | undefined, //ищет совпадения по сложности, возвращает все сложности
	deleted: true | false | undefined //ищет удаленные пользователем значени
}
getUserWordsChunk(group, page, filters)


const user = useSelector(state => state.user)
useEffect(() => {
	if(user.words){
		getUserWordsChunk(group, page, filters)
	}
}, [user])


useEffect(() => {
	if(currentUserWords){
		console.log(currentUserWords)
	}
}, [currentUserWords])

useEffect(() => {
	if(subscribedUserWords){
		console.log(`ВЫ ИЗУЧИЛИ СЛОВО ${subscribedUserWords[0].name}`)
	}
}, [subscribedUserWords])

//Тоже самое для группы
//Usage
import {useUserWordsGroup} from './src/hooks/hooks.user'
const {getUserWordsGroup, subscribedUserWordsGroup, onLoading, currentUserWordsGroup} = useUserWordsGroup()


//-------------------------------------------------------------------------
//Хук для обновления данных о слове юзера
import {useUserWordUpdate} from './src/hooks/hooks.user'
import {useEffect, useState} from "react";
import {addStatisticsThunk, getStatisticsThunk} from "./src/redux/games/thunk.statistics";
import {populateStatistics} from "./src/helpers/gameUtils";
const { update, updatedWord, onError } = useUserWordUpdate()

// update get word object from words array (not user array) and additional data
const data = {
 difficulty: weak | normal | hard,
	successCounter: Number,
	failCounter: Number,
	deleted: Boolean,
}
update(word, data)

//Если такое слово у пользователя уже есть, то обновляет его исходя из параметров и немедленно возвращает
//вернет Promise
//когда слово будет записано в базу, обновленное слово запишется в updatedWord
//если произойдет ошибка то в onError запишется объект в который будет записано слово и ошибка
//Если у пользователя такого слова нет то добавит его ему и произведет такие же действия как при апдейте

//-------------------------------------------------------------------------
//statusGameSelector //setStatusGame action
// бывает true/false в зависимости от того, вошли мы в игру или нет

const statusGame = useSelector(statusGameSelector);

return (
	<div>
		{statusGame ? (<GamePage />) : (<StartPage />)}
	</div>
);
// при нажатии кнопки начать игру на странице  StartPage
const handleStart = useCallback(() => {
	dispatch(setStatusGame(true));
}, [dispatch]);

// при окончании игры на стр GamePage
const HandleExit = useCallback(() => {
	dispatch(setStatusGame(false));
}, [dispatch]);

//levelSelector //setLevel action
const activeLevel = useSelector(levelSelector);

dispatch(setLevel(levelProps));
// изменяем уровень
//-------------------------------------------------------------------------
//как исп-ть statistics thunk

const allStatistics = useSelector(statisticsSelector);

const [currentGameStatistics, setCurrentGameStatistics] = useState({
  rightAnswers: 0, wrongAnswers: 0, bestSeries: 0
});

const [currentSeries, setCurrentSeries] = useState(0);

useEffect(() => {
  dispatch(getStatisticsThunk(userId));
}, [dispatch, userId]);

//в функции окончания игры добавляем
const updatesStatistics = populateStatistics(
  "savannah", allStatistics, {...currentGameStatistics, wordCounter, createdOn: Date.now()}
);
updatesStatistics.learnedWords = wordCounter;
dispatch(addStatisticsThunk(userId, updatesStatistics));
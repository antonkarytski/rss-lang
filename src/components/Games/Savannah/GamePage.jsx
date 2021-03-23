import React, { useState, useCallback, useEffect } from 'react';
import { getRandomNumber, shuffle } from '../../../helpers/gameUtils';
import { setStatusGame } from '../../../redux/savannah/actions';
import {makeStyles} from "@material-ui/core";
import { useDispatch } from "react-redux"
import crystal from "../../../assets/images/crystal.svg"
import {useWords} from "../../../hooks/hooks.words"
import classNames from "classnames";
import Loader from "../../Loader";


//const page = 1;

let crystalSize = 0.5;

const Savannah = () => {
    // const activeLevel = useSelector(levelSelector);
    const dispatch = useDispatch();
    // const userId = useSelector(userIdSelector);
    // const token = useSelector(tokenSelector);

    const [answer, setAnswer] = useState('');
    const [arrayWordsWithStatistics, setArrayWordsWithStatistics] = useState([]);
    const [arrOfWords, setArrOfWords] = useState([]);
    const [btnClicked, setBtnClicked] = useState(false);
    const [gettingWords, setGettingWords] = useState(true);
    const [isExit, setIsExit] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [livesCount, setLivesCount] = useState(5);
    const [numRightAnswers, setNumRightAnswers] = useState(0);
    const [numWrongAnswers, setNumWrongAnswers] = useState(0);
    const [scaleSize, setScaleSize] = useState(crystalSize);
    //const [soundOn, setSoundOn] = useState(true);
    const [word, setWord] = useState('');
    const [wordTranslation, setWordTranslation] = useState('');
    const [wordID, setWordID] = useState('');
    const [wordAudio, setWordAudio] = useState('');
    const [wordTranscription, setWordTranscription] = useState('');
    const [wordCounter, setWordCounter] = useState(20);
    const [words, setWords] = useState([]);
    const {currentWords, getWordsChunk, onLoading} = useWords();

    // const userWordsURL = useMemo(() => {
    //     return `words?page=${page}
    // &group=${activeLevel}
    // &wordsPerExampleSentenceLTE=99\`
    // + '&wordsPerPage=120'`
    //     },[activeLevel],
    // );

    //const action = useCallback((wordsFromApi) => setWords(wordsFromApi),[]);
    //const wordsUseApi = useAPI(userWordsURL, fetchOptions, action);



    useEffect(() => {
        const words = getWordsChunk(1, 0);
        console.log(words);

        if (words!=="loading" && gettingWords && livesCount && wordCounter) {
            const randomNumberOne = getRandomNumber(0, words.length - 1);
            const randomNumberTwo = getRandomNumber(0, words.length - 1);

            const translatedWordId = words[randomNumberOne].id;
            const wordInArrId = arrayWordsWithStatistics.find((word) => word.id === translatedWordId);

            if (wordInArrId) {
                const newWordTranslation = words[randomNumberTwo].wordTranslate;
                setWord(words[randomNumberTwo].word);
                setWordID(words[randomNumberTwo].id);
                setWordAudio(words[randomNumberTwo].audio);
                setWordTranscription(words[randomNumberTwo].transcription);
                setWordTranslation(newWordTranslation);

                const arrOfTranslations = [];
                arrOfTranslations.push(newWordTranslation);

                while (arrOfTranslations.length < 4) {
                    const translation = words[getRandomNumber(0, words.length - 1)].wordTranslate;
                    if (!arrOfTranslations.includes(translation)) {
                        arrOfTranslations.push(translation);
                    }
                }

                const shuffledTranslations = shuffle(arrOfTranslations);
                setArrOfWords(shuffledTranslations);
                setGettingWords(false);
            } else {
                const newWordTranslation = words[randomNumberOne].wordTranslate;
                setWord(words[randomNumberOne].word);
                setWordID(words[randomNumberOne].id);
                setWordAudio(words[randomNumberOne].audio);
                setWordTranscription(words[randomNumberOne].transcription);
                setWordTranslation(newWordTranslation);

                const arrOfTranslations = [];
                arrOfTranslations.push(newWordTranslation);
                while (arrOfTranslations.length < 4) {

                    const translation = words[getRandomNumber(0, words.length - 1)].wordTranslate;
                    if (!arrOfTranslations.includes(translation)) {
                        arrOfTranslations.push(translation);
                    }
                }

                const shuffledTranslations = shuffle(arrOfTranslations);
                setArrOfWords(shuffledTranslations);
                setGettingWords(false);
            }
        }

        if (!wordCounter) {
            handleGameOver();
        }
        return () => {
            setGettingWords(false);
        };
    }, [words, gettingWords, livesCount, wordCounter, getWordsChunk]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (livesCount && !btnClicked) {
                setGettingWords(true);
                setAnswer(false);
                setLivesCount(livesCount - 1);
                updateStats(false);
            }
        }, 4650);

        return () => {
            clearTimeout(timer);
        };
    }, [livesCount, answer, btnClicked]);

    const handleGameOver = useCallback(() => {
            setIsGameOver(true);
            setWord(' ');
            setGettingWords(false);
            setArrOfWords([]);
            setLivesCount(0);

            // const link = `users/${userId}/statistics`;
            // const date = new Date(Date.now());
            // const dateString = date.toLocaleDateString('en-Us');
            // const getFetchOptions = {
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `Bearer ${token}`,
            //         'Accept': 'application/json',
            //         'Content-Type': 'application/json',
            //     },
            // };

            //     const promise = fetchJSON(link, getFetchOptions);
            //     promise
            //         .then(({ id, ...stats }) => {
            //             let gameStatistics = {};
            //             const optionals = stats.optional;
            //
            //             if (stats.optional.savannah) {
            //                 gameStatistics = { ...stats.optional.savannah };
            //             }
            //
            //             if (gameStatistics[dateString]) {
            //                 gameStatistics[dateString] = {
            //                     'timesPlayed': gameStatistics[dateString].timesPlayed + 1,
            //                     'result': gameStatistics[dateString].result + numRightAnswers,
            //                 };
            //             } else {
            //                 gameStatistics[dateString] = {
            //                     'timesPlayed': 1,
            //                     'result': numRightAnswers,
            //                 };
            //             }
            //
            //             const currentStatistics = {
            //                 ...stats,
            //                 optional: {
            //                     ...optionals,
            //                     savannah: {
            //                         ...gameStatistics,
            //                     },
            //                 },
            //             };
            //             return currentStatistics;
            //         })
            //         .then((currentStatistics) => {
            //             const sendOptions = {
            //                 ...getFetchOptions,
            //                 method: 'PUT',
            //                 body: JSON.stringify(currentStatistics),
            //             };
            //             fetchJSON(link, sendOptions);
            //         })
            //         .catch(() => {
            //             const currentStatistics = {
            //                 ...baseStatistic,
            //             };
            //
            //             currentStatistics.optional.savannah[dateString] = {
            //                 'timesPlayed': 1,
            //                 'result': numRightAnswers,
            //             };
            //
            //             const sendOptions = {
            //                 ...getFetchOptions,
            //                 method: 'PUT',
            //                 body: JSON.stringify(currentStatistics),
            //             };
            //
            //             fetchJSON(link, sendOptions);
            //         });
        },
        [numRightAnswers]);

    // const playSound = useCallback((isAnswerRight) => {
    //     if (soundOn) {
    //         if (isAnswerRight) audioRight.play();
    //         else audioWrong.play();
    //     }
    // }, [soundOn]);

    const HandleExit = useCallback(() => {
        dispatch(setStatusGame(false));
        setIsExit(false);
    }, [dispatch]);

    const updateStats = useCallback((isCorrect) => {
        setArrayWordsWithStatistics([...arrayWordsWithStatistics, {
            'word': word,
            'id': wordID,
            'audio': wordAudio,
            'transcription': wordTranscription,
            'translation': wordTranslation,
            'isCorrect': isCorrect,
        }]);
    }, [arrayWordsWithStatistics]);

    const checkAnswer = useCallback((wordActive, answerActive) => {
        const correct = wordActive === answerActive;
        updateStats(correct);
        setAnswer(correct);
        setBtnClicked(correct);
        setWordCounter(wordCounter - 1);
        //playSound(correct);

        if (correct) {
            setScaleSize(crystalSize += 0.02);
            setNumRightAnswers(numRightAnswers + 1);
        } else {
            setLivesCount(livesCount - 1);
            setNumWrongAnswers(numWrongAnswers + 1);
        }
    }, [answer, btnClicked, wordCounter, scaleSize, numRightAnswers]);

    const refreshWordsOnClick = useCallback(() => {
        setTimeout(() => {
            setGettingWords(true);
            setAnswer(false);
            setBtnClicked(false);
        }, 500);
    }, [gettingWords, answer, btnClicked]);


    // const changeActiveLevel = useCallback((levelProps) => {
    //     if (activeLevel !== levelProps) {
    //         dispatch(setLevel(levelProps));
    //     }
    // }, [dispatch, activeLevel]);

    return (
        <>
        {onLoading ? <Loader/> : (
            <div>
            {isGameOver ? (<div>results</div>) : false}
            <div>SoundSwitcher</div>
            <div>Rules</div>
            <div>exit</div>
            <div>Lives</div>
            {
                isGameOver
                    ? <h2 style={{ textAlign: 'center', color: 'red' }}>Game Over</h2>
                    : ''
            }
            <div
                // className={classNames('wrapper_falling',
                //     { 'animation': !btnClicked },
                //     { 'no-animation': btnClicked },
                //     { 'no-animation': isGameOver })}
            >
                <h3 className="falling_word">
                    {(word)}
                </h3>
            </div>
            <div className="listWords">
                {
                    arrOfWords.map((itemWord) => (
                        <button
                            key={itemWord}
                            onClick={(e) => {
                                checkAnswer(itemWord, wordTranslation);
                                refreshWordsOnClick();
                            }}
                            type="button"
                            className={classNames(
                                { 'wrong': btnClicked && itemWord !== wordTranslation },
                                { 'right': btnClicked && itemWord === wordTranslation },
                            )}
                        >
                            {(itemWord)}
                        </button>
                    ))
                }
            </div>

            <img
                className={classNames('crystal', {
                    'animation-for-crystal ': answer,
                    'animation-for-crystal-wrong': !answer,
                })}
                src={crystal}
                alt="crystal"
                style={{ transform: `scale(${scaleSize})` }}
            />
        </div>)}
        </>
    );
};

const useStyles = makeStyles({

});

export default Savannah;

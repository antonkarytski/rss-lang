import React, { useState, useCallback, useEffect } from 'react';
import { getRandomNumber, shuffle } from '../../../helpers/gameUtils';
import { setStatusGame, setLevel } from '../../../redux/savannah/actions';
import {Grid, makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux"
import snake from "../../../assets/images/snake.svg"
import {useWords} from "../../../hooks/hooks.words"
import classNames from "classnames";
import Loader from "../../../components/Loader";
import background from "../../../assets/images/2.jpg";
import CloseIcon from '@material-ui/icons/Close';
import {Link} from "react-router-dom";
import {levelSelector} from "../../../redux/savannah/selectors";
import Levels from "../common/Levels";
import Statistics from "../common/Statistics";
import Lives from "../common/Lives";
import CloseButton from "../common/CloseButton";

//const page = 1;

let snakeSize = 0.6;

const Savannah = () => {
    const activeLevel = useSelector(levelSelector);
    const dispatch = useDispatch();
    // const userId = useSelector(userIdSelector);
    // const token = useSelector(tokenSelector);

    const [answer, setAnswer] = useState('');
    const [statisticsArr, setStatisticsArr] = useState([]);
    const [arrOfWords, setArrOfWords] = useState([]);
    const [btnClicked, setBtnClicked] = useState(false);
    const [gettingWords, setGettingWords] = useState(true);
    const [isExit, setIsExit] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [livesCount, setLivesCount] = useState(5);
    const [rightAnswers, setrightAnswers] = useState(0);
    const [wrongAnswers, setwrongAnswers] = useState(0);
    const [scaleSize, setScaleSize] = useState(snakeSize);
    //const [soundOn, setSoundOn] = useState(true);
    const [word, setWord] = useState('');
    const [wordTranslation, setWordTranslation] = useState('');
    const [wordID, setWordID] = useState('');
    const [wordAudio, setWordAudio] = useState('');
    const [wordTranscription, setWordTranscription] = useState('');
    const [wordCounter, setWordCounter] = useState(20);
    const [words, setWords] = useState([]);

    const {currentWords, getWordsChunk, onLoading} = useWords();
    const classes = useStyles({scaleSize});


    //const action = useCallback((wordsFromApi) => setWords(wordsFromApi),[]);
    //const wordsUseApi = useAPI(userWordsURL, fetchOptions, action);

    const handleGameOver = useCallback(() => {
            setIsGameOver(true);
            setWord(' ');
            setGettingWords(false);
            setArrOfWords([]);
            setLivesCount(0);
        },
        []);

    useEffect(() => {
        const words = getWordsChunk(activeLevel - 1, 0);
        console.log(words);
        //console.log(activeLevel);

        if (words !== "loading" && gettingWords && livesCount && wordCounter) {
            const randomNumberOne = getRandomNumber(0, words.length - 1);
            const randomNumberTwo = getRandomNumber(0, words.length - 1);

            const translatedWordId = words[randomNumberOne].id;
            const wordInArrId = statisticsArr.find((word) => word.id === translatedWordId);

            const f1 = (randomNumber) => {
                const newWordTranslation = words[randomNumber].wordTranslate;
                setWord(words[randomNumber].word);
                setWordID(words[randomNumber].id);
                setWordAudio(words[randomNumber].audio);
                setWordTranscription(words[randomNumber].transcription);
                setWordTranslation(newWordTranslation);
                setArrOfWords(f2(words, newWordTranslation));
                setGettingWords(false);
            };

            f1(wordInArrId ? randomNumberTwo : randomNumberOne);

        }

        if (!wordCounter) {
            handleGameOver();
        }
        return () => {
            setGettingWords(false);
        };
    }, [gettingWords, livesCount, wordCounter, getWordsChunk, statisticsArr, handleGameOver, activeLevel]);

    const updateStats = useCallback((isCorrect) => {
        setStatisticsArr([...statisticsArr, {
            'word': word,
            'id': wordID,
            'audio': wordAudio,
            'transcription': wordTranscription,
            'translation': wordTranslation,
            'isCorrect': isCorrect,
        }]);
    }, [word, wordID, wordAudio, wordTranscription, wordTranslation, statisticsArr]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (livesCount && !btnClicked) {
                setGettingWords(true);
                setAnswer(false);
                setLivesCount(livesCount - 1);
                updateStats(false);
            }
        }, 6900);

        return () => {
            clearTimeout(timer);
        };
    }, [updateStats, livesCount, answer, btnClicked]);

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

    const checkAnswer = useCallback((wordActive, answerActive) => {
        let correct = wordActive === answerActive;
        updateStats(correct);
        setAnswer(correct);
        setBtnClicked(correct);
        setWordCounter(wordCounter - 1);
        //playSound(correct);

        if (correct) {
            setScaleSize(snakeSize += 0.02);
            setrightAnswers(rightAnswers + 1);
        } else {
            setLivesCount(livesCount - 1);
            setwrongAnswers(wrongAnswers + 1);
        }
    }, [livesCount, updateStats, wrongAnswers, wordCounter, rightAnswers]);

    const refreshWordsOnClick = useCallback(() => {
        setTimeout(() => {
            setGettingWords(true);
            setAnswer(false);
            setBtnClicked(false);
        }, 500);
    }, []);


    const changeLevel = useCallback((levelProps) => {
        if (activeLevel !== levelProps) {
            dispatch(setLevel(levelProps));
        }
    }, [dispatch, activeLevel]);

    return (
        <>
        {onLoading ? <Loader/> : (
            <Grid className={classes.container}>
                {isGameOver && (
                    <Statistics
                        statisticsArr={statisticsArr}
                        rightAnswers={rightAnswers}
                        wrongAnswers={wrongAnswers}
                        toNewGame={HandleExit}
                    />)}

                {!isGameOver && (<Grid container justify="space-between" alignItems="center">
                    <Grid item xs={4} >
                        <Levels changeActiveLevel={changeLevel} currentLevel={activeLevel} />
                    </Grid>
                    <Grid item xs={4} container justify="center">
                        <Lives livesCount={livesCount} gameOver={handleGameOver}/>
                    </Grid>
                    <Grid item xs={4} container justify="flex-end">
                        <CloseButton/>
                    </Grid>
                </Grid>)}

                {!isGameOver && (<Grid container
                      direction="column"
                      justify="space-between"
                      alignItems="center"
                      className={classes.gameContainer}>

                    <div
                        className={classNames({
                            [classes.wrapperFalling]: true,
                            [classes.animation]: !btnClicked,
                            [classes.noAnimation]: isGameOver || btnClicked,
                        })}
                    >


                        <h3 className={classes.fallingWord} >
                            {(word)}
                        </h3>
                    </div>
                    <Grid container justify="space-evenly" alignItems="center" className={classes.listWords}>
                        {
                            arrOfWords.map((itemWord) => (
                                <button
                                    key={itemWord}
                                    onClick={(e) => {
                                        checkAnswer(itemWord, wordTranslation);
                                        refreshWordsOnClick();
                                    }}
                                    className={classNames({
                                        [classes.wordButton]: true,
                                        [classes.wrong]: btnClicked && itemWord !== wordTranslation,
                                        [classes.right]: btnClicked && itemWord === wordTranslation,
                                    })}
                                >
                                    {(itemWord)}
                                </button>
                            ))
                        }
                    </Grid>

                    <img
                        className={classNames({
                            [classes.snake]: true,
                            [classes.snakeCorrectAnswer]: answer,
                        })}
                        src={snake}
                        alt="snake"
                    />
                </Grid>)}
        </Grid>)}
        </>
    );
};

const f2 = (words, newWordTranslation) => {
    const arrOfTranslations = [];
    arrOfTranslations.push(newWordTranslation);

    while (arrOfTranslations.length < 4) {
        const translation = words[getRandomNumber(0, words.length - 1)].wordTranslate;
        if (!arrOfTranslations.includes(translation)) {
            arrOfTranslations.push(translation);
        }
    }

    return shuffle(arrOfTranslations);
};

const useStyles = makeStyles({
    container: {
        height: '100vh',
        position: 'relative',
        background: `linear-gradient(#399a7233, #8dada730),url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: '100vw',
    },
    snake: ({ scaleSize }) => ({
        width: '64px',
        transform: `scale(${scaleSize})`
    }),
    gameContainer: {
        height: '550px',
    },
    fallingWord: {
        fontSize: '35px',
        textAlign: 'center',
    },
    wrapperFalling: {
        position: 'absolute',
    },
    animation: {
        animation: `$falling 7s infinite`,
    },
    noAnimation: {
     animation: 'unset',
    },
    listWords: {
        position: 'relative',
        top: '50%',
    },
    wordButton: {
        background: 'linear-gradient(#63c9f585, #ffc7647d)',
        height: '120px',
        width: '120px',
        wordBreak: 'break-word',
        borderRadius: '50%',
        outline: 'none',
        cursor: 'pointer',
    },
    snakeCorrectAnswer: {
        animation: `$snakeCorrectAnimation 5s infinite, $shake 2.5s linear infinite`,
    },
    '@keyframes shake': {
        '0%': { transform: 'translate(1px, 1px) rotate(0deg)', },
        '10%': { transform: 'translate(-1px, -2px) rotate(-1deg)', },
        '30%': { transform: 'translate(3px, 2px) rotate(0deg)', },
        '50%': { transform: 'translate(-1px, 2px) rotate(-1deg)', },
        '70%': { transform: 'translate(3px, 1px) rotate(-1deg)', },
        '90%': { transform: 'translate(1px, 2px) rotate(0deg)', },
    },
    '@keyframes falling': {
        '0%': {
            top: '10%',
        },
        '100%': {
            top: '60%',
        },
    },
    '@keyframes snakeCorrectAnimation': {
        "20%": {
            filter: 'hue-rotate(70deg)',
        }
    }
});

export default Savannah;


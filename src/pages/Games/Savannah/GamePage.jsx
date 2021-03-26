import React, {useState, useCallback, useEffect, useMemo} from 'react';
import { getRandomNumber, shuffle } from '../../../helpers/gameUtils';
import { setStatusGame, setLevel } from '../../../redux/games/actions';
import {Grid, makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux"
import snake from "../../../assets/images/snake.svg"
import {useWords} from "../../../hooks/hooks.words"
import classNames from "classnames";
import Loader from "../../../components/Loader";
import background from "../../../assets/images/2.jpg";
import {levelSelector} from "../../../redux/games/selectors";
import Levels from "../common/Levels";
import Statistics from "../common/Statistics";
import Lives from "../common/Lives";
import CloseButton from "../common/CloseButton";
import SoundButton from "../common/SoundButton";
import correctSound from "../../../assets/audio/correct.mp3";
import errorSound from "../../../assets/audio/error.mp3";
import FullScreenButton from "../common/FullScreenButton";

const Savannah = () => {
    let snakeSize = 0.6;

    const activeLevel = useSelector(levelSelector);
    const dispatch = useDispatch();

    const [answer, setAnswer] = useState('');
    const [statisticsArr, setStatisticsArr] = useState([]);
    const [arrOfWords, setArrOfWords] = useState([]);
    const [btnClicked, setBtnClicked] = useState(false);
    const [isExit, setIsExit] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [livesCount, setLivesCount] = useState(5);
    const [rightAnswers, setrightAnswers] = useState(0);
    const [wrongAnswers, setwrongAnswers] = useState(0);
    const [soundOn, setSoundOn] = useState(true);
    const [word, setWord] = useState('');
    const [wordTranslation, setWordTranslation] = useState('');
    const [wordID, setWordID] = useState('');
    const [wordAudio, setWordAudio] = useState('');
    const [wordTranscription, setWordTranscription] = useState('');
    const [wordCounter, setWordCounter] = useState(20);
    const [wordCounter, setWordCounter] = useState(0);
    const [shuffledWords, setShuffledWords] = useState(null)

    const {currentWords, getWordsChunk, onLoading} = useWords();

    const classes = useStyles({snakeSize});



    const randomPage = useMemo(() => {
        return getRandomNumber(0, 19);
    },[]);

    useEffect(() => {
        getWordsChunk(activeLevel - 1, randomPage);
    },[randomPage, getWordsChunk, activeLevel]);

    const handleGameOver = useCallback(() => {
            setIsGameOver(true);
            setWord(' ');
            setArrOfWords([]);
            setLivesCount(0);
        },
        []);

    useEffect(() => {
        //randomPage
        //console.log(words);
        console.log(currentWords);

        if (currentWords !== null && livesCount && wordCounter) {
        //randomPage
        //console.log(words);
        console.log(shuffledWords);

        if (shuffledWords !== null && livesCount && wordCounter < 20) {
            const f1 = (randomNumber) => {
                const newWordTranslation = shuffledWords[randomNumber].wordTranslate;
                setWord(shuffledWords[randomNumber].word);
                setWordID(shuffledWords[randomNumber].id);
                setWordAudio(shuffledWords[randomNumber].audio);
                setWordTranscription(shuffledWords[randomNumber].transcription);
                setWordTranslation(newWordTranslation);
                setArrOfWords(f2(shuffledWords, newWordTranslation));
            };

            f1(wordCounter);
        }

        if (wordCounter === 20) {
            handleGameOver();
        }
    }, [livesCount, wordCounter, getWordsChunk, statisticsArr, handleGameOver, activeLevel, shuffledWords]);

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
                setAnswer(false);
                setLivesCount(livesCount - 1);
                updateStats(false);
                playSound(false, soundOn);
            }
        }, 6900);

        return () => {
            clearTimeout(timer);
        };
    }, [updateStats, livesCount, answer, btnClicked, soundOn]);

    const handleExit = useCallback(() => {
        dispatch(setStatusGame(false));
        setIsExit(false);
    }, [dispatch]);

    const handleChangeSound = useCallback(() => {
        setSoundOn(!soundOn);
    },[soundOn]);

    const checkAnswer = useCallback((wordActive, answerActive) => {
        let correct = wordActive === answerActive;
        updateStats(correct);
        setAnswer(correct);
        setBtnClicked(correct);
        setWordCounter(wordCounter + 1);

        if (correct) {
            snakeSize += 0.02;
            setrightAnswers(rightAnswers + 1);
            playSound(true, soundOn);
        } else {
            setLivesCount(livesCount - 1);
            setwrongAnswers(wrongAnswers + 1);
            playSound(false, soundOn);
        }
    }, [livesCount, updateStats, wrongAnswers, wordCounter, rightAnswers, soundOn]);

    const refreshWordsOnClick = useCallback(() => {
        setTimeout(() => {
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
        {!onLoading ? <Loader/> : (
            <Grid className={classes.container}>
                {isGameOver && (
                    <Statistics
                        statisticsArr={statisticsArr}
                        rightAnswers={rightAnswers}
                        wrongAnswers={wrongAnswers}
                        toNewGame={handleExit}
                    />)}

                {!isGameOver && (<Grid container justify="space-between" alignItems="center">
                    <Grid item xs={2.4} >
                        <Levels changeActiveLevel={changeLevel} currentLevel={activeLevel} />
                    </Grid>
                    <Grid item xs={2.4}  >
                        <Lives livesCount={livesCount} gameOver={handleGameOver}/>
                    </Grid>
                    <Grid item xs={2.4}  >
                        <SoundButton onClick={handleChangeSound} isEnabled={soundOn}/>
                    </Grid>
                    <Grid item xs={2.4}  >
                        <FullScreenButton/>
                    </Grid>
                    <Grid item xs={2.4}  >
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
                                        [classes.bubble]: true,
                                        [classes.wordButtonWrong]: btnClicked && itemWord !== wordTranslation,
                                        [classes.wordButtonRight]: btnClicked && itemWord === wordTranslation,
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
            <audio id="correctSound" src={correctSound}/>
            <audio id="errorSound" src={errorSound}/>
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

const playSound = (isCorrect, soundOn) => {
    const correctSound = document.querySelector("#correctSound");
    const errorSound = document.querySelector("#errorSound");
    if (soundOn) {
        isCorrect ? correctSound.play() : errorSound.play();
    }
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
    snake: ({ snakeSize }) => ({
        width: '64px',
        transform: `scale(${snakeSize})`
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
        animation: `$falling 7s infinite, $disappear 7s infinite`,
    },
    noAnimation: {
     animation: 'unset',
    },
    listWords: {
        position: 'relative',
        top: '50%',
    },
    wordButton: {
        display: 'inline-block',
        height: '120px',
        width: '120px',
        wordBreak: 'break-word',
        borderRadius: '50%',
        outline: 'none',
        cursor: 'pointer',
        border: 0,
        background: 'radial-gradient(circle at bottom, #81e8f6, #76deef 10%, #055194 80%, #062745 100%)',
        "&:before":{
            content: "",
            position: 'absolute',
            top: '1%',
            left: '5%',
            width: '90%',
            height: '90%',
            borderRadius: '100%',
            filter: 'blur(5px)',
            zIndex: 2,
            background: 'radial-gradient(circle at top, white, rgba(255, 255, 255, 0) 58%)',
        },
        "&:after":{
            content: "",
            position: 'absolute',
            top: '5%',
            left: '10%',
            width: '80%',
            height: '80%',
            borderRadius: '100%',
            filter: 'blur(1px)',
            zIndex: 2,
            transform: 'rotateZ(-30deg)',
        },
        "&:active": {
            animation: `$bubble .5s ease`,
        },
    },
    bubble: {
        background: 'radial-gradient(circle at 50% 55%, rgba(240, 245, 255, 0.9), rgba(240, 245, 255, 0.9) 40%, rgba(225, 238, 255, 0.8) 60%, rgba(43, 130, 255, 0.4))',
        "&:before":{
            filter: 'blur(0)',
            height: '80%',
            width: '40%',
            background: 'radial-gradient(circle at 130% 130%, rgba(255, 255, 255, 0) 0, rgba(255, 255, 255, 0) 46%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0.8) 58%, rgba(255, 255, 255, 0) 60%, rgba(255, 255, 255, 0) 100%)',
            transform: 'translateX(131%) translateY(58%) rotateZ(168deg) rotateX(10deg)',
        },
        "&:after":{
            display: 'block',
            background: 'radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0) 74%, white 80%, white 84%, rgba(255, 255, 255, 0) 100%)',
        },
    },
    // wordButtonRight: {
    //     animation: `$bubble .5s ease-out`,
    // },
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
    '@keyframes disappear': {
        '0%': {
            opacity: 1,
        },
        '100%': {
            opacity: 0.1,
        },
    },
    '@keyframes snakeCorrectAnimation': {
        "20%": {
            filter: 'hue-rotate(70deg)',
        }
    },
    '@keyframes bubble': {
        '0%': {
            transform: 'scale(1)',
        },

        '68%': {
            transform: 'scaleY(0.5) scaleX(0.5)',
        },

        '100%': {
            transform: 'scale(1)',
        }
    }
});

export default Savannah;


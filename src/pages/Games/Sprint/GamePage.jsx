import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {Grid, makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import SoundButton from "../common/SoundButton";
import correctSound from "../../../assets/audio/correct.mp3";
import errorSound from "../../../assets/audio/error.mp3";
import FullScreenButton from "../common/FullScreenButton";
import Button from "../common/Button";
import Timer from "../common/Timer";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import branch from "../../../assets/images/branch.png";
import parrot1 from "../../../assets/images/parrot1.png";
import parrot2 from "../../../assets/images/parrot2.png";
import parrot3 from "../../../assets/images/parrot3.png";
import parrot4 from "../../../assets/images/parrot4.png";
import {SETTINGS} from "../../../settings";
import classesCss from "../common/StatisticModal/StatisticModal.module.scss";
import {getRandomNumber, shuffle} from "../../../helpers/gameUtils";
import classNames from "classnames";

const NUMBER_OF_WORDS = 20;

const Marks = (props) => {
  const { count = 0 } = props;

  const marks = [
    ...(new Array(count).fill(true)),
    ...(new Array(3 - count).fill(false))
  ];

  const classes = useStyles();

  return (
    <Grid container justify="center" alignItems="center" className={classes.marks}>
      {marks.map((mark, index) => (
        <Grid item key={index}>
          {mark && (<div>1</div>)}
          {!mark && (<div>0</div>)}
        </Grid>
      ))}
    </Grid>
  );
};

const Parrots = (props) => {
  const { count = 1 } = props;

  const parrots = [
    ...(new Array(count).fill(true)),
    ...(new Array(4 - count).fill(false))
  ];

  const classes = useStyles();

  const parrotsSrc = [parrot1, parrot2, parrot3, parrot4];

  return (
    <Grid container justify="center" alignItems="center" className={classes.parrotsContainer}>
      {parrots.map((isVisible, index) => (
          <img key={index} src={parrotsSrc[index]} alt="parrot" className={isVisible ? "" : classes.hidden} />
      ))}
      <img src={branch} alt="branch" className={classes.branch}/>
    </Grid>
  );
};

const Sprint = (props) => {
  const {words, onLoading, onWordSelect, onGameEnd} = props;

  const [score, setScore] = useState(0);
  const [rate, setRate] = useState(1);
  const [marksCombo, setMarksCombo] = useState(0);

  const [soundOn, setSoundOn] = useState(false);
  const [wordCounter, setWordCounter] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState("");
  const classes = useStyles();

  const currentChunk = useMemo(() => {
    if (words?.length > 0) {
      return [...words]
    }
    return null
  }, [words]);

  const playAudio = useCallback((n) => () => {
    const audioPath = 'https://raw.githubusercontent.com/'
      + 'AnnaDavydenko/rslang-data/master/';
    const pronounce = new Audio(`${audioPath}${currentChunk[n].audio}`);
    pronounce.play();
  }, [currentChunk]);

  const setWordTranslation = useCallback((words, correctWordTranslation) => {
    const arrOfTranslations = [];
    arrOfTranslations.push(correctWordTranslation);
    const translation = words[getRandomNumber(0, words.length - 1)].wordTranslate;
    arrOfTranslations.push(translation);
    shuffle(arrOfTranslations);
    const randomTranslation = arrOfTranslations[getRandomNumber(0, arrOfTranslations.length - 1)];
    setCurrentTranslation(randomTranslation);
    return randomTranslation;
  },[]);

  const randomTranslation = useMemo(() => {
      return currentChunk ? setWordTranslation(currentChunk, currentChunk[wordCounter].wordTranslate) : null;
  },[currentChunk, wordCounter, setWordTranslation]);

  const changeScore = useCallback((correctAnswer, hasCombo) => {
    if (correctAnswer) {
      const multiplier = rate === 1 ? 1 : 2;
      let calculatedScore = score + (rate * multiplier * 10);

      if (hasCombo) {
        calculatedScore = calculatedScore + (rate + 1) * 10;
      }
      setScore(calculatedScore);
    }
  }, [rate, score]);

  const handleChangeSound = useCallback(() => {
    setSoundOn(!soundOn);
  }, [soundOn]);

  const changeParrots = useCallback((correctAnswer) => {
      if (correctAnswer && rate < 4) {
        setRate(rate + 1);
      }
      if (!correctAnswer && rate > 1) {
        setRate(rate - 1);
      }
    }, [rate],
  );

  const changeMark = useCallback((correctAnswer) => {
      if (correctAnswer) {
        const count = marksCombo + 1;
        setMarksCombo(count);
        if (count >= 3) {
          setTimeout(() => {
            setMarksCombo(0);
            changeParrots(true);
          }, 500);
        }
        marksCombo === 2 ? changeScore(correctAnswer, true) : changeScore(correctAnswer);
      } else {
        setMarksCombo(0);
        changeParrots(false);
      }
    }, [changeScore, changeParrots, marksCombo],
  );

  const handleClick = useCallback((correctAnswer) => () => {
    const isCorrect = (
        correctAnswer && currentChunk[wordCounter].wordTranslate === currentTranslation
      ) || (
        !correctAnswer && currentChunk[wordCounter].wordTranslate !== currentTranslation
    );

    onWordSelect(currentChunk[wordCounter], {succeed: isCorrect, failed: !isCorrect});
    changeMark(isCorrect);
    playSound(isCorrect, soundOn);

    setWordCounter(wordCounter + 1);
    if (wordCounter === currentChunk.length - 1) {
      onGameEnd();
    }
  },[onWordSelect, changeMark, soundOn, currentTranslation, currentChunk, wordCounter, onGameEnd]);

  return (
    <>
      {(onLoading || !currentChunk) ? (
        <Grid container justify="center" alignItems="center">ЗАГРУЗКА</Grid>
      ) : (
        <Grid container justify="center" alignItems="center" direction="column" className={classes.container}>
          <Grid item container justify="flex-start" className={classes.gameIcons}>
            <SoundButton onClick={handleChangeSound} isEnabled={soundOn}/>
            <FullScreenButton/>
          </Grid>
          <Grid container justify="space-between">
            <div className={classes.timerContainer}>
              <Timer cycle={60 * 1000} tic={1000}/>
            </div>

            <Grid container justify="center" alignItems="center" className={classes.scoreContainer}>
              <span>{score}</span>
            </Grid>
          </Grid>
          <Grid container justify="center" alignItems="center" className={classes.gameContainer}>
            <Grid container justify="space-between" alignItems="flex-start" direction="column" className={classes.game}>

              <Marks count={marksCombo} />
              <Parrots count={rate} />

              <Grid container justify="center" alignItems="center" direction="column"
                    className={classes.wordsContainer}>
                <Grid container justify="center" alignItems="center">
                  <p className={classes.enWord}>{currentChunk[wordCounter].word}</p>
                  {/*<SoundButton*/}
                  {/*  file={`${SETTINGS.SERVER}/${words[wordCounter].audio}`}*/}
                  {/*/>*/}
                  <button onClick={playAudio(wordCounter)} className={classes.audioButton}>
                    <NotificationsActiveIcon/>
                  </button>
                </Grid>
                <Grid container justify="center" alignItems="center">
                  <p className={classes.ruWord}>{randomTranslation}</p>
                </Grid>
              </Grid>

              <Grid container justify="space-around" alignItems="center" className={classes.buttonsContainer}>
                <Button label={"Не верно"} onClick={handleClick(false)} classes={{button: classes.buttonFalse}}>
                  <ArrowLeftIcon className={classes.buttonIcon}/>
                </Button>
                <Button label={"Верно"} onClick={handleClick(true)} classes={{button: classes.buttonTrue}}>
                  <ArrowRightIcon className={classes.buttonIcon}/>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>)}
      <audio id="correctSound" src={correctSound}/>
      <audio id="errorSound" src={errorSound}/>
    </>
  );
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
    // height: '100%',
    // position: 'relative',
  },
  gameIcons: {
    position: 'absolute',
    top: '15px',
  },
  timerContainer: {
    // display: 'flex',
    // height: '100px',
    // width: '100px',
    // position: 'relative',
    // left: '228px',
    // top: '80px',
    // marginTop: '3px',
  },
  scoreContainer: {

    "& span": {
      fontSize: '45px',
      lineHeight: '40px',
      textAlign: 'center',
      color: '#ffffff',
    },
  },
  gameContainer: {
    // height: '100%',
    // width: '100%',
  },
  game: {
    height: '450px',
    maxWidth: '595px',
    maxHeight: '972px',
    background: 'rgba(10, 217, 198, 0.15)',
    mixBlendMode: 'normal',
    borderRadius: '6px',
    marginLeft: '100px',
    padding: '10px',
  },
  // marks: {
  //   height: '100px',
  //   width: '100%',
  // },
  wordsContainer: {
    // height: '110px',
    // width: '100%',
    "& button svg": {
      zIndex: 1,
    },
  },
  enWord: {
    fontWeight: 'bold',
    fontSize: '40px',
    lineHeight: '22px',
    color: '#FFFFFF',
  },
  ruWord: {
    fontSize: '30px',
    lineHeight: '22px',
    color: '#FFFFFF',
    marginTop: '9px',
  },
  parrotsContainer: {
    position: 'relative',
  },
  hidden: {
    visibility: 'hidden',
  },
  branch: {
    position: 'absolute',
    top: '-2px',
    transform: 'rotate(29deg)',
    width: '270px',
    height: '150px',
  },
  buttonsContainer: {
    // height: '100px',
    // width: '100%'
  },
  buttonFalse: {
    backgroundColor: '#E10050',
    flexDirection: 'row-reverse',
  },
  buttonFalseTrue: {
    backgroundColor: '#0AD1BD',
  },
  buttonIcon: {
    display: 'flex',
  },
  audioButton: {
    display: 'contents',
    cursor: 'pointer',
    "& svg": {
      color: '#ffffff',
    }
  },
});

export default Sprint;


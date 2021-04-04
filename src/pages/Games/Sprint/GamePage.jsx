import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {getRandomNumber, getUserData, populateStatistics, shuffle} from '../../../helpers/gameUtils';
import {Grid, makeStyles} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux"
import snake from "../../../assets/images/snake.svg"
import classNames from "classnames";
import background from "../../../assets/images/2.jpg";
import {statisticsSelector} from "../../../redux/games/selectors";
import Lives from "../common/Lives";
import SoundButton from "../common/SoundButton";
import correctSound from "../../../assets/audio/correct.mp3";
import errorSound from "../../../assets/audio/error.mp3";
import FullScreenButton from "../common/FullScreenButton";
import {addStatisticsThunk, getStatisticsThunk} from "../../../redux/games/thunk.statistics";
import Button from "../common/Button";
import classesCss from "../PuzzleGame/PuzzleGame.module.scss";
import Timer from "../common/Timer";

const NUMBER_OF_WORDS = 20;

let targetsCombo = 0;
let activeMarks = ['empty', 'empty', 'empty'];
let activeTargets = ['empty', 'empty', 'empty'];

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));


const Sprint = (props) => {
  const {words, onLoading, onWordSelect, onGameEnd} = props;

  const dispatch = useDispatch();


  const [score, setScore] = useState(0);
  const [rate, setRate] = useState(1);
  const [marks, setMarks] = useState(['empty', 'empty', 'empty']);
  const [marksCombo, setMarksCombo] = useState(0);

  const [targets, setTargets] = useState(['empty', 'empty', 'empty']);
  const [soundOn, setSoundOn] = useState(false);
  const [wordCounter, setWordCounter] = useState(0);

  const classes = useStyles();

  const playAudio = useCallback((audio) => {
    const audioPath = 'https://raw.githubusercontent.com/'
      + 'AnnaDavydenko/rslang-data/master/';
    const pronounce = new Audio(`${audioPath}${audio}`);
    pronounce.play();
  }, []);

  const changeScore = useCallback(
    (bool) => {
      if (bool) {
        setScore(score + (rate * 10));
      }
    }, [rate, score],
  );

  const handleChangeSound = useCallback(() => {
    setSoundOn(!soundOn);
  }, [soundOn]);

  const changeTargets = useCallback(
    (bool) => {
      activeTargets = targets;
      if (bool && targetsCombo < 3) {
        activeTargets[targetsCombo] = 'hit';
        targetsCombo += 1;
        setRate(rate + 1);
      }
      if (!bool) {
        targetsCombo = 0;
        activeTargets = ['empty', 'empty', 'empty'];
        setRate(1);
      }
      setTargets([...activeTargets]);
    }, [targets, rate],
  );

  const changeMark = useCallback(
    (bool) => {
      activeMarks = [...marks];
      if (bool && marksCombo < 3) {
        activeMarks[marksCombo] = 'hit';
        setMarksCombo(marksCombo + 1);
      } else if (bool && marksCombo >= 3) {
        activeMarks = ['empty', 'empty', 'empty'];
        setMarksCombo(0);
        changeTargets(true);
      } else {
        setMarksCombo(0);
        activeMarks = ['empty', 'empty', 'empty'];
        changeTargets(false);
      }
      setMarks([...activeMarks]);
    }, [marks, changeTargets, marksCombo],
  );

  const checkAnswer = useCallback((word, answer) => {
    word.correctAnswer = (word.correctFlag === answer);
    playSound(false, soundOn);
    changeMark(word.correctAnswer);
    changeScore(word.correctAnswer);
  }, [changeMark, changeScore, soundOn]);

  const handleRightClick = useCallback(() => {
    setWordCounter(wordCounter + 1);
    checkAnswer(words[wordCounter], true);
    if (wordCounter === words.length) {
      onGameEnd();
    }
  },[]);

  const handleFalseClick = useCallback(() => {
    setWordCounter(wordCounter + 1);
    checkAnswer(words[wordCounter], false);
    if (wordCounter === words.length) {
      onGameEnd();
    }
  },[words, wordCounter]);

  return (
    <>
    <Grid container justify="center" alignItems="center" direction="column" className={classes.container}>
      <Grid container justify="space-between" alignItems="center">
        <Grid item container justify="center" className={classes.gameIcons}>
          <SoundButton onClick={handleChangeSound} isEnabled={soundOn}/>
          <FullScreenButton/>
        </Grid>
      </Grid>
      <Grid container justify="space-between">
        <div className={classes.timerContainer}>
          <Timer
            cycle={60 * 1000}
            tic={1000}
          />
        </div>

        <Grid container alignItems="center" className={classes.scoreContainer}>
          <span>{score}</span>
        </Grid>
      </Grid>
      <Grid container justify="center" className={classes.gameContainer}>
        <Grid container justify="center" alignItems="start" direction="column" className={classes.game}>

          <Grid container justify="center" alignItems="center" className={classes.marks}>
            {marks.map((type, index) => (
              <img key={index} src={`../../../assets/images/${type}_mark.svg`} alt="mark"  />
            ))}
          </Grid>

          <Grid container justify="center" alignItems="center" className={classes.marks}>
            <img src="../../../assets/images/hit_target.svg" alt="hint" />
            {targets.map((type, index) => (
              <img key={index} src={`../../../assets/images/${type}_target.svg`} />
            ))}
          </Grid>

          <Grid container justify="center" alignItems="center" direction="column" className={classes.wordsContainer}>
            <p className={classes.enWord}>{words[wordCounter].word}</p>
            <p className={classes.ruWord}>{words[wordCounter].falsyTranslate}</p>
          </Grid>

          <Grid container justify="space-between" alignItems="center" className={classes.buttonsContainer}>
            <Button label={"Не верно"}  onClick={handleFalseClick} classes={{button: classes.buttonFalse}}/>
            <Button label={"Верно"}  onClick={handleRightClick} classes={{button: classes.buttonTrue}}/>
          </Grid>

          <div className="Arrows">
            <img
              className="Left"
              src="/assets/images/sprint/left_arrow.svg"
              alt="arrow left"
            />
            <img
              className="Right"
              src="/assets/images/sprint/right_arrow.svg"
              alt="arrow right"
            />
          </div>

          <button
            className="Prononse"
            onClick={() => { playAudio(wordCounter); }}
            type="button"
          >
            <img
              className="Prononse_img"
              src="/assets/images/sprint/sound.svg"
            />
          </button>

        </Grid>
      </Grid>
    </Grid>
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
    height: '100vh',
    position: 'relative',
    width: '100vw',
  },
  timerContainer: {
    display: 'flex',
    height: '100px',
    width: '100px',
    position: 'relative',
    left: '228px',
    top: '80px',
    marginTop: '3px',
  },
  scoreContainer: {
    height: '100px',
    width: '100px',
    marginLeft: '178px',
    "& span": {
      fontSize: '45px',
      lineHeight: '40px',
      textAlign: 'center',
      color: '#ffffff',
    },
  },
  gameContainer: {
    height: '100%',
    width: '100%',
  },
  game: {
    width: '98%',
    height: '75%',
    maxWidth: '595px',
    maxHeight: '972px',
    background: 'rgba(10, 217, 198, 0.15)',
    mixBlendMode: 'normal',
    borderRadius: '6px',
    marginLeft: '100px',
    position: 'relative',
  },
  marks: {
    height: '100px',
    width: '100%',
  },
  wordsContainer: {
    height: '110px',
    width: '100%',
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
  buttonsContainer: {
    height: '100px',
    width: '100%'
  },
  buttonFalse: {
    backgroundColor: '#E10050',
  },
  buttonFalseTrue: {
    backgroundColor: '#0AD1BD',
  },

});

export default Sprint;


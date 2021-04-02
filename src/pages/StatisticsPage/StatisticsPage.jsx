import React, {useCallback, useEffect, useMemo, useState} from 'react';
import classNames from 'classnames';
import {createStyles, Grid, makeStyles} from "@material-ui/core";
import {getStatisticsThunk} from "../../redux/games/thunk.statistics";
import {useDispatch, useSelector} from "react-redux";
import {statisticsSelector} from "../../redux/games/selectors";
import StatisticsGameCard from "./StatisticsGameCard";
import CloseButton from "../Games/common/CloseButton";
import BarChart from "./BarChart";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import {getUserData} from "../../helpers/gameUtils";

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const allStatistics = useSelector(statisticsSelector);
  //console.log(allStatistics);
  const games = {
    savannah: 'savannah',
    audiocall: 'audiocall',
    puzzleGame: 'puzzleGame',
    sprint: 'sprint',
  };
  const [value, setValue] = useState(games.savannah);
  //const [activeRadioButton, seActiveRadioButton] = useState(games.savannah);

  const userId = useMemo(() => getUserData()?.id,[]);

  useEffect(() => {
    dispatch(getStatisticsThunk(userId));
  }, [dispatch, userId]);

  const statistics = useMemo(() => {
    if (allStatistics.optional.savannah.length){
      return parseStatistics(allStatistics);
    }
  },[allStatistics]);

  const GAMES = useMemo(() => {
    if (statistics) {
      const allStatistics = getByGameStatistics(statistics, false);
      const todayStatistics = getByGameStatistics(statistics, true);
      return {
        totalLearnedWords: todayStatistics.totalLearnedWords,
        rightAnswersPercentToday: todayStatistics.rightAnswersPercent,
        savannah: {
          name: "Саванна",
          todayStatistics: todayStatistics.savannah,
          allStatistics: allStatistics.savannah,
        }
      };
    }
  },[statistics]);
  // const barData = [
  //   {t: new Date(1617133113039), y: 30},
  //   {t: new Date(1617185550774), y: 25},
  //   {t: new Date(1617271239511), y: 15},
  // ];
  const barData = useMemo(() => {
    if (statistics) {
      return longTermStat(statistics);
    }
  }, [statistics]);
  //   [
  //   {t: new Date(1617133113039), y: 30},
  //   {t: new Date(1617185550774), y: 25},
  //   {t: new Date(1617271239511), y: 15},
  // ];
  // {
  //   "1617133100000": 45,
  //   "1617133200000": 75,
  // }


  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  },[]);

  return (
    <Grid container direction="column" alignItems="center" className={classes.container}>
      <Grid container justify="flex-end">
        <CloseButton/>
      </Grid>
      <h1>Статистика</h1>

      <Grid container alignItems="flex-start">
        <RadioGroup row value={value} onChange={handleChange}>
            <FormControlLabel value="end" control={<Radio value={games.savannah} classes={{ root: classes.root, checked: classes.checked}}/>} label="Саванна"/>
            <FormControlLabel value="end" control={<Radio value={games.audiocall} classes={{ root: classes.root, checked: classes.checked}}/>} label="Аудиовызов"/>
            <FormControlLabel value="end" control={<Radio value={games.puzzleGame} classes={{ root: classes.root, checked: classes.checked}}/>} label="Пазл"/>
            <FormControlLabel value="end" control={<Radio value={games.sprint} classes={{ root: classes.root, checked: classes.checked}}/>} label="Спринт"/>
        </RadioGroup>
      </Grid>


      <Grid container direction="column" justify="center" alignItems="flex-start" className={classes.dayStatistics}>
        <div>общее количество изученных слов за день: {GAMES?.totalLearnedWords}</div>
        <div>процент правильных ответов за день: {GAMES?.rightAnswersPercentToday} %</div>
      </Grid>

      <Grid container justify="center" alignItems="center" className={classes.gamesStatistics}>
        {value === games.savannah &&
          <StatisticsGameCard
            gameTitle={GAMES?.savannah.name}
            learnedWords={GAMES?.savannah.todayStatistics.wordCounter}
            rightAnswersPercent={GAMES?.savannah.todayStatistics.rightAnswersPercent}
            bestSeries={GAMES?.savannah.todayStatistics.bestSeries} />
        }
      </Grid>
      <Grid container justify="center" alignItems="center" className={classes.gamesStatistics}>
        {value === games.audiocall &&
          <StatisticsGameCard
            gameTitle={"123"}
            learnedWords={"456"}
            rightAnswersPercent={"789"}
            bestSeries={"10"} />
        }
      </Grid>
      <Grid container justify="center" alignItems="center" className={classes.gamesStatistics}>
        {value === games.puzzleGame &&
          <StatisticsGameCard
            gameTitle={GAMES?.savannah.name}
            learnedWords={GAMES?.savannah.todayStatistics.wordCounter}
            rightAnswersPercent={GAMES?.savannah.todayStatistics.rightAnswersPercent}
            bestSeries={GAMES?.savannah.todayStatistics.bestSeries} />
        }
      </Grid>
      <Grid container justify="center" alignItems="center" className={classes.gamesStatistics}>
        {value === games.sprint &&
          <StatisticsGameCard
            gameTitle={GAMES?.savannah.name}
            learnedWords={GAMES?.savannah.todayStatistics.wordCounter}
            rightAnswersPercent={GAMES?.savannah.todayStatistics.rightAnswersPercent}
            bestSeries={GAMES?.savannah.todayStatistics.bestSeries} />
        }
      </Grid>

      <Grid container direction="column" justify="center" alignItems="flex-start" className={classes.graphics}>
        {/*<span>за всё время</span>*/}
        <div>
          <BarChart data={barData} />
        </div>
      </Grid>

    </Grid>
  );
};

const parseStatistics = (allStatistics) => {
  return Object.keys(allStatistics.optional).reduce((res, key) => {
    res.optional[key] = JSON.parse(allStatistics.optional[key]);
    return res;
  }, {...allStatistics});
};

const isTodayDate = (date) => {
  const today = new Date();
  today.setHours(0,0,0,0);
  date.setHours(0,0,0,0);
  return today.toString() === date.toString();
};

const getGameStatistics = (entries, singleDay = false) => {
  const gameTotalStatistics = entries.reduce((gameResult, entry) => {
    const createdOn = new Date(entry.createdOn);

    if ((singleDay && isTodayDate(createdOn)) || !singleDay) {
      gameResult.wordCounter = gameResult.wordCounter + entry.wordCounter;
      gameResult.rightAnswers = gameResult.rightAnswers + entry.rightAnswers;
      if (gameResult.bestSeries < entry.bestSeries) {
        gameResult.bestSeries = entry.bestSeries;
      }
    }

    return gameResult;
  }, { wordCounter: 0, rightAnswers: 0, bestSeries: 0});

  gameTotalStatistics.rightAnswersPercent =
    Math.round(gameTotalStatistics.rightAnswers * 100 / gameTotalStatistics.wordCounter);

  return gameTotalStatistics;
};

const getTotalStatistics = (byGameStatistics) => {
  const totalStatistics = Object.keys(byGameStatistics).reduce((res, key) => {
    const gameStatistics = byGameStatistics[key];
    res.totalLearnedWords = res.totalLearnedWords + gameStatistics.wordCounter;
    res.rightAnswers = res.rightAnswers + gameStatistics.rightAnswers;
    return res;
  }, { totalLearnedWords: 0, rightAnswers: 0 });

  totalStatistics.rightAnswersPercent =
    Math.round(totalStatistics.rightAnswers * 100 / totalStatistics.totalLearnedWords);

  return totalStatistics;
};

const getByGameStatistics = (statistics, singleDay = false) => {
  const byGameStatistics = Object.keys(statistics.optional).reduce((res, key) => {
    // array of finished games for certain game type eg savannah.
    const gameStatisticsEntries = statistics.optional[key];
    res[key] = getGameStatistics(gameStatisticsEntries, singleDay);
    return res;
  }, {});

  const totalStatistics = getTotalStatistics(byGameStatistics);

  return { ...byGameStatistics, ...totalStatistics};
};


const longTermStat = (statistics) => {
  const zhopa = Object.keys(statistics.optional).reduce((res, key) => {
    // array of finished games for certain game type eg savannah.
    const gameStatisticsEntries = statistics.optional[key];
    gameStatisticsEntries.forEach((entry) => {
      const createdOn = new Date(entry.createdOn);
      createdOn.setHours(0,0,0,0);
      const key = createdOn.getTime();
      //если такой ключ в об есть
      if (res[key]) {
        res[key] = res[key] + entry.wordCounter;
      } else {
        res[key] = entry.wordCounter;
      }
    });
    return res;
  }, {});
  console.log(zhopa);
  return Object.keys(zhopa).map((key) => ({ t: new Date(key), y: zhopa[key] }));
};
// {'1010': 10,
//   '1010': 10,}
//

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      background: 'lightgrey',
      height: '100vh',
    },
    dayStatistics: {
      padding: '0 25px 25px',
      lineHeight: '35px',
    },
    gamesStatistics: {
      maxWidth: '1440px',
    },
    graphics: {
      padding: '25px',
      lineHeight: '35px',
    },
    root: {
      color: '#60dca8',
      '&$checked': {
        color: '#60dca8'
      }
    },
    checked: {},
  }),
);

export default StatisticsPage;

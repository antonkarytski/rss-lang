import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {createStyles, Grid, makeStyles} from "@material-ui/core";
import {getStatisticsThunk} from "../../redux/games/thunk.statistics";
import {useDispatch, useSelector} from "react-redux";
import {statisticsSelector} from "../../redux/games/selectors";
import StatisticsGameCard from "./StatisticsGameCard";
import CloseButton from "../../components/Buttons/CloseButton";
import BarChart from "./BarChart";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import {getUserData} from "../../helpers/gameUtils";
import {resetGameStatistics} from "../../redux/games/actions";

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const allStatistics = useSelector(statisticsSelector);

  const statistics = useMemo(() => {
    if (allStatistics.optional) {
      return parseStatistics(allStatistics);
    }
  },[allStatistics]);

  const TOTAL = useMemo(() => {
    const todayStatistics = statistics ? getByGameStatistics(statistics, true) : null;
    return {
      totalLearnedWords: todayStatistics?.totalLearnedWords || 0,
      rightAnswersPercentToday: todayStatistics?.rightAnswersPercent || 0,
    }
  }, [statistics]);

  const GAMES = useMemo(() => {
    const defaults = {
      bestSeries: 0,
      rightAnswers: 0,
      rightAnswersPercent: 0,
      wordCounter: 0,
    };
    const allStatistics = getByGameStatistics(statistics, false);
    const todayStatistics = getByGameStatistics(statistics, true);
    const defaultGamesData = {
      savannah: { key: "savannah", translation: "Саванна" },
      audiocall: { key: "audiocall", translation: "Аудиовызов" },
      puzzle: { key: "puzzle", translation: "Пазл" },
      sprint: { key: "sprint", translation: "Спринт" },
    };
    if (statistics) {
      Object.keys(defaultGamesData).forEach((key) => {
        defaultGamesData[key] = {
          ...defaultGamesData[key],
          todayStatistics: todayStatistics[key] || defaults,
          allStatistics: allStatistics[key] || defaults,
        };
      });
    }
    return defaultGamesData;
  }, [statistics]);

  const [value, setValue] = useState(GAMES.savannah.key);

  const userId = useMemo(() => getUserData()?.id,[]);

  useEffect(() => {
    dispatch(getStatisticsThunk(userId));
    return () => {
      dispatch(resetGameStatistics());
    }
  }, [dispatch, userId]);

  const barData = useMemo(() => {
    if (statistics) {
      return longTermStat(statistics);
    }
  }, [statistics]);

  const barDataDelta = useMemo(() => {
    if (statistics) {
      return longTermDeltaStat(statistics);
    }
  }, [statistics]);

  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  },[]);

  return (
    <Grid container alignItems="center" className={classes.container}>
      <Grid container justify="flex-end">
        <CloseButton/>
      </Grid>
      <h1 className={classes.title}>Статистика</h1>

      <Grid container alignItems="flex-start" className={classes.buttonsContainer}>
        <RadioGroup row value={value} onChange={handleChange}>
          <FormControlLabel value="end"
                            control={<Radio value={GAMES.savannah.key}
                                            classes={{root: classes.root, checked: classes.checked}}/>}
                            label="Саванна"/>
          <FormControlLabel value="end"
                            control={<Radio value={GAMES.audiocall.key}
                                            classes={{root: classes.root, checked: classes.checked}}/>}
                            label="Аудиовызов"/>
          <FormControlLabel value="end"
                            control={<Radio value={GAMES.puzzle.key}
                                            classes={{root: classes.root, checked: classes.checked}}/>}
                            label="Пазл"/>
          <FormControlLabel value="end"
                            control={<Radio value={GAMES.sprint.key}
                                            classes={{root: classes.root, checked: classes.checked}}/>}
                            label="Спринт"/>
        </RadioGroup>
      </Grid>

      <Grid container justify="center" alignItems="center" className={classes.gamesStatistics}>
        {Object.keys(GAMES || {}).map((key) => {
          const gameStatistics = GAMES[key];
          return key === value ? (
            <StatisticsGameCard
              key={key}
              gameTitle={gameStatistics.name}
              learnedWords={gameStatistics.todayStatistics.wordCounter}
              rightAnswersPercent={gameStatistics.todayStatistics.rightAnswersPercent}
              bestSeries={gameStatistics.todayStatistics.bestSeries}
            />
          ) : null;
        })}
      </Grid>

      <Grid container justify="space-between" alignItems="flex-start" className={classes.dayStatistics}>
        <div>Общее количество изученных слов за день: <span>{TOTAL?.totalLearnedWords}</span></div>
        <div>Процент правильных ответов за день: <span>{TOTAL?.rightAnswersPercentToday} %</span></div>
      </Grid>

      <Grid container justify="space-around" className={classes.graphics}>
        <div>
          <BarChart data={barData}/>
        </div>
        <div>
          <BarChart data={barDataDelta}/>
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
      gameResult.wrongAnswers = gameResult.wrongAnswers + entry.wrongAnswers;
      if (gameResult.bestSeries < entry.bestSeries) {
        gameResult.bestSeries = entry.bestSeries;
      }
    }

    return gameResult;
  }, { wordCounter: 0, rightAnswers: 0, wrongAnswers: 0, bestSeries: 0});

  gameTotalStatistics.rightAnswersPercent =
    Math.round(gameTotalStatistics.rightAnswers ? (gameTotalStatistics.rightAnswers * 100 / (gameTotalStatistics.rightAnswers + gameTotalStatistics.wrongAnswers)) : 0);
  return gameTotalStatistics;
};

const getTotalStatistics = (byGameStatistics) => {
  const totalStatistics = Object.keys(byGameStatistics).reduce((res, key) => {
    const gameStatistics = byGameStatistics[key];
    res.totalLearnedWords = res.totalLearnedWords + gameStatistics.wordCounter;
    res.rightAnswers = res.rightAnswers + gameStatistics.rightAnswers;
    res.wrongAnswers = res.wrongAnswers + gameStatistics.wrongAnswers;
    return res;
  }, { totalLearnedWords: 0, wrongAnswers: 0, rightAnswers: 0 });

  totalStatistics.rightAnswersPercent =
    Math.round(totalStatistics.rightAnswers * 100 / (totalStatistics.wrongAnswers + totalStatistics.rightAnswers));

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

const getLongTermStatObj = (statistics) => {
  return Object.keys(statistics.optional).reduce((res, key) => {
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
};

const longTermStat = (statistics) => {
  const longTermStatObj = getLongTermStatObj(statistics);
  return Object.keys(longTermStatObj).map((key) => ({ t: new Date(+key), y: longTermStatObj[key] }));
};

const longTermDeltaStat = (statistics) => {
  const longTermStatObj = getLongTermStatObj(statistics);
  const values = Object.values(longTermStatObj);
  const keys = Object.keys(longTermStatObj);
  const deltaValuesArr = Object.values(longTermStatObj).map((item, index) => {
    return index ? (item - values[index-1]) : item;
  });
  return deltaValuesArr.map((item, index) => ({t: new Date(+keys[index]) , y: item }));
};

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      background: '#47d47f',
      padding: '25px',
      //height: '100vh',
    },
    title: {
      color: '#ffffff',
    },
    buttonsContainer: {
      color: '#ffffff',
      marginBottom: '25px',
    },
    dayStatistics: {
      color: '#ffffff',
      marginBottom: '25px',
      "& span": {
        fontSize: '20px',
        color: '#567df4',
      },
    },
    gamesStatistics: {
    },
    graphics: {
      lineHeight: '35px',
    },
    root: {
      color: '#f38c71',
      '&$checked': {
        color: '#e45731'
      }
    },
    checked: {},
  }),
);

export default StatisticsPage;

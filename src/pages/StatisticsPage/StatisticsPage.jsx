import React, {useCallback, useEffect, useMemo} from 'react';
import classNames from 'classnames';
import {createStyles, Grid, makeStyles} from "@material-ui/core";
import {getStatisticsThunk} from "../../redux/games/thunk.statistics";
import {useDispatch, useSelector} from "react-redux";
import {statisticsSelector} from "../../redux/games/selectors";
import StatisticsGameCard from "./StatisticsGameCard";
import CloseButton from "../Games/common/CloseButton";

const StatisticsPage = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const allStatistics = useSelector(statisticsSelector);
  //console.log(allStatistics);

  const userId = useMemo(() => {
    return JSON.parse(localStorage.getItem("userData")).id
  },[]);

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
        savannah: {
          name: "Саванна",
          todayStatistics: todayStatistics.savannah,
          allStatistics: allStatistics.savannah,
        }
      };
    }
  },[statistics]);

  return (
    <Grid container direction="column" alignItems="center" className={classes.container}>
      <Grid container justify="flex-end">
        <CloseButton/>
      </Grid>
      <h1>Статистика</h1>
      <Grid container justify="center" alignItems="center">


        <StatisticsGameCard
            gameTitle={GAMES?.savannah.name}
            learnedWords={GAMES?.savannah.todayStatistics.wordCounter}
            rightAnswersPercent={GAMES?.savannah.todayStatistics.rightAnswersPercent}
            bestSeries={GAMES?.savannah.todayStatistics.bestSeries} />



        {/*кол-во показов карточек*/}
        {/*<div>общее количество изученных слов: {}</div>*/}
        {/*<div>процент правильных ответов за день: {}</div>*/}


      </Grid>
      <Grid container direction="column" justify="center" alignItems="center">
        {/*<span>за всё время</span>*/}

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
  //статистика общая за всё время по каждой игре
  const byGameStatistics = Object.keys(statistics.optional).reduce((res, key) => {
    // array of finished games for certan game type eg savannah.
    const gameStatisticsEntries = statistics.optional[key];
    res[key] = getGameStatistics(gameStatisticsEntries, singleDay);
    return res;
  }, {});

  const totalStatistics = getTotalStatistics(byGameStatistics);

  return { ...byGameStatistics, ...totalStatistics};
};

// GAME_TITLES
const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      background: 'lightgrey',
      height: '100vh',
    },
  }),
);

export default StatisticsPage;

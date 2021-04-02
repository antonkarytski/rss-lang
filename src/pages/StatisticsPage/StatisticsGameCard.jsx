import React from 'react';
import {createStyles, makeStyles} from "@material-ui/core";

const StatisticsGameCard = (props) => {
  const { learnedWords, rightAnswersPercent, bestSeries, gameTitle } = props;
  const classes = useStyles();

  return (
    <table className={classes.container}>
      <thead>
      <tr>
        <th className={classes.title}>{gameTitle}</th>
      </tr>
      </thead>

      <tbody>
      <tr className={classes.line}>
        <td>Количество изученных слов:</td>
        <td>{learnedWords}</td>
      </tr>

      <tr className={classes.line}>
        <td>Процент правильных ответов:</td>
        <td>{rightAnswersPercent}%</td>
      </tr>

      <tr className={classes.line}>
        <td>Лучшая серия:</td>
        <td>{bestSeries}</td>
      </tr>
      </tbody>

    </table>
  );
};
const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      width: '330px',
      transition: 'all linear 1s',
      padding: '15px',
      margin: '15px',
      borderRadius: '5px',
      backgroundColor: '#a9d0b6a3',
      border: '1px solid #00a0983b',
    },
    title: {
      color: '#e45731',
      fontSize: '18px',
      lineHeight: '30px',
    },
    line: {
      lineHeight: '25px',
    },
  }),
);
export default StatisticsGameCard;

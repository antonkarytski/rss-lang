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
      width: '350px',
      transition: 'all linear 1s',
      backgroundColor: '#89eab0',
      padding: '30px',
      boxShadow: '0 1px 2px 0 rgb(0 0 0 / 25%), 0 2px 4px 1px rgb(0 0 0 / 20%), 0 4px 8px 2px rgb(0 0 0 / 15%), 0 8px 16px 4px rgb(0 0 0 / 10%)',
      borderRadius: '40px',
      marginBottom: '25px',
    },
    title: {
      color: '#e45731',
      fontSize: '18px',
      lineHeight: '30px',
    },
    line: {
      lineHeight: '25px',
      color: '#666666',
      "& td:last-child": {
        fontSize: '20px',
        color: '#567df4',
      }
    },
  }),
);
export default StatisticsGameCard;

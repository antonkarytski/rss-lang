import React, {useCallback} from 'react';
import classNames from 'classnames';
import {createStyles, Grid, makeStyles} from "@material-ui/core";

const StatisticsPage = (props) => {
  const {} = props;
  const classes = useStyles();


  return (
    <Grid container direction="column" justify="center" alignItems="center" className={classes.container}>

      <Grid container direction="column" justify="center" alignItems="center">
        <span>за день</span>
        <span>Savannah</span>
        {/*кол-во кликов по словам*/}
        <div>количество изученных слов: {}</div>
        {/*кол-во кликов / кол-во верных ответов*/}
        <div>процент правильных ответов: {}</div>
        {/*кол-во правильных ответов до 1 ошибки*/}
        <div>лучшая серия: {}</div>

        {/*кол-во кликов по карточкам карточек*/}
        <div>общее количество изученных слов: {}</div>
        <div>процент правильных ответов за день: {}</div>


      </Grid>
      <Grid container direction="column" justify="center" alignItems="center">
        <span>за всё время</span>

      </Grid>

    </Grid>
  );
};
const useStyles = makeStyles((theme) =>
  createStyles({
    container: {

    },
  }),
);
export default StatisticsPage;

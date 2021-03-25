import React, {useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core";
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

const MAX_LIVES_COUNT = 5;

const Lives = (props) => {
    const { livesCount, gameOver} = props;
    const classes = useStyles();

    useEffect(() => {
        if (livesCount <= 0) {
            gameOver();
        }
    }, [gameOver, livesCount]);

    return (
        <Grid container justify="center" alignItems="center" className={classes.container}>
            {(new Array(livesCount).fill(1)).map((item, index) => {
               return <FavoriteIcon key={`active-${index}`}/>
            })}
            {(new Array(MAX_LIVES_COUNT - livesCount).fill(1)).map((item, index) => {
               return <FavoriteBorderIcon key={`inactive-${index}`}/>
            })}
        </Grid>
    );
};
const useStyles = makeStyles({
    container: {
        width: '135px',
        "& svg": {
            color: '#e45731',
        }
    },
});
export default Lives;

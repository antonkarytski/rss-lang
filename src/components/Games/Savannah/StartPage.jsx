import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import {setStatusGame} from '../../../redux/savannah/actions';
import {makeStyles} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import {Grid} from "@material-ui/core";

const StartPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleStart = useCallback(() => {
        dispatch(setStatusGame(true));
        history.push("/games/savannah/game");
    }, [dispatch, history]);

    return (
        <div className={classes.container}>
            <Grid container justify="flex-end" >
                <Link to="/">
                    <CloseIcon/>
                </Link>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="center" >
                <h2 className={classes.title}>Саванна</h2>
                <div className={classes.description}>
                    Тренировка Саванна развивает словарный запас. Выбирайте правильный
                    перевод слова из предложенных.
                </div>
                    <button onClick={handleStart}>
                        Начать
                    </button>
            </Grid>
        </div>
    );
};
const useStyles = makeStyles({
    container: {
        height: '100vh',
        backgroundColor: '#f6f6f6',
    },
    centerContainer: {

    },
    title: {

    },
    description: {

    },

});
export default StartPage;

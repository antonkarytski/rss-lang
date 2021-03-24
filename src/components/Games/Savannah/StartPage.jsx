import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import {setStatusGame} from '../../../redux/savannah/actions';
import {makeStyles} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import {Grid} from "@material-ui/core";
import background from "../../../assets/images/startSavannah.jpg";
import StartModal from "../common/StartModal";

const StartPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleStart = useCallback(() => {
        dispatch(setStatusGame(true));
        history.push("/games/savannah/game");
    }, [dispatch, history]);

    return (
        <>
            <img src={background} alt="savannah background" className={classes.backgroundImg}/>
            <Grid container direction="column" justify="center" alignItems="center" className={classes.container}>
                <Grid container justify="flex-end" className={classes.exitContainer}>
                    <Link to="/">
                        <CloseIcon/>
                    </Link>
                </Grid>
                <StartModal title="Саванна"
                            description="Тренировка Саванна развивает словарный запас. Выбирайте правильный
                        перевод слова из предложенных."
                            classes={{container: classes.container}}
                            handleStart={handleStart}
                            label="Начать">
                </StartModal>
            </Grid>
        </>
    );
};
const useStyles = makeStyles({
    container: {
        height: '100vh',
        position: 'relative',
    },
    exitContainer: {
        position: 'absolute',
        padding: '1rem',
        zIndex: 1,
        top: 0,
        "& a": {
          "& svg": {
            color: '#ffffff',
            fontSize: '35px',
          },
            "&:active": {
              transition: 'all .5 easy',
                "& svg": {
                    color: '#e0eed4',
                },
            },
        },
    },
    backgroundImg: {
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
    },
});
export default StartPage;

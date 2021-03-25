import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {setStatusGame} from '../../../redux/savannah/actions';
import {makeStyles} from "@material-ui/core";
import {Grid} from "@material-ui/core";
import background from "../../../assets/images/startSavannah.jpg";
import StartModal from "../common/StartModal";
import CloseButton from "../common/CloseButton";

const StartPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const handleStart = useCallback(() => {
        dispatch(setStatusGame(true));
    }, [dispatch]);

    return (
        <>
            <img src={background} alt="savannah background" className={classes.backgroundImg}/>
            <Grid container direction="column" justify="center" alignItems="center" className={classes.container}>
                <Grid container justify="flex-end" className={classes.exitContainer}>
                    <CloseButton/>
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
    },
    backgroundImg: {
        position: 'absolute',
        width: '100vw',
        height: '100vh',
        objectFit: 'cover',
    },
});
export default StartPage;

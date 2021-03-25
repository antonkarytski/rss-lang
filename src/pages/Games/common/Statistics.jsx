import React, {useCallback} from 'react';
import classNames from 'classnames';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core/styles';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import { useHistory} from 'react-router-dom';
import {setStatusGame} from "../../../redux/savannah/actions";
import {useDispatch} from "react-redux";
import Button from "./Button";

const Statistics = (props) => {
    const {statisticsArr, rightAnswers, wrongAnswers, toNewGame} = props;
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const playAudio = useCallback((audio) => {
        const audioPath = 'https://raw.githubusercontent.com/'
            + 'AnnaDavydenko/rslang-data/master/';
        const pronounce = new Audio(`${audioPath}${audio}`);
        pronounce.play();
    },[]);

    const handleGamesPage = useCallback(() => {
        dispatch(setStatusGame(false));
        history.push("/games");
    },[dispatch, history]);

    return (
        <Grid container direction="column" justify="center" alignItems="center" className={classes.container}>
            <Grid container justify="center" alignItems="center" className={classes.totalStat}>
                <Grid container justify="center" alignItems="center" item xs={6} className={classes.rightAnswers}>
                    <ThumbUpIcon/>
                    <span className={classes.results}>{`${rightAnswers}`}</span>
                </Grid>
                <Grid container justify="center" alignItems="center" item xs={6} className={classes.wrongAnswers}>
                    <ThumbDownIcon/>
                    <span className={classes.results}>{`${wrongAnswers}`}</span>
                </Grid>
            </Grid>


            <table className={classes.scroll}>
                <thead className={classes.tableHeader}>
                <tr>
                    <th>Произношение</th>
                    <th>Слово</th>
                    <th>Транскрипция</th>
                    <th>Перевод</th>
                </tr>
                </thead>
                <tbody className={classes.tableBody}>
                {statisticsArr.map(({id, audio, word, transcription, translation, isCorrect, }) => {
                    return (
                        <tr key={`${id}/${transcription}/${isCorrect}`}
                            className={classNames({
                            [classes.learnedWord]: isCorrect,
                        })}>
                            <td>
                                <button onClick={() => playAudio(audio)} className={classes.audioButton}>
                                    <NotificationsActiveIcon/>
                                </button>
                            </td>
                            <td>{word}</td>
                            <td>{transcription}</td>
                            <td>{translation}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>


            <Grid container justify="space-between" alignItems="center" className={classes.buttonsContainer}>
                <Button onClick={handleGamesPage} label={"К списку игр"} classes={{button: classes.button}}/>
                <Button onClick={toNewGame} label={"Новая игра"} classes={{button: classes.button}}/>
            </Grid>

        </Grid>
    );
};
const useStyles = makeStyles({
    container: {
        width: '100%',
        height: '100%',
    },
    totalStat: {
        marginBottom: '10px',
    },
    rightAnswers: {
        "& svg": {
            color: '#60dca8',
        }
    },
    wrongAnswers: {
        "& svg": {
            color: '#e45731',
        }
    },
    results: {
        fontSize: '30px',
        lineHeight: '50px',
        textAlign: 'center',
        paddingLeft: '10px',
    },
    tableBody: {
        margin: '0 auto',
        display: 'flex',
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: '10px',
    },
    learnedWord: {
        color: '#83ffcb',
    },
tableHeader: {
    fontSize: '18px',
    "& tr": {
        display: 'flex',
        justifyContent: 'space-around',
    },
},
scroll: {
    height: '60%',
    width: '80%',
    border: '1px solid #e4573126',
    backgroundColor: '#4a241a70',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    borderRadius: '5px',
    padding: '10px',
    color: '#ffffff',
    '& tbody': {
        display: 'block',
        height: '100%',
        overflowY: 'scroll',
    },
    '& tbody::-webkit-scrollbar': {
        width: '3px',
    },
    '& thead, tbody tr': {
        display: 'table',
        width: '100%',
        tableLayout: 'fixed',
    },
    '& tbody tr': {
        height: '3.2rem',
    },
    '& tbody::-webkit-scrollbar-track': {
        boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
        borderRadius: '10px',
    },
    '& tbody::-webkit-scrollbar-thumb': {
        borderRadius: '10px',
        background: '#ffffff',
        boxShadow: 'inset 0 0 6px #ffffff',
    },
},
    audioButton: {
        display: 'contents',
        cursor: 'pointer',
        "& svg": {
            color: '#ffffff',
        }
    },
    buttonsContainer: {
        width: '80%',
    },
    button: {
        backgroundColor: '#e45731',
        "&:hover": {
            backgroundColor: '#e67353',
        },
    },


});
export default Statistics;

import React, { useCallback } from 'react';
import classNames from 'classnames';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core";

const LEVELS_NUMBER = 6;

let levels = new Array(LEVELS_NUMBER).fill(' ').map((lvl, index) => index + 1);

const Levels = (props) => {
    const { changeActiveLevel, currentLevel } = props;
    const classes = useStyles();

    const handleClick = useCallback((index) => () => {
        changeActiveLevel(index);
    }, [changeActiveLevel]);

    return (
        <Grid container justify="center" alignItems="center">
            <Grid container justify="center" alignItems="center" className={classes.container}>
                <span className={classes.header}>Уровень</span>
                <Grid container justify="center" alignItems="center" className={classes.buttonsContainer}>
                    {
                        levels.map((level, index) => (
                            <button
                                key={level}
                                onClick={handleClick(index + 1)}
                                className={classNames({
                                    [classes.levelButton]: true,
                                    [classes.activeLevel]: currentLevel === level,
                                })}
                            >
                                <span>{level}</span>
                            </button>
                        ))
                    }
                </Grid>
            </Grid>
        </Grid>
    );
};
const useStyles = makeStyles({
    container: {
        width: 'max-content',
        background: '#e5e7fa',
        borderRadius: '5px',
    },
    header: {
        margin: '0px 0px 0px 10px',
        fontSize: '16px',
        lineHeight: '13px',
        color: '#6979F8',
    },
    buttonsContainer: {
        paddingInlineStart: '10px',
        margin: '10px 0px 10px 0',
    },
    levelButton: {
        // display: flex,
        // justifyContent: center,
        // alignItems: center,
        listStyle: 'none',
        marginRight: '10px',
        background: '#6979f8',
        width: '29px',
        height: '30px',
        borderRadius: '50%',
        border: '3px solid white',
        "& span": {
            margin: 0,
            fontSize: '12px',
            lineHeight: '14px',
            color: '#ffffff',
        },
        "&:hover": {
            cursor: 'pointer',
            background: '#4FC8AB',
        },
    },
    activeLevel: {
        background: '#4FC8AB',
    },
});
export default Levels;

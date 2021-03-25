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
        <Grid container justify="center" alignItems="center" className={classes.container}>
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
    );
};
const useStyles = makeStyles({
    container: {
        width: '245px',
    },
    header: {
        margin: '0px 0px 0px 10px',
        fontSize: '16px',
        lineHeight: '13px',
        color: '#b1d2c4',
    },
    buttonsContainer: {
        // margin: '10px 0px 10px 0',
    },
    levelButton: {
        listStyle: 'none',
        marginRight: '10px',
        background: '#b1d2c4',
        width: '29px',
        height: '30px',
        borderRadius: '30%',
        border: '3px solid white',
        outline: 'none',
        "& span": {
            margin: 0,
            fontSize: '12px',
            lineHeight: '14px',
            color: '#ffffff',
        },
        "&:hover": {
            cursor: 'pointer',
            background: '#60dca8',
        },
    },
    activeLevel: {
        background: '#60dca8',
    },
});
export default Levels;

import React, {useState, useCallback} from 'react';
import {makeStyles} from "@material-ui/core";
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const FullScreenButton = () => {
    const classes = useStyles();
    const [fullScreenEnabled, setFullScreenEnabled] = useState(false);

    const handleFullScreen = useCallback(() => {
        if (fullScreenEnabled) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
        setFullScreenEnabled(!fullScreenEnabled);
    }, [fullScreenEnabled]);

    return (
        <button
            className={classes.fullScreenBtn}
            onClick={handleFullScreen}
            type="button"
        >
            <FullscreenIcon className={classes.icon}/>
        </button>
    )
};
const useStyles = makeStyles({
    fullScreenBtn: {
        background: 'transparent',
        border: 0,
        outline: 'none',
        cursor: 'pointer',
        listStyle: 'none',
        transition: 'all 0.5s ease-out',
        "&:active": {
            transform: 'scale(0.8)',
            "& svg": {
                color: '#60dca8',
            },
        },
        "&:hover": {
            "& svg": {
                transition: 'all 0.5s ease-out',
                color: '#e0eed4',
            },
        },
    },
    icon: {
        color: '#ffffff',
        fontSize: '35px',
    },

});
export default FullScreenButton;

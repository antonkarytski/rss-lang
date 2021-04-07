import React from 'react';
import {makeStyles} from "@material-ui/core";
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';

const SoundButton = (props) => {
    const {onClick, isEnabled} = props;
    const classes = useStyles();

    return (
        <>
            <button onClick={onClick} className={classes.button}>
                {isEnabled && <NotificationsActiveIcon className={classes.icon}/>}
                {!isEnabled && <NotificationsOffIcon className={classes.icon}/>}
            </button>
        </>
    )
};
const useStyles = makeStyles({
    button: {
        background: 'transparent',
        border: 0,
        outline: 'none',
        cursor: 'pointer',
        listStyle: 'none',
        transition: 'all 0.5s ease-out',
        "&:active": {
            transform: 'scale(0.8)',
        },
    },
    icon: {
        color: '#ffffff',
        fontSize: '35px',
    },
});
export default SoundButton;

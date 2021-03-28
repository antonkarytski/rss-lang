import React from 'react';
import {makeStyles} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import {Link} from "react-router-dom";

const CloseButton = () => {
    const classes = useStyles();
    return (
        <Link to="/" className={classes.container}> <CloseIcon className={classes.icon}/> </Link>
    );
};
const useStyles = makeStyles({
    container: {
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
export default CloseButton;

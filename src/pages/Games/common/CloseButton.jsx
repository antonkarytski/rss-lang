import React from 'react';
import {makeStyles} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import {Link} from "react-router-dom";

const CloseButton = () => {
    const classes = useStyles();
    return (
        <Link to="/" className={classes.container}> <CloseIcon/> </Link>
    );
};
const useStyles = makeStyles({
    container: {
        "& svg": {
            color: '#ffffff',
            fontSize: '35px',
        },
        "&:active": {
            transition: 'all .5 easy',
            "& svg": {
                color: '#60dca8',
            },
        },
        "&:hover": {
            transition: 'all .5 easy',
            "& svg": {
                color: '#e0eed4',
            },
        },
    },
});
export default CloseButton;

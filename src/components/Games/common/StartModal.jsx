import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core/styles';


const StartModal = (props) => {
    const {children, title, description, classes, label, handleStart} = props;
    const innerClasses = useStyles();
    return (
        <Grid container direction="column" justify="center" alignItems="center"
              className={classNames(innerClasses.modalContainer, classes.container)}>
                <h2 className={innerClasses.modalTitle}>{title}</h2>
                <h3 className={innerClasses.modalDescription}>{description}</h3>
                <button onClick={handleStart} className={innerClasses.button}>
                    {label}
                </button>
                <div>{children}</div>
        </Grid>
    );
};
const useStyles = makeStyles({
    modalContainer: {
        maxWidth: '600px',
        maxHeight: '300px',
        margin: '0 auto',
        transition: 'all linear 1s',
        padding: '15px',
        borderRadius: '5px',
        backgroundColor: '#a9d0b6a3',
        border: '1px solid #00a0983b',
    },
    modalTitle: {
        fontSize: '50px',
        lineHeight: '40px',
        color: '#f5fdfb',
    },
    modalDescription: {
        color: '#f5fdfb',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '150px',
        height: '40px',
        fontSize: '16px',
        fontWeight: '700',
        color: '#ffffff',
        backgroundColor: '#00a098',
        border: 'none',
        borderRadius: '5px',
        outline: 'none',
        transition: 'all .8s easy',
        marginTop: '20px',
        cursor: 'pointer',
        "&:hover": {
            backgroundColor: '#45ae8a',
            transition: 'all .8s easy',
        },
    }
});
export default StartModal;

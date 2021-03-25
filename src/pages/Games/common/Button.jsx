import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import classNames from "classnames";

const Button = (props) => {
    const {label, onClick, classes} = props;
    const innerClasses = useStyles();

    return (
        <button onClick={onClick} className={classNames(innerClasses.button, classes.button)}>
            {label}
        </button>
    );
};
const useStyles = makeStyles({
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
export default Button;

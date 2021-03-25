import React from 'react';
import { useSelector } from 'react-redux';
import GamePage from './GamePage';
import StartPage from './StartPage';
import { statusGameSelector } from '../../../redux/savannah/selectors';

function Savannah() {
    const statusGame = useSelector(statusGameSelector);

    return (
        <div>
            {statusGame ? (<GamePage />) : (<StartPage />)}
        </div>
    );
}

export default Savannah;

import React, { useState, useEffect } from 'react';

const Timer = (props) => {
  const { isActive, onCountdownFinish, initialTime } = props;
  const [value, setValue] = useState(initialTime);

  useEffect(() => {
    const timerID = setTimeout(() => {
      if (value > 0 && isActive) {
        setValue(value - 1);
      }
    }, 1000);
    return () => clearTimeout(timerID);
  }, [value, isActive]);

  useEffect(() => {
    if (value <= 0) {
      onCountdownFinish();
    }
  }, [onCountdownFinish, value]);

  return (
    <>
      {value}
    </>
  );
};

export default Timer;



import React, { useEffect, useMemo } from "react"
import { useTimerGenerator } from "../../../hooks/hooks.game";

export default function Timer(props){
  const {
    onGenerate,
    onWillGenerate,
    onCountdownFinish,
    onTic,
    cycle,
    tic,
    reset,
    pause,
    softReset,
    className
  } = props
  const timer = useTimerGenerator(
    {
      onGenerate,
      onTic,
      onWillGenerate,
      onReset: reset,
      onPause: pause,
      onSoftReset: softReset
    }, cycle, tic)

  const timeToNextGen = useMemo(() => {
    return timer.getTimeToNextGen() >= 0 ? timer.getTimeToNextGen() / 1000 : 0
  }, [timer])

  useEffect(() => {
    if(reset) timer.reset()
    if(pause) timer.pause()
    if(softReset) timer.softReset()
  }, [timer, reset, pause, softReset])

  useEffect(() => {
    if (timeToNextGen === 0 && onCountdownFinish) {
      onCountdownFinish()
    }
  }, [timeToNextGen, onCountdownFinish])


  return (
    <div className={className}>
      {timeToNextGen}
    </div>
  )
}
import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useSelector } from "react-redux";
import { useUserWordUpdate } from "../../hooks/hooks.user";
import { useWords, useWordsGroup } from "../../hooks/hooks.words";
import { createRandomChunkFromGroup } from "../../helpers/utils.words";
import LevelButtons from "./common/Levels/LevelButtons";
import GameModal from "./common/GameModal/GameModal";
import StatisticModal from "./common/StatisticModal/StatisticModal";
import classesCss from "./Games.module.scss"
import levelClasses from "../styles/Styles.module.scss"
import { SETTINGS } from "../../settings";
import BookLink from "../../components/Navigation/BookLink";
import ResetButton from "../../components/Buttons/ResetButton";
import cx from "classnames"
import BackToGameLink from "./common/BackToGameLink";
import CloseButton from "../../components/Buttons/CloseButton";
import { useStatistic } from "../../hooks/hooks.statistic";


const initialStatistic = {
  rightAnswers: 0,
  wrongAnswers: 0,
  wordCounter: 0,
  bestSeries: 0
}

export default function GameShell(props){
  const {
    children,
    gameData,
    className,
    style,
    randomLengthStack = SETTINGS.DEFAULT_WORD_CHUNK_LENGTH,
  } = props

  const {currentWordsGroup, getWordsGroup, onGroupLoading} = useWordsGroup()
  const {currentWords, getWordsChunk, onLoading} = useWords()
  const {update: updateUserWord} = useUserWordUpdate()
  const {update: updateStatistic} = useStatistic()

  const {isLogged} = useSelector(state => state.user)

  const [currentChunk, setCurrentChunk] = useState(null)
  const [isGameEnd, setGameEnd] = useState(false)
  const [gameResetKey, setGameResetKey] = useState(Math.random())
  const [statisticChunk, setStatisticChunk] = useState(null)
  const [statistic, setStatistic] = useState(initialStatistic)
  const [statisticWasUpdate, setStatisticWasUpdate] = useState(false)
  const [currentSeries, setCurrentSeries] = useState(0)

  const {state} = useLocation()
  const {group: urlGroup, page: urlPage} = state ? state : {}

  function checkGroup(group){
    if (group < SETTINGS.GROUPS_COUNT) return group
    return 0
  }

  function checkPage(page){
    if (page < SETTINGS.PAGES_COUNT) return page
    return 0
  }

  function levelSelectHandler(index){
    getWordsGroup(index)
  }

  function gameEndHandler(){
    setGameEnd(true)
  }

  function setGameStartAgain(){
    setGameResetKey(state => state + 1)
    setCurrentSeries(0)
    setStatisticChunk([...currentChunk])
    setStatistic(initialStatistic)
    setStatisticWasUpdate(false)
    setGameEnd(false)
  }

  function updateStatisticChunk(wordForUpdate, dataForUpdate){
    const statisticWordIndex = statisticChunk.findIndex(statWord => statWord.id === wordForUpdate.id)
    if (statisticWordIndex + 1) {
      setStatisticChunk(currentStatistic => {
        const newStatisticChunk = [...currentStatistic]
        newStatisticChunk[statisticWordIndex] = {...newStatisticChunk[statisticWordIndex], ...dataForUpdate}
        return newStatisticChunk
      })
      return true
    }
    return false
  }

  function wordSelectHandler(word, params){
    const paramsForUpdate = {succeed: !!params.succeed}

    if (isLogged) {
      updateUserWord(word, paramsForUpdate).then(updatedWord => {
        if (updatedWord.optional.failCounter + updatedWord.optional.successCounter === 1) {
          setStatistic(state => ({...state, wordCounter: state.wordCounter + 1}))
        }
        updateStatisticChunk(word, {userNewResults: updatedWord})
      }).catch(() => {
        updateStatisticChunk(word, {userNewResults: {}})
      })
      const statisticForUpdate = {}
      if (paramsForUpdate.succeed) {
        statisticForUpdate.rightAnswers = statistic.rightAnswers + 1
        if (currentSeries + 1 > statistic.bestSeries) {
          statisticForUpdate.bestSeries = currentSeries + 1
        }
        setCurrentSeries(currentSeries + 1)
      } else {
        if (currentSeries) {
          setCurrentSeries(0)
        }
        statisticForUpdate.wrongAnswers = statistic.wrongAnswers + 1
      }
      setStatistic({...statistic, ...statisticForUpdate})
    }
    updateStatisticChunk(word, {result: paramsForUpdate})

  }

  useEffect(() => {
    if (urlGroup) {
      if (urlPage) getWordsChunk(checkGroup(urlGroup), checkPage(urlPage))
      else getWordsGroup(checkGroup(urlGroup))
    }
  }, [urlGroup, urlPage, getWordsGroup, getWordsChunk])

  useEffect(() => {
    if (currentWordsGroup) {
      setCurrentChunk(createRandomChunkFromGroup(currentWordsGroup, randomLengthStack))
    }
  }, [currentWordsGroup, randomLengthStack])

  useEffect(() => {
    if (currentWords?.length) setCurrentChunk(currentWords)
  }, [currentWords])

  useEffect(() => {
    if (currentChunk?.length) {
      setStatisticChunk([...currentChunk])
    }
  }, [currentChunk])

  useEffect(() => {
    if(isLogged && isGameEnd
      && !statisticWasUpdate
      && statisticChunk?.length
      && statisticChunk[statisticChunk.length - 1].userNewResults){
      updateStatistic(gameData.key, statistic)
      setStatisticWasUpdate(true)
    }
  }, [isGameEnd, statisticChunk, isLogged, statisticWasUpdate, updateStatistic, gameData?.key, statistic])


  function getGameWithData(){
    const onAnyLoading = onGroupLoading || onLoading
    if (!isGameEnd && ((children && onAnyLoading)
      || (children && !onAnyLoading && currentChunk?.length))) {
      const wordsProps = {
        words: currentChunk,
        onLoading: onGroupLoading || onLoading,
        onWordSelect: wordSelectHandler,
        onGameEnd: gameEndHandler,
        key: gameResetKey,
      }
      return React.Children.map(children,
        child => {
          return (
            <child.type
              {...child.props}
              {...wordsProps}
            >
              {children}
            </child.type>)
        })
    }
    return null
  }

  const gameContent = getGameWithData()

  return (
    <div className={[className, classesCss.GameShell].join(" ")} style={style}>
      {
        (() => {
          if (!isGameEnd) {
            if (gameContent) return gameContent
            return (
              <GameModal
                gameData={gameData}
              >
                <LevelButtons
                  levelNumbers={6}
                  levelStyles={levelClasses}
                  onSelect={levelSelectHandler}
                />
              </GameModal>)
          }
          return (
            <>
              <StatisticModal
                className={classesCss.StatisticModal}
                words={statisticChunk}
              />
              <div className={classesCss.GameEndHelper}>
                <ResetButton
                  className={cx(classesCss.ResetButton, classesCss.Button)}
                  onClick={setGameStartAgain}/>
                <BookLink
                  className={cx(classesCss.BookLink, classesCss.Button)}
                />
                <BackToGameLink
                  className={cx(classesCss.BackLink, classesCss.Button)}
                  classes={{icon: classesCss.Icon}}
                  group={urlGroup}
                  page={urlPage}/>
              </div>
            </>
          )
        })()
      }
      <CloseButton/>
    </div>
  )
}
;
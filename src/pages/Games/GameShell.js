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

export default function GameShell(props){
  const {
    children,
    gameData,
    className,
    style,
    randomLengthStack = SETTINGS.DEFAULT_WORD_CHUNK_LENGTH,
  } = props

  const [currentChunk, setCurrentChunk] = useState(null)
  const [statisticChunk, setStatisticChunk] = useState(null)
  const [isGameEnd, setGameEnd] = useState(false)
  const [gameResetKey, setGameResetKey] = useState(Math.random())

  const {currentWordsGroup, getWordsGroup, onGroupLoading} = useWordsGroup()
  const {currentWords, getWordsChunk, onLoading} = useWords()
  const {update: userWordUpdate} = useUserWordUpdate()

  const {isLogged} = useSelector(state => state.user)
  const {state: {group: urlGroup, page: urlPage}} = useLocation()

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
    setGameResetKey(Math.random())
    setStatisticChunk([...currentChunk])
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
    if (isLogged) {
      userWordUpdate(word, params).then(updatedWord => {
        updateStatisticChunk(word, {userNewResults: updatedWord})
      })
    }
    updateStatisticChunk(word, {result: params})
  }

  useEffect(() => {
    if (urlGroup >= 0 && urlPage >= 0) {
      getWordsChunk(checkGroup(urlGroup), checkPage(urlPage))
    } else if (urlGroup >= 0) {
      getWordsGroup(checkGroup(urlGroup))
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
                  onClick = {setGameStartAgain}/>
                <BookLink
                  className={cx(classesCss.BookLink, classesCss.Button)}
                />
                <BackToGameLink
                  className={cx(classesCss.BackLink, classesCss.Button)}
                  classes={{icon: classesCss.Icon}}
                  group={urlGroup}
                  page={urlPage} />
              </div>
            </>
          )
        })()
      }
      <CloseButton />
    </div>
  )
};
import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import LevelButtons from "./common/Levels/LevelButtons";
import levelClasses from "../styles/Styles.module.scss";
import { useWordsGroup, useWords } from "../../hooks/hooks.words";
import { createRandomChunkFromGroup } from "../../helpers/utils.words";
import { SETTINGS } from "../../settings";
import GameModal from "./common/GameModal/GameModal";
import classesCss from "./Games.module.scss";
import { useUserWordUpdate } from "../../hooks/hooks.user";
import { useSelector } from "react-redux";

export default function GameShell(props) {
  const {
    children,
    gameData,
    className,
    style,
    randomLengthStack = SETTINGS.DEFAULT_WORD_CHUNK_LENGTH,
  } = props;

  const { currentWordsGroup, getWordsGroup, onGroupLoading } = useWordsGroup();
  const { currentWords, getWordsChunk, onLoading } = useWords();
  const { update: userWordUpdate } = useUserWordUpdate();
  const {
    state: { group: urlGroup, page: urlPage },
  } = useLocation();
  const { isLogged } = useSelector((state) => state.user);
  const [currentChunk, setCurrentChunk] = useState(null);

  function levelSelectHandler(index) {
    getWordsGroup(index);
  }

  function checkGroup(group) {
    if (group < SETTINGS.GROUPS_COUNT) return group;
    return 0;
  }

  function checkPage(page) {
    if (page < SETTINGS.PAGES_COUNT) return page;
    return 0;
  }

  function addWordToUserHandler(word, params) {
    if (isLogged) {
      userWordUpdate(word, params);
    }
  }

  useEffect(() => {
    if (urlGroup >= 0 && urlPage >= 0) {
      getWordsChunk(checkGroup(urlGroup), checkPage(urlPage));
    } else if (urlGroup >= 0) {
      getWordsGroup(checkGroup(urlGroup));
    }
  }, [urlGroup, urlPage, getWordsGroup, getWordsChunk]);

  useEffect(() => {
    if (currentWordsGroup) {
      setCurrentChunk(
        createRandomChunkFromGroup(currentWordsGroup, randomLengthStack)
      );
    }
  }, [currentWordsGroup, randomLengthStack]);

  useEffect(() => {
    if (currentWords) {
      setCurrentChunk(currentWords);
    }
  }, [currentWords]);

  const gameContent = useMemo(() => {
    function getChild(props) {
      return React.Children.map(children, (child) => {
        return (
          <child.type {...child.props} {...props}>
            {children}
          </child.type>
        );
      });
    }

    if (
      (children && (onGroupLoading || onLoading)) ||
      (children && !(onGroupLoading || onLoading) && currentChunk?.length)
    ) {
      const wordsProps = {
        words: currentChunk,
        onLoading: onGroupLoading || onLoading,
        onWordSelect: addWordToUserHandler,
      };
      return getChild(wordsProps);
    }
    return null;
  }, [children, onGroupLoading, onLoading, currentChunk, addWordToUserHandler]);

  return (
    <div className={[className, classesCss.GameShell].join(" ")} style={style}>
      {gameContent ? (
        gameContent
      ) : (
        <GameModal gameData={gameData}>

            <LevelButtons
              levelNumbers={6}
              levelStyles={levelClasses}
              onSelect={levelSelectHandler}
            />
          </GameModal>
      )}
    </div>
  );
}

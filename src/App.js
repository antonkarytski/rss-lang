import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import BookPage from "./pages/BookPage/BookPage";
import GamesPage from "./pages/GamesPage";
import Sprint from "./pages/Games/Sprint/GamePage";
import AudioCall from "./pages/Games/AudioCall/GamePageAudioCall";
import Savannah from "./pages/Games/Savannah/GamePage";
import StatisticsPage from "./pages/StatisticsPage/StatisticsPage";
import PuzzleGame from "./pages/Games/PuzzleGame/PuzzleGame";
import { useDispatch, useSelector } from "react-redux";
import { syncUserWords } from "./redux/actions.words";
import { checkToken, logOut } from "./redux/actions.auth";
import UserPage from "./pages/UserPage/UserPage";
import GameShell from "./pages/Games/GameShell";
import { GAMES } from "./pages/Games/gamesData";
import "./styles/effects.scss";
import "./styles/App.module.scss";
import AboutPage from "./pages/AboutPage/AboutPage";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLogged } = useSelector((store) => store.user);

  function getGamePath(game) {
    const basePath = `/games/${game}`;
    return [`${basePath}/:group/:page`, `${basePath}/:group`, basePath];
  }

  useEffect(() => {
    async function syncUser() {
      const token = await dispatch(checkToken());
      if (token) {
        await dispatch(syncUserWords());
      } else {
        await dispatch(logOut());
      }
    }

    if (isLogged) {
      syncUser();
    }
  }, [dispatch, isLogged]);

  return (
    <>
      <Switch location={location}>
        <Route path={["/book", "/vocabulary"]}>
          <BookPage />
        </Route>
        <Route path="/statistic">
          <StatisticsPage />
        </Route>
        <Route path={getGamePath("savannah")}>
          <GameShell gameData={GAMES.savannah}>
            <Savannah />
          </GameShell>
        </Route>
        <Route path={getGamePath("audiocall")}>
          <GameShell gameData={GAMES.audiocall}>
            <AudioCall />
          </GameShell>
        </Route>
        <Route path={getGamePath("sprint")}>
          <GameShell gameData={GAMES.sprint} randomLengthStack={10}>
            <Sprint />
          </GameShell>
        </Route>
        <Route path={getGamePath("puzzle")}>
          <GameShell gameData={GAMES.puzzle}>
            <PuzzleGame />
          </GameShell>
        </Route>
        <Route path="/games" exact>
          <GamesPage />
        </Route>
        <Route path="/about" exact>
          <AboutPage />
        </Route>
        <Route path="/user" exact>
          <UserPage />
        </Route>
        <Route path="/" exact>
          <MainPage />
        </Route>
      </Switch>
    </>
  );
}

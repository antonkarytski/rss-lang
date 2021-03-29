import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import NavigationBar from "./pages/Navigation/NavigationBar"
import MainPage from "./pages/MainPage";
import BookPage from "./pages/BookPage/BookPage";
import GamesPage from "./pages/GamesPage";
import Sprint from "./pages/Games/Sprint";
import AudioCall from "./pages/Games/AudioCall/AudioCall";
import Savannah from "./pages/Games/Savannah/Savannah";
import StatisticsPage from "./pages/StatisticsPage/StatisticPage";
import PuzzleGame from "./pages/Games/PuzzleGame/PuzzleGame";
import { useDispatch, useSelector } from "react-redux";
import { getUserWords } from "./redux/actions.user";
import { syncUserWords } from "./redux/actions.words";
import { checkToken, logOut } from "./redux/actions.auth";
import UserPage from "./pages/UserPage/UserPage"
import GameShell from "./pages/Games/GameShell";
import {GAMES} from "./pages/Games/gamesData";
import "./styles/effect.scss";
import "./styles/App.module.scss";

export default function App(){
  const dispatch = useDispatch();
  const location = useLocation();
  const user = useSelector((store) => store.user);

  function getGamePath(game){
    const basePath = `/games/${game}`
    return [`${basePath}/:group/:page`, `${basePath}/:group`, basePath]
  }

  useEffect(() => {
    async function syncUser(){
      // if token OK or token pre-expire and can be refreshed - return token
      // if token is expired - return false
      const token = await dispatch(checkToken())
      if (token) {
        await dispatch(getUserWords())
        await dispatch(syncUserWords())
      } else {
        await dispatch(logOut())
      }
    }

    if (user.isLogged) {
      syncUser()
    }
  }, [dispatch, user.isLogged])

  return (
    <>
      <NavigationBar/>
      <TransitionGroup>
        <CSSTransition
          timeout={800}
          classNames="transit"
          key={location.key || location.pathname}
        >
          <Switch location={location}>
            <Route path="/book"><BookPage/></Route>
            <Route path="/statistic"><StatisticsPage/></Route>
            <Route path={getGamePath("savannah")} exact component={Savannah}/>
            <Route path={getGamePath("audiocall")}><AudioCall/></Route>
            <Route path={getGamePath("sprint")}><Sprint/></Route>
            <Route path={getGamePath("puzzle")}>
              <GameShell gameData={GAMES.puzzle}><PuzzleGame/></GameShell>
            </Route>
            <Route path="/games" exact><GamesPage/></Route>
            <Route path="/user" exact><UserPage/></Route>
            <Route path="/" exact><MainPage/></Route>
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </>
  )
}

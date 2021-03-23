import React from "react"
import { Route, Switch, useLocation } from "react-router-dom"
import { TransitionGroup, CSSTransition } from "react-transition-group"
import NavigationBar from "./components/Navigation/NavigationBar"
import MainPage from "./pages/MainPage"
import BookPage from "./pages/BookPage/BookPage"
import GamesPage from "./pages/GamesPage"
import Sprint from "./pages/Games/Sprint"
import AudioCall from "./pages/Games/Audiocall"
import Savannah from "./components/Games/Savannah/Savannah"
import GamePageSavannah from "./components/Games/Savannah/GamePage"
import StatisticPage from "./pages/StatisticPage"
import PuzzleGame from "./pages/Games/PuzzleGame"
import "./styles/effect.scss"

function App(){

	const location = useLocation()

	return (
		<div>
			<NavigationBar />
			<TransitionGroup>
				<CSSTransition
					timeout={800}
					classNames="transit"
					key={location.key || location.pathname}
				>
				<Switch location={location}>
					<Route path="/book"><BookPage/></Route>
					<Route path="/statistic"><StatisticPage/></Route>
                    <Route path="/games/savannah" exact component={Savannah}/>
                    <Route path="/games/savannah/game" component={GamePageSavannah}/>
                    <Route path="/games/audiocall"><AudioCall/></Route>
					<Route path="/games/sprint"><Sprint/></Route>
					<Route path="/games/puzzle"><PuzzleGame/></Route>
					<Route path="/games" exact><GamesPage/></Route>
					<Route path="/" exact><MainPage/></Route>
				</Switch>
				</CSSTransition>
			</TransitionGroup>
		</div>
	)
}

export default App

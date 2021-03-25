import React from "react"
import classesCss from "./styles/MainPage.module.scss"
import "../styles/effect.scss"
import NavigationBar from "../components/Navigation/NavigationBar";


export default function MainPage(){

	const girlStyle = {
		backgroundImage: `url(${process.env.PUBLIC_URL}/static/girl.png)`,
	}

	return (
		<>
			<NavigationBar/>
			<div className={[classesCss.MainPage, "main-page"].join(" ")}>
				<div className={classesCss.Bg}>
					<div className={[classesCss.Wave, "wave"].join(" ")}/>
					<div className={[classesCss.Gradient, "gradient"].join(" ")}/>
					<div className={[classesCss.Girl, "girl"].join(" ")}>
						<div style={girlStyle}/>
					</div>
				</div>
			</div>
		</>
	)
}

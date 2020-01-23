import * as React from 'react';
import './App.css';
import { TVChartContainer } from './components/TVChartContainer/index';

class App extends React.Component {
	render() {
		return (
				<div  style={{width: "50%", height: "50%"}}>
					<TVChartContainer />
				</div>

		);
	}
}

export default App;

import React, { Component } from 'react';

import SpaceCards from '../space-cards';

import {tmbdService} from '../../services/tmbd-service';

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			moviesData: []
		};
	}

	updateMovies() {
		tmbdService.getMovies()
			.then((body) => {
				this.setState((moviesData) => {
					return {
						moviesData: body.results
					}
				})
			})
	}

	componentDidMount() {
		this.updateMovies();
	}

	render() {
		return (
			<SpaceCards movies={this.state}/>
		);
	}
}
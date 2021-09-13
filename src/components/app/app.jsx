import React, { Component } from 'react';

import { Alert, Tabs } from 'antd';
import SearchPanel from '../search-panel';
import SpaceCards from '../space-cards';
import AlertErr from '../alert-err';
import Pagin from '../pagin';
import { MoviesProvider } from '../movies-context';
import stateDefault from '../../constants/constants';
import { getRateMovies, updateRateMovies, updateMovies, updateSessionId, updateGenresMovies,
	setStateRateMovies, setRate } from '../../utilities/utilities';

import tmbdService from '../../services/tmbd-service';

import './app.css';

const debounce = require('lodash.debounce');

const { TabPane } = Tabs;

export default class App extends Component {
	updateMoviesDebounced = debounce(updateMovies, 2000);

	constructor() {
		super();
		this.state = stateDefault;
	}

	componentDidMount() {
		updateGenresMovies.call(this)
		updateSessionId.call(this);
		updateMovies.call(this);
		setRate.call(this);
	}

	componentDidUpdate(prevProps, prevState) {
		const { searchMovieName, currentPage } = this.state;
		if (searchMovieName !== prevState.searchMovieName) {
			this.updateMoviesDebounced();
		} else if (currentPage !== prevState.currentPage) {
			updateMovies.call(this);
		}
	}
	
	selectionTab = (currentKey) => {
		this.setState(() => {
			if (currentKey === '1') {
				updateMovies.call(this);
			} else if (currentKey === '2') {
				getRateMovies.call(this);
				updateRateMovies.call(this);
			}
			return {
				activeKey: currentKey
			}
		})
	}

	addNewMovies = (name) => {
		this.setState(() => ({
				searchMovieName: name,
				currentPage: 1
			}))
	}

	onChangePage = (page) => {
		this.setState(() => ({
				currentPage: page
			}))
	}

	onChangeValue = (value, id, sessionId) => {
		tmbdService.setRateMovie(id, value, sessionId);
		setStateRateMovies.call(this, id, value);
	}

	render() {
		const { error, unprocessableEntity, disconnected, moviesData, genresData, activeKey, searchMovieName } = this.state;
		const spaceCards = !error && !unprocessableEntity && !disconnected ? <SpaceCards movies={this.state} onChangeValue={this.onChangeValue} /> : null;
		const errMessage = error ? <AlertErr message='Server is not available' /> : null;
		const errDisconnected = disconnected ? <AlertErr message='Internet disconnected' /> : null;
		const unprocessableEntityMessage = unprocessableEntity ? 
			<Alert message="Enter the title of the movie in the search box" type="info" showIcon /> : null;
		const nothingFoundMessage = moviesData.length === 0  && !unprocessableEntity ? 
			<Alert message="Movie not found" type="info" showIcon /> : null;
		const pagination = error || unprocessableEntity || disconnected ? null : <Pagin propsState={this.state} change={this.onChangePage} />;
		
		return (
			<div>
				<MoviesProvider value={genresData}>
					<Tabs activeKey={activeKey}
						centered
						onChange={this.selectionTab}>
						<TabPane tab="Search" key="1">
							<SearchPanel
								changeNewMovies={this.addNewMovies}
								inputValue={searchMovieName}
							/>
							{errMessage}
							{errDisconnected}
							{unprocessableEntityMessage}
							{nothingFoundMessage}
							{spaceCards}
							{pagination}
						</TabPane>
						<TabPane tab="Rated" key="2">
							{errMessage}
							{errDisconnected}
							{spaceCards}
							{pagination}
						</TabPane>
					</Tabs>
				</MoviesProvider>
			</div>
		);
	}
}
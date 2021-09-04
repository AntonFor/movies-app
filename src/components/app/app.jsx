/* eslint-disable react/no-unused-state */
/* eslint-disable no-alert */
import React, { Component } from 'react';

import { Alert, Tabs } from 'antd';
import SearchPanel from '../search-panel';
import SpaceCards from '../space-cards';
import AlertErr from '../alert-err';
import Pagin from '../pagin';
import { MoviesProvider } from '../movies-context';
import stateDefault from '../../constants/constants';

import tmbdService from '../../services/tmbd-service';

import './app.css';

const debounce = require('lodash.debounce');

const { TabPane } = Tabs;

export default class App extends Component {
	updateMoviesDebounced = debounce(this.updateMovies, 2000);

	constructor() {
		super();
		this.state = stateDefault;
	}

	componentDidMount() {
		this.updateGenresMovies()
		this.updateSessionId();
		this.updateMovies();
	}

	componentDidUpdate(prevProps, prevState) {
		const { searchMovieName, currentPage } = this.state;
		if (searchMovieName !== prevState.searchMovieName) {
			this.updateMoviesDebounced();
		} else if (currentPage !== prevState.currentPage) {
			this.updateMovies();
		}
	}

	getRateMovies() {
		const { sessionId } = this.state;
		let objPars;
		try {
			const obj = localStorage.getItem('rate');
			objPars = JSON.parse(obj);
		} catch(err) {
			if (err instanceof SyntaxError) {
				objPars = null;
				alert(`JSON syntax error: ${  err.message  }. Movies data that has been rated is lost`);
			} else {
				throw err;
			}
		}
		finally {
			objPars = objPars === null ? {} : objPars;
			const arrPars = Object.keys(objPars).map((key) => [Number(key), objPars[key]]);
			const getRate = new Map(arrPars);
			for (const [ id, value ] of getRate) {
				tmbdService.setRateMovie(id, value, sessionId);
			}
		}
	}
	
	selectionTab = (currentKey) => {
		this.setState(() => {
			if (currentKey === '1') {
				this.updateMovies();
			} else if (currentKey === '2') {
				this.getRateMovies();
				this.updateRateMovies();
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

	onError = (err) => {
		switch(err.message) {
			case '422':
				this.setState(() => ({
						unprocessableEntity: true,
						loading: false
					}));
				break;
			case 'Failed to fetch':
				this.setState(() => ({
						disconnected: true,
						loading: false
					}));
				break;
			default:
				this.setState(() => ({
						error: true,
						loading: false
					}));
		}
	}

	updateRateMovies() {
		const { sessionId } = this.state;
		tmbdService.getRateMovies(sessionId)
			.then((body) => {
				this.setState(() => ({
						moviesData: body.results,
						loading: false,
						error: false,
						unprocessableEntity: false,
						disconnected: false,
						totalPages: body.total_pages,
						totalResults: body.total_results, 
					}))
			}).catch(this.onError);
	}

	updateSessionId() {
		tmbdService.getSessionId()
			.then(body => {
				this.setState(() => ({
						sessionId: body.guest_session_id
					}))
			}).catch(this.onError);
	}

	updateMovies() {
		const { searchMovieName, currentPage } = this.state;
		tmbdService.getMovies(searchMovieName, currentPage)
			.then((body) => {
				this.setState(() => ({
						moviesData: body.results,
						loading: false,
						error: false,
						unprocessableEntity: false,
						disconnected: false,
						totalPages: body.total_pages,
						totalResults: body.total_results, 
					}))
			}).catch(this.onError);
	}

	updateGenresMovies() {
		tmbdService.getGenresMovies()
			.then((body) => {
				this.setState(() => ({
						genresData: body.genres
					}))
			})
	}

	render() {
		const { error, unprocessableEntity, disconnected, moviesData, genresData, activeKey, searchMovieName } = this.state;
		const spaceCards = !error && !unprocessableEntity && !disconnected ? <SpaceCards movies={this.state} /> : null;
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
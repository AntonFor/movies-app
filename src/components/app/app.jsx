import React, { Component } from 'react';

import SearchPanel from '../search-panel';
import SpaceCards from '../space-cards';
import AlertErr from '../alert-err';
import Pagin from '../pagin';
import { GenresMoviesProvider } from '../genres-movies-context';

import { Alert, Tabs } from 'antd';

import {tmbdService} from '../../services/tmbd-service';

import './app.css';

var debounce = require('lodash.debounce');

const { TabPane } = Tabs;

export default class App extends Component {
	constructor() {
		super();
		this.state = {
			moviesData: [],
			loading: true,
			error: false,
			unprocessableEntity: false,
			disconnected: false,
			searchMovieName: '',
			totalPages: 1,
			currentPage: 1,
			totalResults: null,
			sessionId: null,
			activeKey: '1',
			genresData: null
		};
	}

	updateMovies() {
		tmbdService.getMovies(this.state.searchMovieName, this.state.currentPage)
			.then((body) => {
				this.setState(({ moviesData, loading, error, unprocessableEntity, disconnected, totalPages, totalResults }) => {
					return {
						moviesData: body.results,
						loading: false,
						error: false,
						unprocessableEntity: false,
						disconnected: false,
						totalPages: body.total_pages,
						totalResults: body.total_results, 
					}
				})
			}).catch(this.onError);
	}

	updateSessionId() {
		tmbdService.getSessionId()
			.then(body => {
				this.setState(({ sessionId }) => {
					return {
						sessionId: body.guest_session_id
					}
				})
			}).catch(this.onError);
	}

	updateRateMovies() {
		tmbdService.getRateMovies(this.state.sessionId)
			.then((body) => {
				this.setState(({ moviesData, loading, error, unprocessableEntity, disconnected, totalPages, totalResults }) => {
					return {
						moviesData: body.results,
						loading: false,
						error: false,
						unprocessableEntity: false,
						disconnected: false,
						totalPages: body.total_pages,
						totalResults: body.total_results, 
					}
				})
			}).catch(this.onError);
	}

	updateGenresMovies() {
		tmbdService.getGenresMovies()
			.then((body) => {
				this.setState(( {genresData} ) => {
					return {
						genresData: body.genres
					}
				})
			})
	}

	onError = (err) => {
		switch(err.message) {
			case '422':
				this.setState(({ unprocessableEntity, loading }) => {
					return {
						unprocessableEntity: true,
						loading: false
					}
				});
				break;
			case 'Failed to fetch':
				this.setState(({ disconnected, loading }) => {
					return {
						disconnected: true,
						loading: false
					}
				});
				break;
			default:
				this.setState(({ error, loading }) => {
					return {
						error: true,
						loading: false
					}
				});
		}
	}

	addNewMovies = (name) => {
		this.setState(({ searchMovieName, currentPage }) => {
			return {
				searchMovieName: name,
				currentPage: 1
			}
		})
	}

	updateMoviesDebounced = debounce(this.updateMovies, 2000);

	onChangePage = (page) => {
		this.setState(({ currentPage }) => {
			return {
				currentPage: page
			}
		})
	}

	getRateMovies() {
		let objPars;
		try {
			const obj = localStorage.getItem('rate');
			objPars = JSON.parse(obj);
		} catch(err) {
			if (err instanceof SyntaxError) {
				objPars = null;
				alert("JSON syntax error: " + err.message + ". Movies data that has been rated is lost");
			} else {
				throw err;
			}
		}
		finally {
			objPars = objPars === null ? {} : objPars;
			const arrPars = Object.keys(objPars).map((key) => [Number(key), objPars[key]]);
			const getRate = new Map(arrPars);
			for (let [ id, value ] of getRate) {
				tmbdService.setRateMovie(id, value, this.state.sessionId);
			}
		}
	}
	
	selectionTab = (currentKey) => {
		this.setState(({ activeKey }) => {
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

	componentDidMount() {
		this.updateGenresMovies()
		this.updateSessionId();
		this.updateMovies();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.searchMovieName !== prevState.searchMovieName) {
			this.updateMoviesDebounced();
		} else if (this.state.currentPage !== prevState.currentPage) {
			this.updateMovies();
		} else return;
	}

	render() {
		const { error, unprocessableEntity, disconnected, moviesData } = this.state;
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
				<GenresMoviesProvider value={this.state.genresData}>
					<Tabs activeKey={this.state.activeKey}
						centered
						onChange={this.selectionTab}>
						<TabPane tab="Search" key="1">
							<SearchPanel
								changeNewMovies={this.addNewMovies}
								inputValue={this.state.searchMovieName}
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
				</GenresMoviesProvider>
			</div>
		);
	}
}
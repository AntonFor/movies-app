import React, { Component } from 'react';

import SearchPanel from '../search-panel';
import SpaceCards from '../space-cards';
import AlertErr from '../alert-err';

import { Alert } from 'antd';
import { Pagination } from 'antd';

import {tmbdService} from '../../services/tmbd-service';

import './app.css';

var debounce = require('lodash.debounce');

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
			sessionId: null
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

	onError = (err) => {
		if (err.message === '422') {
			this.setState(({ unprocessableEntity, loading }) => {
				return {
					unprocessableEntity: true,
					loading: false
				}
			})
		} else if (err.message === 'Failed to fetch') {
			this.setState(({ disconnected, loading }) => {
				return {
					disconnected: true,
					loading: false
				}
			})
		} else {
			this.setState(({ error, loading }) => {
				return {
					error: true,
					loading: false
				}
			})
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
		const obj = localStorage.getItem('rate');
		let objPars = JSON.parse(obj);
		objPars = objPars === null ? {} : objPars;
		const arrPars = Object.keys(objPars).map((key) => [Number(key), objPars[key]]);
		const getRate = new Map(arrPars);
		for (let [ id, value ] of getRate) {
			tmbdService.setRateMovie(id, value, this.state.sessionId);
		}
	}

	rated = () => {
		this.getRateMovies();
		this.updateRateMovies();
	}
	
	componentDidMount() {
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
				<button onClick={this.rated}>Rated</button>
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
			</div>
		);
	}
}

const Pagin = (props) => {
	const { propsState, change } = props;
	const { totalResults, currentPage } = propsState;
	return (
		<Pagination
			size="small"
			total={totalResults}
			current={currentPage}
			pageSize={20}
			hideOnSinglePage={true}
			onChange={change}
			showSizeChanger={false}
		/>
	)
}
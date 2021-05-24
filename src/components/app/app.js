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
			searchMovieName: '',
			totalPages: 1,
			currentPage: 1
		};
	}

	updateMovies() {
		tmbdService.getMovies(this.state.searchMovieName, this.state.currentPage)
			.then((body) => {
				this.setState((moviesData, loading, error, unprocessableEntity, totalPages) => {
					return {
						moviesData: body.results,
						loading: false,
						error: false,
						unprocessableEntity: false,
						totalPages: body.total_pages
					}
				})
			}).catch(this.onError);
	}

	onError = (err) => {
		if (err.message === '422') {
			this.setState((unprocessableEntity, loading, error) => {
				return {
					unprocessableEntity: true,
					loading: false
				}
			})
		} else {
			this.setState((error, loading) => {
				return {
					error: true,
					loading: false
				}
			})
		}
	}

	addNewMovies = (name) => {
		this.setState((searchMovieName) => {
			return {
				searchMovieName: name
			}
		})
	}

	updateMoviesDebounced = debounce(this.updateMovies, 2000);

	onChangePage = (page, pageSize) => {
		tmbdService.getMovies(this.state.searchMovieName, page)
			.then((body) => {
				this.setState((moviesData, loading, error, unprocessableEntity, totalPages, currentPage) => {
					return {
						moviesData: body.results,
						//loading: false,
						//error: false,
						//unprocessableEntity: false,
						//totalPages: body.total_pages,
						currentPage: page
					}
				})
			}).catch(this.onError);
	}
	
	componentDidMount() {
		this.updateMovies();
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.state.searchMovieName !== prevState.searchMovieName) {
			this.updateMoviesDebounced();
		}
	}

	render() {
		const { error, unprocessableEntity } = this.state;
		const spaceCards = !error && !unprocessableEntity ? <SpaceCards movies={this.state} /> : null;
		const errMessage = error ? <AlertErr /> : null;
		const unprocessableEntityMessage = unprocessableEntity ? 
			<Alert message="Enter the title of the movie in the search box" type="info" showIcon /> : null;
		const nothingFoundMessage = this.state.moviesData.length === 0  && !unprocessableEntity ? 
			<Alert message="Movie not found" type="info" showIcon /> : null;

		return (
			<div>
				<SearchPanel
					changeNewMovies={this.addNewMovies}
					inputValue={this.state.searchMovieName}
				/>
				{errMessage}
				{unprocessableEntityMessage}
				{nothingFoundMessage}
				{spaceCards}
				<Pagination size="small"
					total={this.state.totalPages}
					PageSize={20}
					//current={this.state.currentPage}
					hideOnSinglePage={true}
					onChange={this.onChangePage}
				/>
			</div>
		);
	}
}
import React, { Component } from 'react';

import CardItem from '../card';
import Spinner from '../spinner';
import { GenresMoviesConsumer } from '../genres-movies-context';
import { getGenre } from '../../utilities/utilities';
import { getUrlPoster } from '../../utilities/utilities';

import { Space } from 'antd';
import 'antd/dist/antd.css';

import {tmbdService} from '../../services/tmbd-service';

import './space-cards.css';

export default class SpaceCards extends Component {
	constructor() {
		super();
		this.state = {
			rateMovies: new Map()
		}
	}

	setStateRateMovies(id, value) {
		this.setState(({ rateMovies }) => {
			const map = new Map(rateMovies.entries());
			map.set(id, value);
			const obj = Object.fromEntries(map);
			localStorage.setItem('rate', JSON.stringify(obj));
			return {
				rateMovies: map
			}
		})
	}

	setRate() {
		this.setState(({ rateMovies }) => {
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
				return {
					rateMovies: getRate
				}
			}
		})
	}

	onChangeValue = (value, id, sessionId) => {
		tmbdService.setRateMovie(id, value, sessionId);
		this.setStateRateMovies(id, value);
	}

	componentDidMount() {
		this.setRate();
	}

	render() {
		const { movies } = this.props;
		const { moviesData, loading, sessionId } = movies;

		return (
			<GenresMoviesConsumer>
				{
					(genresData) => {
						return (
							<Space size={'large'}
								wrap={true}
								className="space">
								{moviesData.map((_, index) => {
									if (loading) {
										return (
											<Spinner key={index} />
										)
									}
									const { id = index, poster_path, title, release_date, genre_ids, overview, vote_average } = moviesData[index];
									return (
										<CardItem
											key={id}
											titleItem={title}
											dateItem={release_date}
											genreItem={getGenre(genresData, genre_ids)}
											overviewItem={overview}
											voteItem={vote_average}
											urlItem={getUrlPoster(poster_path)}
											valueItem={this.state.rateMovies.get(id)}
											onChangeValueItem={(value) => this.onChangeValue(value, id, sessionId)}
										/>
									)
								})}
							</Space>
						)
					}
				}
			</GenresMoviesConsumer>
		);
	}
}
import React, { Component } from 'react';

import CardItem from '../card';
import Spinner from '../spinner';
import { GenresMoviesConsumer } from '../genres-movies-context';

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
			const obj = localStorage.getItem('rate');
			let objPars = JSON.parse(obj);
			objPars = objPars === null ? {} : objPars;
			const arrPars = Object.keys(objPars).map((key) => [Number(key), objPars[key]]);
			const getRate = new Map(arrPars);
			return {
				rateMovies: getRate
			}
		})
	}

	getGenre(genresData, genre) {
		return genre.map(genre => {
			return genresData.find(item => item.id === genre).name;
		});
	}

	componentDidMount() {
		this.setRate();
	}

	render() {
		const { movies } = this.props;
		const { moviesData, loading, sessionId } = movies;
		const arrayLength = loading ? 20 : moviesData.length;

		return (
			<GenresMoviesConsumer>
				{
					(genresData) => {
						return (
							<Space size={'large'}
								wrap={true}
								className="space">
								{new Array(arrayLength).fill(null).map((_, index) => {
									if (loading) {
										return (
											<Spinner key={index} />
										)
									}
									const { id = index, poster_path, title, release_date, genre_ids, overview, vote_average } = moviesData[index];
									const url = `https://image.tmdb.org/t/p/w300/${poster_path}`;
									const onChangeValue = (value) => {
										tmbdService.setRateMovie(id, value, sessionId);
										this.setStateRateMovies(id, value);
									}
									return (
										<CardItem
											key={id}
											titleItem={title}
											dateItem={release_date}
											genreItem={this.getGenre(genresData, genre_ids)}
											overviewItem={overview}
											voteItem={vote_average}
											urlItem={url}
											valueItem={this.state.rateMovies.get(id)}
											onChangeValueItem={onChangeValue}
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
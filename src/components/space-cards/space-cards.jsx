/* eslint-disable no-unsafe-finally */
/* eslint-disable no-alert */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Space } from 'antd';
import CardItem from '../card';
import Spinner from '../spinner';
import { MoviesConsumer } from '../movies-context';
import { getGenre , getUrlPoster } from '../../utilities/utilities';


import 'antd/dist/antd.css';

import tmbdService from '../../services/tmbd-service';

import './space-cards.css';

export default class SpaceCards extends Component {
	constructor() {
		super();
		this.state = {
			rateMovies: new Map()
		}
	}

	componentDidMount() {
		this.setRate();
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
		this.setState(() => {
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

	render() {
		const { movies } = this.props;
		const { moviesData, loading, sessionId } = movies;
		const { rateMovies } = this.state;

		return (
			<MoviesConsumer>
				{
					(genresData) => (
							<Space size="large"
								wrap
								className="space">
								{moviesData.map((item, index) => {
									if (loading) {
										return (
											<Spinner key={item} />
										)
									}
									const { id, poster_path: posterPath, title, release_date: releaseDate, genre_ids: genreIds, overview, vote_average: voteAverage } = moviesData[index];
									return (
										<CardItem
											key={id}
											titleItem={title}
											dateItem={releaseDate}
											genreItem={getGenre(genresData, genreIds)}
											overviewItem={overview}
											voteItem={voteAverage}
											urlItem={getUrlPoster(posterPath)}
											valueItem={rateMovies.get(id)}
											onChangeValueItem={(value) => this.onChangeValue(value, id, sessionId)}
										/>
									)
								})}
							</Space>
						)
				}
			</MoviesConsumer>
		);
	}
}

SpaceCards.defaultProps = {
	movies: {},
}

SpaceCards.propTypes = {
	movies: PropTypes.shape({
    moviesData: PropTypes.arrayOf(PropTypes.object),
		loading: PropTypes.bool,
		error: PropTypes.bool,
		unprocessableEntity: PropTypes.bool,
		disconnected: PropTypes.bool,
		searchMovieName: PropTypes.string,
		totalPages: PropTypes.number,
		currentPage: PropTypes.number,
		totalResults: PropTypes.number,
		sessionId: PropTypes.string,
		activeKey: PropTypes.string,
		genresData: PropTypes.arrayOf(PropTypes.object)
  }),
}
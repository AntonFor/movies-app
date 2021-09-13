import React from 'react';
import PropTypes from 'prop-types';

import { Space } from 'antd';
import CardItem from '../card';
import Spinner from '../spinner';
import { MoviesConsumer } from '../movies-context';
import { getGenre , getUrlPoster } from '../../utilities/utilities';

import 'antd/dist/antd.css';

import './space-cards.css';

export default function SpaceCards(props) {
	const { movies, onChangeValue } = props;
	const { moviesData, loading, sessionId, rateMovies } = movies;
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
										onChangeValueItem={(value) => onChangeValue(value, id, sessionId)}
									/>
								)
							})}
						</Space>
					)
			}
		</MoviesConsumer>
	);
}

SpaceCards.defaultProps = {
	movies: {},
	onChangeValue: () => {}
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
		genresData: PropTypes.arrayOf(PropTypes.object),
		rateMovies: PropTypes.objectOf(PropTypes.object)
  }),
	onChangeValue: PropTypes.func
}
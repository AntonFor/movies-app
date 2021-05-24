import React from 'react';

import CardItem from '../card';
import Spinner from '../spinner';

import { Space } from 'antd';
import 'antd/dist/antd.css';

import './space-cards.css';

const SpaceCards = (props) => {
	const { movies } = props;
	const { moviesData, loading } = movies;
	const arrayLength = loading ? 20 : moviesData.length;

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
				const { id = index, poster_path, title, release_date, genre1 = 'Action', genre2 = 'Drama', overview } = moviesData[index];
				const url = `https://image.tmdb.org/t/p/w300/${poster_path}`;
				// eslint-disable-next-line react/no-array-index-key
				return (
					<CardItem
						key={id}
						titleItem={title}
						dateItem={release_date}
						genreItem1={genre1}
						genreItem2={genre2}
						overviewItem={overview}
						urlItem={url}
					/>
				)
			})
			}
		</Space>
	);
}

export default SpaceCards;
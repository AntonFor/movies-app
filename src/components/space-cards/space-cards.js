import React, { Component } from 'react';

import CardItem from '../card';
import Spinner from '../spinner';

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

	updateStateRateMovies(id, sessionId) {
		const { rateMovies } = this.state;
		if (rateMovies.has(id)) {
			tmbdService.setRateMovie(id, rateMovies.get(id), sessionId);
		} else return;
	}

	componentDidMount() {
		this.setRate();
	}

	render() {
		const { movies } = this.props;
		const { moviesData, loading, sessionId } = movies;
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
					const onChangeValue = (value) => {
						tmbdService.setRateMovie(id, value, sessionId);
						this.setStateRateMovies(id, value);
					}
					this.updateStateRateMovies(id, sessionId);
					return (
						<CardItem
							key={id}
							titleItem={title}
							dateItem={release_date}
							genreItem1={genre1}
							genreItem2={genre2}
							overviewItem={overview}
							urlItem={url}
							valueItem={this.state.rateMovies.get(id)}
							onChangeValueItem={onChangeValue}
						/>
					)
				})}
			</Space>
		);
	}
}
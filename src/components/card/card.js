import React, { Component } from 'react';

import { Card, Image } from 'antd';
import 'antd/dist/antd.css';

import { format } from 'date-fns';

import './card.css';

export default class CardItem extends Component {
	constructor() {
		super();

		this.truncate = (str, n) => {
			if (str.length <= n) return str;
			let subString = str.substr(0, n-1);
			return subString.substr(0, subString.lastIndexOf(' ')) + " ...";
		};
	}
	
	render() {
		const { titleItem, dateItem, genreItem1, genreItem2, overviewItem, urlItem } = this.props;

		let yr = new Date(dateItem).getFullYear();
		let mn = (new Date(dateItem).getMonth()) + 1;
		let dt = new Date(dateItem).getDate();
		let resultDate = format(new Date(yr, mn, dt), "MMMM d, yyyy");

		return (
			<Card
				title={
					<Image
						width={180}
						src={urlItem}
						alt="Постер фильма"
					/>
				}
				style={{ width: 450 }}>
				<h1>{titleItem}</h1>
				<div className="card__date">{resultDate}</div>
				<div className="card__genre-box">
					<div className="card__genre-item card__genre-item--left">{genreItem1}</div>
					<div className="card__genre-item">{genreItem2}</div>
				</div>
				<p>{this.truncate(overviewItem, 180)}</p>
			</Card>
		)
	}
}
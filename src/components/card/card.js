import React, { Component } from 'react';

import { Card, Image, Rate } from 'antd';
import 'antd/dist/antd.css';

import { format } from 'date-fns';

import './card.css';

export default class CardItem extends Component {
	constructor() {
		super();
		this.state = {
			
		}

		this.truncate = (str, n) => {
			if (str.length <= n) return str;
			let subString = str.substr(0, n-1);
			return subString.substr(0, subString.lastIndexOf(' ')) + " ...";
		};
	}
	
	render() {
		const { titleItem, dateItem, genreItem1, genreItem2, overviewItem, urlItem, onChangeValueItem, valueItem } = this.props;
		
		let resultDate;
		if (dateItem === '' || dateItem === undefined) resultDate = '';
		else {
			let yr = new Date(dateItem).getFullYear();
			let mn = (new Date(dateItem).getMonth());
			let dt = new Date(dateItem).getDate();
			resultDate = format(new Date(yr, mn, dt), "MMMM d, yyyy");
		}

		const rateStyle = {
			fontSize: '14.8px'
		}

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
				<Rate allowHalf
					count={10}
					value={valueItem}
					style={rateStyle}
					onChange={onChangeValueItem}
				/>
			</Card>
		)
	}
}
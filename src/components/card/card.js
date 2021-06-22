import React from 'react';

import { Card, Image, Rate, Badge } from 'antd';
import 'antd/dist/antd.css';

import { format } from 'date-fns';

import './card.css';

const CardItem = (props) => {
	const truncate = (str, n) => {
		if (str.length <= n) return str;
		let subString = str.substr(0, n-1);
		return subString.substr(0, subString.lastIndexOf(' ')) + " ...";
	};
	
	const { titleItem, dateItem, genreItem, overviewItem, voteItem, urlItem, onChangeValueItem, valueItem } = props;
		
	let resultDate;
	if (dateItem === '' || dateItem === undefined) resultDate = '';
	else {
		let yr = new Date(dateItem).getFullYear();
		let mn = (new Date(dateItem).getMonth());
		let dt = new Date(dateItem).getDate();
		resultDate = format(new Date(yr, mn, dt), "MMMM d, yyyy");
	}

	let color;
	if (0 <= voteItem && voteItem < 3) color = '#E90000';
	else if (3 <= voteItem && voteItem < 5) color = '#E97E00';
	else if (5 <= voteItem && voteItem < 7) color = '#E9D100';
	else if (7 <= voteItem) color = '#66E900';

	const rateStyle = {
		fontSize: '14.8px'
	}

	const badgeStyle = {
		color: '#000',
		backgroundColor: '#fff',
		boxShadow: `0 0 0 2px ${color} inset`,
		width: '30px',
		height: '30px',
		borderRadius: '50%',
		padding: '4px 6px'
	}

	const elements = genreItem.map((item, i) => {
		return (
			<li key={i} className="card__genre-item">
				{item}
			</li>
		)
	})

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
			<h1 className="card__title">
				{titleItem}
				<Badge count={voteItem}
					showZero
					style={badgeStyle}
				/>
			</h1>
			<div className="card__date">{resultDate}</div>
			<ul className="card__genre-box">{elements}</ul>
			<p>{truncate(overviewItem, 180)}</p>
			<Rate allowHalf
				count={10}
				value={valueItem}
				style={rateStyle}
				onChange={onChangeValueItem}
			/>
		</Card>
	)
}

export default CardItem;
import React, { useState, useEffect } from 'react';

import { truncate } from '../../utilities/utilities';

import { Card, Image, Rate, Badge } from 'antd';
import 'antd/dist/antd.css';

import { format } from 'date-fns';

import './card.css';

export default function CardItem(props) {
	let [resultDate, setResultDate] = useState(null);
	let [color, setColor] = useState(null);

	const { titleItem, dateItem, genreItem, overviewItem, voteItem, urlItem, onChangeValueItem, valueItem } = props;
	
	useEffect(() => {
		if (dateItem === '' || dateItem === undefined) setResultDate('');
		else {
			let yr = new Date(dateItem).getFullYear();
			let mn = (new Date(dateItem).getMonth());
			let dt = new Date(dateItem).getDate();
			setResultDate(format(new Date(yr, mn, dt), "MMMM d, yyyy"));
		}
	}, [dateItem]);
	
	useEffect(() => {
		if (0 <= voteItem && voteItem < 3) setColor('card__badge-red');
		else if (3 <= voteItem && voteItem < 5) setColor('card__badge-orange');
		else if (5 <= voteItem && voteItem < 7) setColor('card__badge-yellow');
		else if (7 <= voteItem) setColor('card__badge-green');
	}, [voteItem]);

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
				<Badge className={color}
					count={voteItem}
					showZero
				/>
			</h1>
			<div className="card__date">{resultDate}</div>
			<ul className="card__genre-box">{elements}</ul>
			<p>{truncate(overviewItem, 180)}</p>
			<Rate allowHalf
				count={10}
				value={valueItem}
				onChange={onChangeValueItem}
			/>
		</Card>
	)
}
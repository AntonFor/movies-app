import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Card, Image, Rate, Badge } from 'antd';
import 'antd/dist/antd.css';

import { format } from 'date-fns';

import { truncate } from '../../utilities/utilities';

import './card.css';

export default function CardItem(props) {
	const [resultDate, setResultDate] = useState(null);
	const [color, setColor] = useState(null);

	const { titleItem, dateItem, genreItem, overviewItem, voteItem, urlItem, onChangeValueItem, valueItem } = props;
	
	useEffect(() => {
		if (dateItem === '' || dateItem === undefined) setResultDate('');
		else {
			const yr = new Date(dateItem).getFullYear();
			const mn = (new Date(dateItem).getMonth());
			const dt = new Date(dateItem).getDate();
			setResultDate(format(new Date(yr, mn, dt), "MMMM d, yyyy"));
		}
	}, [dateItem]);
	
	useEffect(() => {
		if (voteItem >= 0 && voteItem < 3) setColor('card__badge-red');
		else if (voteItem >= 3 && voteItem < 5) setColor('card__badge-orange');
		else if (voteItem >= 5 && voteItem < 7) setColor('card__badge-yellow');
		else if (voteItem >= 7) setColor('card__badge-green');
	}, [voteItem]);

	const elements = genreItem.map((item) => (
			<li key={item} className="card__genre-item">
				{item}
			</li>
		))

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

CardItem.defaultProps = {
	titleItem: '',
	dateItem: '',
	genreItem: [],
	overviewItem: '',
	voteItem: 0,
	urlItem: '',
	onChangeValueItem: () => {},
	valueItem: 0,
}

CardItem.propTypes = {
	titleItem: PropTypes.string,
	dateItem: PropTypes.string,
	genreItem: PropTypes.arrayOf(PropTypes.object),
	overviewItem: PropTypes.string,
	voteItem: PropTypes.number,
	urlItem: PropTypes.string,
	onChangeValueItem: PropTypes.func,
	valueItem: PropTypes.number,
}
import React, {useEffect, useRef} from 'react';

import { Card, Image, Rate, Badge } from 'antd';
import 'antd/dist/antd.css';

import { format } from 'date-fns';

import './card.css';

export default function CardItem(props) {
	const truncate = (str, n) => {
		if (str.length <= n) return str;
		let subString = str.substr(0, n-1);
		return subString.substr(0, subString.lastIndexOf(' ')) + " ...";
	};
	
	const { titleItem, dateItem, genreItem, overviewItem, voteItem, urlItem, onChangeValueItem, valueItem } = props;
		
	let resultDate = useRef(null);
	let color = useRef(null);
	
	useEffect(() => {
		if (dateItem === '' || dateItem === undefined) resultDate.current = '';
		else {
			let yr = new Date(dateItem).getFullYear();
			let mn = (new Date(dateItem).getMonth());
			let dt = new Date(dateItem).getDate();
			resultDate.current = format(new Date(yr, mn, dt), "MMMM d, yyyy");
		}
	}, [dateItem]);
	
	useEffect(() => {
		if (0 <= voteItem && voteItem < 3) color.current = '#E90000';
		else if (3 <= voteItem && voteItem < 5) color.current = '#E97E00';
		else if (5 <= voteItem && voteItem < 7) color.current = '#E9D100';
		else if (7 <= voteItem) color.current = '#66E900';
	}, [voteItem]);
	
	const root = document.querySelector(':root');
	root.style.setProperty('--badge-color', color.current);

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
				<Badge
					count={voteItem}
					showZero
				/>
			</h1>
			<div className="card__date">{resultDate.current}</div>
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
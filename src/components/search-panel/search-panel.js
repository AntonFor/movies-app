import React from 'react';

import './search-panel.css';

const SearchPanel = (props) => {
	const { changeNewMovies, inputValue } = props;

	return (
		<div className="search">
			<input className="search__input"
				type="text"
				value={inputValue}
				placeholder="Type to search..."
				onChange={(event) => changeNewMovies(event.target.value)}
			/>
		</div>
	)
}

export default SearchPanel;
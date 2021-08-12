import React from 'react';
import PropTypes from 'prop-types';

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

SearchPanel.defaultProps = {
	changeNewMovies: () => {},
	inputValue: '',
}

SearchPanel.propTypes = {
	changeNewMovies: PropTypes.func,
	inputValue: PropTypes.string,
}

export default SearchPanel;
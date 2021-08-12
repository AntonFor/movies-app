import React from 'react';
import PropTypes from 'prop-types';

import { Pagination } from 'antd';


const Pagin = (props) => {
	const { propsState, change } = props;
	const { totalResults, currentPage } = propsState;
	return (
		<Pagination
			size="small"
			total={totalResults}
			current={currentPage}
			pageSize={20}
			hideOnSinglePage
			onChange={change}
			showSizeChanger={false}
		/>
	)
}

Pagin.defaultProps = {
	propsState: {},
	change: () => {},
	totalResults: 0,
	currentPage: 0,
}

Pagin.propTypes = {
	propsState: PropTypes.shape({
    moviesData: PropTypes.arrayOf(PropTypes.object),
		loading: PropTypes.bool,
		error: PropTypes.bool,
		unprocessableEntity: PropTypes.bool,
		disconnected: PropTypes.bool,
		searchMovieName: PropTypes.string,
		totalPages: PropTypes.number,
		currentPage: PropTypes.number,
		totalResults: PropTypes.number,
		sessionId: PropTypes.string,
		activeKey: PropTypes.string,
		genresData: PropTypes.arrayOf(PropTypes.object)
  }),	
	change: PropTypes.func,
	totalResults: PropTypes.number,
	currentPage: PropTypes.number,
}

export default Pagin;
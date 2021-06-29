import React from 'react';

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
			hideOnSinglePage={true}
			onChange={change}
			showSizeChanger={false}
		/>
	)
}

export default Pagin;
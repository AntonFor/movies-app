import React from 'react';

import { Spin } from 'antd';

import './spinner.css';

const Spinner = (props) => {
	return (
		<div className="example">
			<Spin size={'large'} />
		</div>
	);
};

export default Spinner;
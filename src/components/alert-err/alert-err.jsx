import React from 'react';

import { Alert } from 'antd';

import './alert-err.css';

const AlertErr = (props) => {
	const {message} = props;
	return(
		<Alert
      message="Error"
      description={message}
      type="error"
      showIcon
    />
	)
}

export default AlertErr;
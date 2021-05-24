import React from 'react';

import { Alert } from 'antd';

import './alert-err.css';

const AlertErr = (props) => {
	return(
		<Alert
      message="Error"
      description="Server is not available"
      type="error"
      showIcon
    />
	)
}

export default AlertErr;
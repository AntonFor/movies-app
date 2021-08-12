import React from 'react';
import PropTypes from 'prop-types';

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

AlertErr.defaultProps = {
	message: '',
}

AlertErr.propTypes = {
	message: PropTypes.string,
}

export default AlertErr;
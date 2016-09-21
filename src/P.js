/**
 * @providesModule P
 */

import React from 'react';
import { Text } from 'react-native';
import { Font } from 'exponent';

export default P = (props) => (
	<Text {...props} style={[Font.style('lato-regular'), props.style]}>{props.children}</Text>
);
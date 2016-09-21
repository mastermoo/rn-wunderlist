/** In order for logging to stream to XDE or the exp CLI you must import the
  * exponent module at some point in your app */
import Exponent from 'exponent';

import React from 'react';
import { AppRegistry } from 'react-native';
import TodolistApp from './src/Todolist';


AppRegistry.registerComponent('main', () => TodolistApp);

// bg source: https://www.urlaubstracker.de/berlin-mitte-park-inn-radisson-alexanderplatz/
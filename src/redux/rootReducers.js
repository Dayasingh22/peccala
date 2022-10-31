import { combineReducers } from 'redux';
import authReducer from './authentication/reducers';
import ChangeLayoutMode from './themeLayout/reducers';

const rootReducers = combineReducers({
  auth: authReducer,
  ChangeLayoutMode,
});

export default rootReducers;

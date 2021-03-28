import { combineReducers } from 'redux';
import auth from './auth/auth.reducer';
import config from './config/config.reducer';
import snackbar from './snackbar/snackbar.reducer';
import todo from './todo/todo.reducer';

export type RootState = ReturnType<typeof rootReducer>;

export const rootReducer = combineReducers({
	snackbar,
	todo,
	config,
	auth,
});

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk'; // Corrected import
import checklistReducer from './reducers';

const rootReducer = combineReducers({
  checklist: checklistReducer,
  // Add other reducers here if you have them
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

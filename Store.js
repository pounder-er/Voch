import profileReducer from './reducers/profileReducer';
import {createStore,combineReducers} from 'redux';

const rootReducer = combineReducers({
    profileReducer:profileReducer
})

const configureStore = createStore(rootReducer);

export default configureStore;
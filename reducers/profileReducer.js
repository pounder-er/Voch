import { ADD_PROFILE, ADD_FRIEND, ADD_POLL } from '../actions/types';
import { AccessibilityInfo } from 'react-native';

const intialState = {
    id: null,
    profile: null,
    friends: null,
    polls: null,
}
const profileReducer = (state = intialState, action) => {
    switch (action.type) {
        case ADD_PROFILE:
            return {
                ...state,
                profile: {
                    vochid: action.payload.vochid,
                    firstname: action.payload.firstname,
                    lastname: action.payload.lastname,
                    studentid: action.payload.studentid,
                    email: action.payload.email,
                    imageUri: action.payload.imageUri,
                    uid: action.payload.uid
                },
                id: action.payload.id
            };
        case ADD_FRIEND:
            return {
                ...state, friends: action.payload
            }
        case ADD_POLL:
            return {
                ...state, polls: action.payload
            }
        default:
            return state;
    }
}

export default profileReducer;


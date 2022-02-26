import { ADD_PROFILE, ADD_FRIEND, ADD_POLL } from './types';

export const addProfile = (profile) => (
    {
        type: ADD_PROFILE,
        payload: profile
    }
);

export const addFriend = (friends) => (
    {
        type: ADD_FRIEND,
        payload: friends
    }
);

export const addpoll = (polls) => (
    {
        type: ADD_POLL,
        payload: polls
    }
);

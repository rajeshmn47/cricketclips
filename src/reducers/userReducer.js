import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOAD_USER_REQUEST,
    LOAD_USER_SUCCESS,
    LOAD_USER_FAIL,
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    CLEAR_ERRORS
} from '../constants/userConstants';

const initialState = {
    loading: false,
    user: null,
    error: null,
};

export const userLoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case LOGIN_FAIL:
            return { ...state, loading: false, user: null, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

export const userLoadReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_USER_REQUEST:
            return { ...state, loading: true, error: null };
        case LOAD_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case LOAD_USER_FAIL:
            return { ...state, loading: false, user: null, error: action.payload };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};

// Register reducer (no OTP)
const registerInitialState = {
    loading: false,
    success: false,
    message: null,
    error: null,
};

export const userRegisterReducer = (state = registerInitialState, action) => {
    switch (action.type) {
        case REGISTER_USER_REQUEST:
            return { ...state, loading: true, error: null, success: false };
        case REGISTER_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                message: action.payload,
                error: null,
            };
        case REGISTER_USER_FAIL:
            return {
                ...state,
                loading: false,
                success: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return { ...state, error: null };
        default:
            return state;
    }
};
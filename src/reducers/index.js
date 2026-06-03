import { combineReducers } from 'redux';
import { userLoadReducer, userLoginReducer, userRegisterReducer } from './userReducer';

const rootReducer = combineReducers({
  userLogin: userLoginReducer,
  userRegister: userRegisterReducer,
  user: userLoadReducer
});

export default rootReducer;

import * as actionTypes from './actionTypes';
import axios from 'axios';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  }
}

export const authSuccess = (authData) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken: authData.idToken,
    userId: authData.localId
  }
}

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  }
}

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('userId');
  return {
    type: actionTypes.AUTH_LOGOUT
  }
}

export const checkAuthTimeout = (expirationTime) => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  }
}

export const auth = (email, password, isSignUp) => {
  return dispatch => {
    dispatch(authStart());
    const authData = {
      email: email,
      password: password,
      returnSecureToken: true
    }
    const url = isSignUp 
      ? 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?'
      : 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?'
    axios.post(url + 'key=AIzaSyBL1OSL1COd67QiNXw5JQbgaB3axAmgpLE', authData)
      .then(response => {
        console.log(response);
        const exporationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', exporationDate);
        localStorage.setItem('userId', response.data.localId);
        dispatch(authSuccess(response.data));
        dispatch(checkAuthTimeout(response.data.expiresIn));
      })
      .catch(err => {
        console.log(err.response.data.error);
        dispatch(authFail(err.response.data.error));
      })
  }
}

export const setAuthRedirectPath = (path) => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path: path
  }
}

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch(logout());
    } else {
      const userId = localStorage.getItem('userId');
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate < new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess({idToken: token, localId: userId}));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  }
}
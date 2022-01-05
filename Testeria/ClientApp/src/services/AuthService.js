import axios from 'axios';
import swal from "sweetalert";
import { BASE_URL } from '../constance';
import {
    loginConfirmedAction,
    logout,
} from '../store/actions/AuthActions';

export function signUp(userName, email, password) {
    //axios call

    const postData = {
        userName,
        email,
        password,
        returnSecureToken: true,
    };

    return axios.post(
        `${BASE_URL}/api/account/register`,
        postData,
    );
}

export function login(email, password) {
    const postData = {
        email,
        password,
        returnSecureToken: true,
    };

    return axios.post(
        `${BASE_URL}/api/account/login`,
        postData,
    );
}

export function formatError(errorResponse) {
    
    if (errorResponse.includes('EMAIL_EXISTS')) {
        swal("Oops", "Email already exists", "error");
        return;
    } else if (errorResponse.includes('USERNAME_EXISTS')) {
        swal("Oops", "User name already exists", "error");
        return;
    } else if (errorResponse.includes('EMAIL_NOT_EXISTS')) {
        swal("Oops", "Email not found", "error", { button: "Try Again!", });
        return;
    } else if (errorResponse.includes('INVALID_PASSWORD')) {
        swal("Oops", "Invalid Password", "error", { button: "Try Again!", });
        return;
    } else {
        swal("Oops", "Has something wrong", "error", { button: "Try Again!", });
    }
}

export function saveTokenInLocalStorage(tokenDetails) {
    tokenDetails.expireDate = new Date(
        new Date().getTime() + 3600 * 10,
    );
    localStorage.setItem('testeriaUserDetail', JSON.stringify(tokenDetails));
}

export function runLogoutTimer(dispatch, timer, history) {
    setTimeout(() => {
        dispatch(logout(history));
    }, timer);
}

export function checkAutoLogin(dispatch, history) {
    const tokenDetailsString = localStorage.getItem('testeriaUserDetail');
    let tokenDetails = '';

    if (!tokenDetailsString) {
        dispatch(logout(history));
        return;
    }

    tokenDetails = JSON.parse(tokenDetailsString);
    let expireDate = new Date(tokenDetails.expireDate);
    let todaysDate = new Date();

    if (todaysDate > expireDate) {
        dispatch(logout(history));
        return;
    }
    dispatch(loginConfirmedAction(tokenDetails));

    const timer = expireDate.getTime() - todaysDate.getTime();
    runLogoutTimer(dispatch, timer, history);
}

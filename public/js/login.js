/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    // Posting email and password to server
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email, /// Here we can simply ommit the last email
        password, /// Here we can simply ommit the last password
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/logout',
    });

    if (res.data.status === 'success') {
      window.setTimeout(() => {
        location.reload(true);
      }, 1000);
      location.assign('/');
    }
  } catch (error) {
    showAlert('error', 'Error logging out! Try again.');
  }
};

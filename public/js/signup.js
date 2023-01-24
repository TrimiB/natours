/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts';

export const signUp = async (name, email, password, passwordConfirm) => {
  try {
    // Posting email and password to server
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Created account successfully!');
      window.setTimeout(() => {
        location.assign('/me');
      }, 2000);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};

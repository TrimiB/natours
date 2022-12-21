import axios from 'axios';
import { showAlert } from './alerts';

/// updating data through our API
export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateMe',
      data: {
        name: name, /// Here we can simply ommit the last name
        email: email, /// Here we can simply ommit the last email
      },
    });

    // console.log(res);

    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
    }
  } catch (error) {
    // console.log(error);
    showAlert('error', error.response.data.message);
  }
};

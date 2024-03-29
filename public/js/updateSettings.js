import axios from 'axios';
import { showAlert } from './alerts';

/// updating data through our API
///// type is eather 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url: url,
      data: data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      // console.log(res.data.data.user.photo);
    }
  } catch (error) {
    // console.log(error);
    showAlert('error', error.response.data.message);
  }
};

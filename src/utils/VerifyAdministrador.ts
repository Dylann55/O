import Router from 'next/router';
import { ReadRequest } from './CRUD';

const VerifyUser = async (): Promise<void> => {
  try {
    const url = process.env.NEXT_PUBLIC_MIDDLE_URL + '/users/data/checkAdmin';
    const access_token = localStorage.getItem('access_token_Request');

    if (access_token) {
      const config = {
        access_token: access_token,
      };

      const response = await ReadRequest(url, config);
      if (!response || response.error) {
        Router.push('/Organization/MyOrganizations');
      }

    } else {
      Router.push('/Organization/MyOrganizations');
    }
  } catch (error) {
    Router.push('/Organization/MyOrganizations');
  }
};

export default VerifyUser;

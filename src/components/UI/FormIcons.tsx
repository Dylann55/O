/* eslint-disable no-console */
import { FaGoogle, FaLinkedin } from 'react-icons/fa';

import { fetchDataWithConfig } from '@/utils/Fetch';

const SocialButtons = () => {
  const signInWithGoogle = async () => {
    const config = {
      method: 'GET',
    };

    try {
      const url = `${process.env.NEXT_PUBLIC_MIDDLE_URL}/auth/signinWithGoogle`;
      const data = await fetchDataWithConfig(url, config);
      window.location.replace(data.result.data.url);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  const signInWithLinkedIn = async () => {
    const config = {
      method: 'GET',
    };

    try {
      const url = `${process.env.NEXT_PUBLIC_MIDDLE_URL}/auth/signinWithLinkedin`;
      const data = await fetchDataWithConfig(url, config);
      window.location.replace(data.result.data.url);
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <button
        onClick={() => signInWithGoogle()}
        className="inline-block rounded bg-indigo-600 px-16 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500 sm:px-8"
      >
        <FaGoogle className="text-white" size={32} />
      </button>
      <button
        onClick={() => signInWithLinkedIn()}
        className="inline-block rounded bg-indigo-600 px-16 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500 sm:px-8"
      >
        <FaLinkedin className="text-white" size={32} />
      </button>
    </div>
  );
};

export default SocialButtons;

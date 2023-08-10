/* eslint-disable no-console */
import { FaGoogle, FaLinkedin } from 'react-icons/fa';

import { fetchDataWithConfig } from '@/utils/Fetch';
import CustomButton from '../Widgets/Button/CustomButton';

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
    <div className='w-96'>
      <div className="flex flex-row justify-center items-center gap-2">
        <div className="flex-1">
          <CustomButton onClick={() => signInWithGoogle()} type="button"
            color="indigo"
            padding_x="0"
            padding_smx="0"
            padding_mdx="0"
            padding_y="2.5"
            width="full"
            height="10"
          >
            <FaGoogle size={24} />
          </CustomButton>
        </div>
        <div className="flex-1">
          <CustomButton onClick={() => signInWithLinkedIn()} type="button"
            color="indigo"
            padding_x="0"
            padding_smx="0"
            padding_mdx="0"
            padding_y="2.5"
            width="full"
            height="10"
          >
            <FaLinkedin size={24} />
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default SocialButtons;

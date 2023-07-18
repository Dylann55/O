import { FaGoogle, FaLinkedin, FaGithub } from 'react-icons/fa';

const SocialButtons = () => {

  const signInWithGoogle = () => {
    console.log(`Botón activo:`);
  };

  const signInWithGithub = () => {
    console.log(`Botón activo:`);
  };

  const signInWithLinkedIn = () => {
    console.log(`Botón activo:`);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
      <button
        onClick={() => signInWithGoogle()}
        className="inline-block rounded bg-indigo-600 px-16 sm:px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
      >
        <FaGoogle className="text-white" size={32} />
      </button>
      <button
        onClick={() => signInWithLinkedIn()}
        className="inline-block rounded bg-indigo-600 px-16 sm:px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
      >
        <FaLinkedin className="text-white" size={32} />
      </button>
      <button
        onClick={() => signInWithGithub()}
        className="inline-block rounded bg-indigo-600 px-16 sm:px-8 py-3 text-sm font-medium text-white transition hover:scale-110 hover:shadow-xl focus:outline-none focus:ring active:bg-indigo-500"
      >
        <FaGithub className="text-white" size={32} />
      </button>
    </div>
  );
};

export default SocialButtons;

import { FC } from 'react';
import ConnectMetaMask from '../components/ConnectMetaMask'; // Assurez-vous que le chemin est correct

const HomePage: FC = () => {
  return (
    <main>
      <h1>Decentralized 2FA</h1>
      <ConnectMetaMask />
    </main>
  );
};

export default HomePage;

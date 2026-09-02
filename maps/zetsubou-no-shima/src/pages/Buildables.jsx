import React from 'react';
import Shield from '../components/Buildables/Shield';
import GasMask from '../components/Buildables/GasMask';
import KT4 from '../components/Buildables/KT4';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import '../styles/Buildables.css';

const Buildables = () => {
  return (
    <>
      <Header />
      <main className="buildables-wrapper">
        <BackButton />
        <h1 className="buildables-title">🛠️ Buildable Parts Guide</h1>
        <p className="buildables-intro">
          Each buildable includes all part locations and where to craft it in Zetsubou No Shima.
        </p>

        <Shield />
        <GasMask />
        <KT4 />
      </main>
      <Footer />
    </>
  );
};

export default Buildables;

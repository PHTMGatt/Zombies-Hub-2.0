import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const CogOne = () => {
  return (
    <>
      <Header />
      <main className="guide-page">
        <section className="guide-section">
          <h2 className="guide-title">Cog 1 – Anywhere But Here! Room</h2>
          <p>
            Use the <strong>Anywhere But Here!</strong> GobbleGum after unlocking the elevator panel to teleport into a hidden room above Lab A.
          </p>
          <p>
            Inside the room, pick up the cog from the floor. You can exit by teleporting again or dropping through the wall.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CogOne;

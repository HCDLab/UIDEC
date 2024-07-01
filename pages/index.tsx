import React from 'react';
import { useRouter } from 'next/router';
import styles from './style.module.css';

const DesignInspirationPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const images = [
    'url1.jpg',
    'url2.jpg',
    'url3.jpg',
    'url4.jpg',
  ];

  const getRandomImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    return images[randomIndex];
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.subtitle}>Inspiration</div>
        <div className={styles.title}>Design Inspiration</div>
      </header>
      <main className={styles.main}>
        <aside className={styles.sidebar}>
          <div className={styles.optionsBox}>
            <h3>Options</h3>
            <p>Display options</p>
            {/* Add more options*/}
          </div>
          <div className={styles.signUpOrLoginBox}>
            <h2>Sign up or Login</h2>
            <p>Get inspired by generating beautiful & creative designs</p>
            <button className={styles.button} onClick={() => handleNavigation('/signup')}>
              Sign up
            </button>
            <button className={styles.button} onClick={() => handleNavigation('/signin')}>
              Log in
            </button>
          </div>
        </aside>
        <section className={styles.content}>
          <div className={styles.boxLarge} style={{ backgroundImage: `url(${getRandomImage()})` }}></div>
          <div className={styles.boxSmall} style={{ backgroundImage: `url(${getRandomImage()})` }}></div>
          <div className={styles.boxSmall} style={{ backgroundImage: `url(${getRandomImage()})` }}></div>
          <div className={styles.boxLarge} style={{ backgroundImage: `url(${getRandomImage()})` }}></div>
        </section>
      </main>
    </div>
  );
};

export default DesignInspirationPage;

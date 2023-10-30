import React from "react";
import Head from "next/head";
import styles from './page.module.css';

const HomePage: React.FC = () => {
  return (
    <div>
      <Head>
        <title>Navbar Example</title>
        {/* Boxicons CDN for the icons you're using */}
        <link
          rel='stylesheet'
          href='https://cdnjs.cloudflare.com/ajax/libs/boxicons/2.1.2/css/boxicons.min.css'
        />
      </Head>

      {/* Your Navbar */}
      <nav className={styles.nav}>
        <ul className={styles.nav__links}>
          <li className='nav__links active'>
            <a href='#'>
              <i className='bx bx-home-alt-2'></i>
            </a>
          </li>
          <div className='nav__light'></div>
        </ul>
      </nav>

      {/* Main content of the page */}
      <main>
        <section>
          <h1>Welcome to My Next.js Website</h1>
          <p>This is a simple Next.js webpage with a navbar at the top. You can add more content below.</p>
        </section>
      </main>

      {/* Footer (optional) */}
      <footer>
        <p>© 2023 Your Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

import Link from 'next/link';
import React from 'react';


type HeaderProps = {
  onBackClick?: () => void;
};

const Header: React.FC<HeaderProps> = ({ onBackClick }) => {
  return (
    <div className='header'>
   <Link href={'/'}>
        <button
          className='backButton'
          onClick={onBackClick}
        >
          ←
        </button>
      </Link>
      <span className='title'>Experimental WebScraper V1</span>
    </div>
  );
};

export default Header;

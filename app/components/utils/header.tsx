type HeaderProps = {
    onBackClick?: () => void;
  };
  
  const Header: React.FC<HeaderProps> = ({ onBackClick }) => {
    return (
      <div className='header'>
        {onBackClick && (
          <button
            className='backButton'
            onClick={onBackClick}
          >
            ←
          </button>
        )}
        <span className='title'>Experimental WebScraper V1</span>
      </div>
    );
  };
  
  export default Header;
  
import "./globals.css";
import type { NextPage } from "next";

type RootLayoutProps = {
  children: React.ReactNode;
  onBackClick?: () => void;
};

const RootLayout: NextPage<RootLayoutProps> = ({ children, onBackClick }) => {
  return (
    <html lang='en'>
      <body>
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
        {children}
      </body>
    </html>
  );
};

export default RootLayout;

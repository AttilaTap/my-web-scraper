import "./globals.css";
import type { NextPage } from "next";
import Header from "./components/utils/header";

type RootLayoutProps = {
  children: React.ReactNode;
  onBackClick?: () => void;
};

const RootLayout: NextPage<RootLayoutProps> = ({ children, onBackClick }) => {
  console.log("RootLayout rendered");

  return (
    <html lang="en">
      <body>
        <div className='rootLayoutContainer'>
          <Header onBackClick={onBackClick} />
          {children}
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
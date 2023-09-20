import React from 'react';
import ButtonComponent from './components/utils/button-service';


const Dashboard: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <div>
        <ButtonComponent route="/bookScraper" name="BookScraper" />
        <ButtonComponent route="/9gagScraper" name="9gagScraper" />
        <ButtonComponent route="/page3" name="Page 3" />
        <ButtonComponent route="/page4" name="Page 4" />
      </div>
    </div>
  );
};

export default Dashboard;

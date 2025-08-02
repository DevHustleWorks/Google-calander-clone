import React from 'react';
import CalendarHeader from './CalendarHeader';
import Sidebar from './Sidebar';
import CalendarBox from './CalendarGrid';
import ButtonWithDropdown from './ButtonWithDropdown';
import { CalendarContext } from '../providers/CalendarProvider';
import "../assets/animate.css";

export default function CalendarUI() {

  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const calendar = React.useContext(CalendarContext);
  const { loading } = calendar;
  //   

  React.useEffect(() => {
    if (window.innerWidth < 760) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <>
      {loading && <div className="loading-bar loading-bar--active"></div>}

      <CalendarHeader handelMenuChange={
        () => setSidebarOpen(prev => !prev)
      } />

      <div className='flex h-[calc(100vh-4.5rem)]'>
        <ButtonWithDropdown sidebarOpen={!sidebarOpen} />
        <Sidebar isSidebarOpen={sidebarOpen} />
        {!loading && <CalendarBox
          isSidebarOpen={sidebarOpen}
        />}
      </div>
    </>
  );
} 

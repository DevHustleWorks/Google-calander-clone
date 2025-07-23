import { Calendar } from 'lucide-react';
import React from 'react';
import CalendarHeader from './components/CalendarHeader';
import Sidebar from './components/Sidebar';
import CalendarBox from './components/CalendarGrid';
import ButtonWithDropdown from './components/ButtonWithDropdown';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  React.useEffect(() => {
    if (window.innerWidth < 760) {
      setSidebarOpen(false);
    }
  }, []);

  return (
    <div className="">
      <CalendarHeader handelMenuChange={
        () => setSidebarOpen(prev => !prev)
      } />
      <div className='flex h-[calc(100vh-4.5rem)]'>
        <ButtonWithDropdown sidebarOpen={!sidebarOpen} />
        <Sidebar isSidebarOpen={sidebarOpen} />
        <CalendarBox
          isSidebarOpen={sidebarOpen}
          gridStyle={
            { display: 'grid', gridTemplateColumns: '1.5rem 1fr' }
          } 
        />
      </div>
      {/* Your calendar grid, sidebar, etc. */}
    </div>
  );
}

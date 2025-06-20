import { Calendar } from 'lucide-react';
import React from 'react';
import CalendarHeader from './components/CalendarHeader';
import Sidebar from './components/Sidebar';
import CalendarBox from './components/CalendarGrid';
export default function App() {
  return (
    <div className="">
      <CalendarHeader />
      <div className='flex h-[calc(100vh-4.5rem)]'>
        <Sidebar />
        <CalendarBox
        
          gridStyle={
            { display: 'grid', gridTemplateColumns: '1.5rem 1fr' }
          } 
        />
      </div>
      {/* Your calendar grid, sidebar, etc. */}
    </div>
  );
}

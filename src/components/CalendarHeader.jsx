import {
  Menu,
  CalendarDays,
  Check,
  Search,
  HelpCircle,
  Settings,
  Grid,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  User,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useCalendar } from '../providers/CalendarProvider';
// Add this above the component to inject a custom style for max-w-415px
const customStyle = `
  @media (max-width: 415px) {
    .hide-under-415 { display: none !important; }
  }
`;

function ViewDropdown({ currentView, setView }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const views = [
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
    { label: 'Schedule', value: 'schedule' },
    { label: '4 days', value: '4days' },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  const currentLabel = views.find(v => v.value === currentView)?.label || 'Month';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-300 rounded-full text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        type="button"
      >
        {currentLabel}
        <ChevronDown className="w-4 h-4 ml-1 text-gray-500" />
      </button>
      {open && (
        <ul
          className="absolute right-0 z-20 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm z-9999999999999"
          role="listbox"
        >
          {views.map((view) => (
            <li
              key={view.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${currentView === view.value ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-800'}`}
              onClick={() => {
                setView(view.value);
                setOpen(false);
              }}
              role="option"
              aria-selected={currentView === view.value}
            >
              {view.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ProfileButton() {
  return (
    <UserButton />
  );
}

function SearchBar({ onClose }) {
  return (
    <div className="w-full flex items-center gap-3 px-4 py-2 bg-gray-50 border-b border-gray-200">
      <div className='w-full flex items-center gap-3 '>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium">Search</span>
        <div className="flex items-center border border-gray-300 rounded-full px-3 py-1.5 ml-4 w-full max-w-xl bg-white">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="ml-2 flex-1 bg-transparent outline-none text-sm"
          />
        </div>
      </div>
      <div className='flex items-center gap-2'>
        <button className="p-2 rounded hover:bg-gray-100">
          <HelpCircle className="w-5 h-5" />
        </button>
        <ProfileButton />
      </div>
    </div>
  )
}

export default function CalendarHeader({ gridStyle, handelMenuChange }) {
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);
  const [currentView, setView] = useState('month');
  
  const { goToNextMonth, goToPrevMonth, goToToday, currentDate } = useCalendar();
  
  return (
    <>
      <style>{customStyle}</style>
      {searchBoxOpen ? (
        <SearchBar onClose={() => setSearchBoxOpen(false)} />
      ) : (
        <header
          style={{ ...gridStyle }}
          className="w-full flex items-center justify-between px-2 sm:px-4 py-2 bg-white border-b border-gray-200"
        >
          {/* Left Section */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={handelMenuChange}>
              <Menu className="w-5 h-5" />
            </button>
            <img
              src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_18_2x.png"
              alt="Calendar"
              className="w-8 h-8"
            />
            <span className="hidden sm:inline text-base sm:text-xl font-normal ml-1">Calendar</span>
            <button onClick={goToToday} className="ml-2 sm:ml-4 px-3 py-1 sm:px-5 sm:py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100 hide-under-415">
              Today
            </button>
            <div className="flex items-center gap-1 ml-1 hide-under-415">
              <button onClick={goToPrevMonth}  className="p-2 rounded-full hover:bg-gray-100">
                <ArrowLeft  className="w-4 h-4" />
              </button>
              <button onClick={goToNextMonth} className="p-2 rounded-full hover:bg-gray-100">
                <ArrowRight  className="w-4 h-4" />
              </button>
            </div>
            <div className="ml-2 text-base sm:text-lg font-medium whitespace-nowrap">{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
          </div>

          {/* Center Section: (empty, or add flex-1 for spacing) */}
          <div className="flex-1" />

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center gap-1 sm:gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => setSearchBoxOpen(true)}>
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <ViewDropdown currentView={currentView} setView={setView} />
              <ProfileButton />
            </div>
            {/* Mobile: Only show settings and profile */}
            <div className="flex md:hidden items-center gap-1">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
              <ProfileButton />
            </div>
          </div>
        </header>
      )}
    </>
  )
}

import {
  Menu,
  CalendarDays,
  Check,
  Search,
  HelpCircle,
  Settings,
  Grid,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react';
import ButtonWithDropdown from './ButtonWithDropdown';
export default function CalendarHeader({ gridStyle, handelMenuChange }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);

  return (
    <>
      {searchBoxOpen ? (
        <>
          <SearchBar onClose={() => setSearchBoxOpen(false)} />
        </>
      ) : (
        <>
          <div  style={{ ...gridStyle }} className="w-full flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded hover:bg-gray-100" onClick={handelMenuChange}>
                <Menu className="w-5 h-5" />
              </button>

              <img
                src="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_18_2x.png"
                alt="Calendar"
                className="w-8 h-8"
              />
              <h1 className="text-xl font-normal">Calendar</h1>

              <button className="ml-4 px-5 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100">
                Today
              </button>

              <div className="flex items-center gap-1 ml-2">
                <button className="p-2 rounded hover:bg-gray-100">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>
                <button className="p-2 rounded hover:bg-gray-100">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </button>
              </div>
              <div className="ml-2 text-lg font-medium">April 2025</div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <button className="p-2 rounded hover:bg-gray-100" onClick={() => setSearchBoxOpen(true)}>
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="p-2 rounded hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">

                {/* Month Dropdown */}
                <button className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100">
                  Month
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Toggle Button Group */}
                <div className="flex border border-gray-300 rounded-full overflow-hidden">
                  <button className="flex items-center justify-center px-5 py-2 bg-blue-100 text-blue-700 hover:bg-gray-100">
                    <CalendarDays className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center px-5 py-2 hover:bg-gray-100">
                    <Check className="w-4 h-4" />
                  </button>
                </div>

              </div>

              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold cursor-pointer">
                S
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
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
        {/* <ButtonWithDropdown sidebarOpen={true} /> */}
        <button className="p-2 rounded hover:bg-gray-100">
          <HelpCircle className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center font-semibold cursor-pointer">
          S
        </div>
      </div>
    </div>
  )
}

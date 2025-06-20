import React, { useState } from 'react'
import { Plus, ChevronDown, Calendar, Check, AlarmClock } from 'lucide-react'
export default function ButtonWithDropdown({ sidebarOpen }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block">
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100"
      >
        {sidebarOpen
          ? <Plus className="w-4 h-4" />
          : (
            <>
              <Plus className="w-4 h-4" />
              <span className="text-sm font-medium">Create</span>
              <ChevronDown className="w-4 h-4" />
            </>
          )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1 text-sm text-gray-700">
            <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Calendar className="w-4 h-4" /> Event
            </li>
            <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <Check className="w-4 h-4" /> Task
            </li>
            <li className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <AlarmClock className="w-4 h-4" /> Appointment
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

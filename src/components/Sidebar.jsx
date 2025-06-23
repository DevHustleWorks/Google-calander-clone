import ButtonWithDropdown from "./ButtonWithDropdown";
import MiniCalendar from "./Minicalender";

export default function Sidebar({gridStyle, isSidebarOpen}) {
  return (
    <div style={{...gridStyle, transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",  transition: "all 0.3s ease-in-out", }} className="w-64 bg-white  p-4 space-y-4 text-sm text-gray-800 fixed h-full pt-12">
      {/* Create Button */}
      
      {/* Calendar */}
      <MiniCalendar CalanderPrevMonth={() => {}} CalanderNextMonth={() => {}} />

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search for people"
          className="w-full px-2 py-1 border rounded text-sm"
        />
      </div>

      {/* My Calendars */}
      <div>
        <div className="flex justify-between items-center cursor-pointer">
          <span className="font-semibold">My calendars</span>
          <span className="text-lg">⌄</span>
        </div>
        <ul className="mt-2 space-y-1">
          {[
            { name: "sankalp kumar", color: "bg-cyan-500" },
            { name: "Birthdays", color: "bg-green-500" },
            { name: "taks calader", color: "bg-orange-500" },
            { name: "Tasks", color: "bg-blue-500" },
            { name: "work", color: "bg-indigo-500" },
          ].map((item, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span className={`h-3 w-3 ${item.color} rounded-sm`}></span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Other Calendars */}
      <div>
        <div className="flex justify-between items-center cursor-pointer">
          <span className="font-semibold">Other calendars</span>
          <span className="text-lg">＋</span>
        </div>
        <ul className="mt-2 space-y-1">
          <li className="flex items-center gap-2">
            <input type="checkbox" defaultChecked />
            <span className="h-3 w-3 bg-purple-500 rounded-sm"></span>
            <span>Holidays in India</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

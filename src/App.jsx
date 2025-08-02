import React, { useContext, useState } from 'react';
import { CalendarFn } from './lib/CalenderFn/lib.calendar';
import CalendarUI from './components/CalendarUI';
import { CalendarProvider } from './providers/CalendarProvider';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/clerk-react'


export default function App() {
  // const [sidebarOpen, setSidebarOpen] = React.useState(true);
  // const [calendar, setCalendar] = useState(null);
  const { user, isSignedIn } = useUser();
  const [userDetails, setUserDetails] = useState(null);

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
          <nav className="px-4 py-3 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-blue-600">Calendar Pro</h1>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-all">
                Sign In
              </button>
            </SignInButton>
          </nav>

          <div className="container mx-auto px-6 py-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-gray-800 leading-tight">
                  Organize Your Time<br />
                  <span className="text-blue-600">Like Never Before</span>
                </h2>
                <p className="text-base text-gray-600">
                  Seamlessly manage your schedule, set reminders, and boost your productivity
                  with our intuitive calendar solution.
                </p>
                <div className="space-x-4">
                  <SignInButton mode="modal">
                    <button className="px-6 py-2 bg-blue-600 text-white text-base font-medium rounded-lg 
                      hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                      Get Started Free
                    </button>
                  </SignInButton>
                </div>
              </div>

              {/* Calendar Preview */}
              <div className="relative">
                <div className="bg-white p-6 rounded-2xl shadow-2xl">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <div key={day} className="text-center text-gray-600 font-medium">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {[...Array(31)].map((_, i) => (
                      <div key={i} className="aspect-square flex items-center justify-center 
                        rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                        <span className="text-gray-700">{i + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -z-10 -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute -z-10 -bottom-4 -left-4 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
      <SignedIn>
        <CalendarProvider user={
          (user && isSignedIn) ? {
            id: user.id,
            fullName: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
            imageUrl: user.imageUrl,
            username: user.fullName,
            createdAt: user.createdAt
          } : null
        }>
          <CalendarUI />
        </CalendarProvider>
      </SignedIn>
    </>
  );
}

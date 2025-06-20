import React from 'react';
import { ChevronLeft, ChevronRight, } from 'lucide-react';
import { useState } from 'react';
import { dateFns } from '../lib/datefns';
const clsx = (...classes) => classes.filter(Boolean).join(' ');
export default function MiniCalendar({ CalanderPrevMonth, CalanderNextMonth }) {
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
  const days = [
    23, 1, 2, 3, 4, 5, 6, 7,
    24, 8, 9, 10, 11, 12, 13, 14,
    25, 15, 16, 17, 18, 19, 20, 21,
    26, 22, 23, 24, 25, 26, 27, 28,
    27, 29, 30, 1, 2, 3, 4, 5,
    28, 6, 7, 8, 9, 10, 11, 12,
  ];

  return (
    <div className='bg-white p-2 rounded-lg'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-md font-normal capitalize'>June 2025</h2>
        <button className='p-1 rounded cursor-pointer flex items-center gap-3'>
          <ChevronLeft onClick={CalanderPrevMonth} className='w-5 h-5 bg-gray-100 rounded-lg p-1' />
          <ChevronRight onClick={CalanderNextMonth} className='w-5 h-5 bg-gray-100 rounded-lg p-1' />
        </button>
      </div>
      <div className='grid grid-cols-8'>
        {
          [null, ...weekDays].map((_, idx) => (
            <div key={idx} className='flex items-center justify-center text-center gap-3 text-xs font-semibold text-gray-500'>
              {_ === null ? "" : _}
            </div>
          ))
        }
        {
          days.map((day, idx) => (
            <span key={idx} className={clsx('w-[22px] h-[22px] text-[9px] flex items-center justify-center text-center',
              idx % 8 === 0 ? 'bg-gray-100' : '',
              idx % 8 === 1 ? 'text-red-500' : '',
              idx === 19 ? 'py-0 px-0 bg-blue-500 text-white font-semibold rounded-full' : ''
            )}>
              {day}
            </span>
          ))
        }
      </div>

    </div>
  );
}

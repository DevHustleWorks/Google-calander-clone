import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Users, Bell, Repeat, Palette } from 'lucide-react';
import { Event } from '../lib/CalenderFn/lib.calendar';

const AddEventDialog = ({ open, onClose, selectedDate, onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    startTime: '09:00',
    endTime: '10:00',
    isAllDay: false,
    colorId: 'default',
    visibility: 'default',
    reminders: [],
    attendees: []
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('event');

  const colorOptions = [
    { id: 'default', name: 'Default', color: 'bg-blue-500' },
    { id: 'red', name: 'Red', color: 'bg-red-500' },
    { id: 'green', name: 'Green', color: 'bg-green-500' },
    { id: 'purple', name: 'Purple', color: 'bg-purple-500' },
    { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
    { id: 'pink', name: 'Pink', color: 'bg-pink-500' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.isAllDay) {
      if (!formData.startTime) {
        newErrors.startTime = 'Start time is required';
      }
      if (!formData.endTime) {
        newErrors.endTime = 'End time is required';
      }
      
      // Check if end time is after start time
      if (formData.startTime && formData.endTime) {
        const start = new Date(`2000-01-01T${formData.startTime}`);
        const end = new Date(`2000-01-01T${formData.endTime}`);
        if (end <= start) {
          newErrors.endTime = 'End time must be greater than start time';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Create start and end dates
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      
      if (!formData.isAllDay) {
        const [startHour, startMinute] = formData.startTime.split(':');
        const [endHour, endMinute] = formData.endTime.split(':');
        
        startDate.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);
        endDate.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);
      } else {
        // All day event - set to start of day and end of day
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
      }

      // Create new event using the Event class
      const newEvent = new Event({
        title: formData.title,
        desc: formData.description,
        loc: formData.location,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        colorId: formData.colorId,
        visibility: formData.visibility,
        reminders: formData.reminders,
        attendees: formData.attendees
      });

      // Store the event
      newEvent.store();

      // Reset form
      setFormData({
        title: '',
        description: '',
        location: '',
        startTime: '09:00',
        endTime: '10:00',
        isAllDay: false,
        colorId: 'default',
        visibility: 'default',
        reminders: [],
        attendees: []
      });

      // Close dialog and notify parent
      onEventAdded(newEvent);
      onClose();
      
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startTime: '09:00',
      endTime: '10:00',
      isAllDay: false,
      colorId: 'default',
      visibility: 'default',
      reminders: [],
      attendees: []
    });
    setErrors({});
    onClose();
  };

  if (!open) return null;

  const formattedDate = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center ">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">Add title and time</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('event')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'event' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Event
          </button>
          <button
            onClick={() => setActiveTab('task')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'task' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Task
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Input - Focused like Google Calendar */}
          <div className="mb-6">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full text-xl font-medium border-none outline-none focus:ring-0 placeholder-gray-400 ${
                errors.title ? 'border-b-2 border-red-500' : 'border-b border-gray-300'
              }`}
              placeholder="Add title"
              autoFocus
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Date and Time Section */}
          <div className="space-y-3">
            {/* Date Display */}
            <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Clock className="w-5 h-5 text-gray-500" />
              <div className="flex-1">
                <p className="text-sm text-gray-900">{formattedDate}</p>
                <p className="text-sm text-gray-500">Does not repeat</p>
              </div>
              <button
                type="button"
                className="px-3 py-1 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                Add time
              </button>
            </div>

            {/* Time Selection (when Add time is clicked) */}
            {!formData.isAllDay && (
              <div className="ml-8 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => handleInputChange('endTime', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={formData.isAllDay}
                    onChange={(e) => handleInputChange('isAllDay', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="allDay" className="ml-2 text-sm text-gray-700">
                    All day
                  </label>
                </div>
              </div>
            )}

            {/* Additional Options */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Add guests</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-sm"></div>
                </div>
                <span className="text-sm text-gray-600">Add Google Meet video conferencing</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Add location</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className="w-5 h-5 text-gray-500">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                  </svg>
                </div>
                <span className="text-sm text-gray-600">Add description or a Google Drive attachment</span>
              </div>
            </div>
          </div>

          {/* Calendar Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-900">sankalp kumar</span>
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-500">Free • Default visibility • Notify the day before at 5pm</span>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            More options
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEventDialog; 

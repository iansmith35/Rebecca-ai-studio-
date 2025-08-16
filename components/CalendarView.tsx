import React from 'react';
import { isheCalendarEvents } from '../data/mockData';
import { CalendarEvent } from '../types';

const jobTypeColors: { [key: string]: string } = {
    'Boiler Service': 'bg-sky-600 hover:bg-sky-500',
    'Gas Safety Certificate': 'bg-teal-600 hover:bg-teal-500',
    'Leaky Pipe Repair': 'bg-rose-600 hover:bg-rose-500',
    'Boiler Replacement Quote': 'bg-amber-600 hover:bg-amber-500',
};

const EventCard: React.FC<{ event: CalendarEvent }> = ({ event }) => {
    const startTime = event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const endTime = event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

    return (
        <div className={`p-3 rounded-lg text-white transition-colors cursor-pointer ${jobTypeColors[event.jobType] || 'bg-gray-600'}`}>
            <p className="font-bold text-sm">{event.title}</p>
            <p className="text-xs opacity-80">{event.customer}</p>
            <p className="text-xs mt-1 opacity-90">{startTime} - {endTime}</p>
        </div>
    );
}

export const CalendarView: React.FC = () => {
    // For simplicity, this is a static view of a few days.
    // A real implementation would use a calendar library.
    const days = [
        { name: 'Monday', date: 29, events: isheCalendarEvents.filter(e => e.start.getDate() === 29) },
        { name: 'Tuesday', date: 30, events: isheCalendarEvents.filter(e => e.start.getDate() === 30) },
        { name: 'Wednesday', date: 31, events: isheCalendarEvents.filter(e => e.start.getDate() === 31) },
        { name: 'Thursday', date: 1, events: isheCalendarEvents.filter(e => e.start.getDate() === 1) },
        { name: 'Friday', date: 2, events: isheCalendarEvents.filter(e => e.start.getDate() === 2) },
    ];

    return (
        <div className="p-6 h-full text-gray-200">
             <h1 className="text-xl font-bold text-white mb-6">ISHE Weekly Schedule</h1>
             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 h-full">
                {days.map(day => (
                    <div key={day.name} className="bg-gray-900/50 rounded-lg p-4 flex flex-col">
                        <div className="flex items-baseline mb-4">
                            <h2 className="font-semibold text-white">{day.name}</h2>
                            <p className="text-gray-400 ml-2 text-sm">July {day.date}</p>
                        </div>
                        <div className="space-y-3 overflow-y-auto">
                            {day.events.length > 0 ? (
                                day.events.map(event => <EventCard key={event.id} event={event} />)
                            ) : (
                                <p className="text-sm text-gray-500 italic mt-2">No jobs booked.</p>
                            )}
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

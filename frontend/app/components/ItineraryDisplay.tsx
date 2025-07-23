import React from 'react';

interface Activity {
  time: string;
  title: string;
  description: string;
  booking_needed: boolean;
  estimated_cost?: string;
}

interface DayPlan {
  day: number;
  date: string;
  theme: string;
  activities: Activity[];
}

interface Itinerary {
  tripTitle: string;
  summary: string;
  daily_plan: DayPlan[];
}

interface Props {
  itinerary: Itinerary;
}

export default function ItineraryDisplay({ itinerary }: Props) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-2">{itinerary.tripTitle}</h2>
      <p className="mb-6 text-gray-700">{itinerary.summary}</p>
      <div className="space-y-6">
        {itinerary.daily_plan.map(day => (
          <div key={day.day} className="bg-blue-50 rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-lg mb-2">
              Day {day.day} ({day.date}): <span className="text-blue-700">{day.theme}</span>
            </h3>
            <ul className="space-y-2">
              {day.activities.map((act, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="font-medium text-blue-600 w-20">{act.time}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{act.title}</span>
                      {act.booking_needed && (
                        <span title="Booking needed" className="text-yellow-500">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                          </svg>
                        </span>
                      )}
                      {act.estimated_cost && (
                        <span className="ml-2 text-xs text-green-600">({act.estimated_cost})</span>
                      )}
                    </div>
                    <div className="text-gray-700 text-sm">{act.description}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 
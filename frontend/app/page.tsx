'use client';

import React, { useState } from 'react';
import ItineraryDisplay from './components/ItineraryDisplay';

type Itinerary = {
  tripTitle: string;
  summary: string;
  daily_plan: {
    day: number;
    date: string;
    theme: string;
    activities: {
      time: string;
      title: string;
      description: string;
      booking_needed: boolean;
      estimated_cost?: string;
    }[];
  }[];
};

export default function Page() {
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [budget, setBudget] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setItinerary(null);

    try {
      const res = await fetch('https://29a9c99bg6.execute-api.us-east-1.amazonaws.com/trips', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          userId: 'user123', // You might want to implement proper user authentication
          destination, 
          dates, 
          budget, 
          travelStyle 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.itinerary) {
        setItinerary(data.itinerary);
      } else if (data.result) {
        // Parse the AI result for day sections
        const daySections = [];
        const regex = /(Day \d+:|Your Trip Plan:)([\s\S]*?)(?=Day \d+:|Your Trip Plan:|$)/g;
        let match;
        while ((match = regex.exec(data.result)) !== null) {
          daySections.push({
            heading: match[1].replace(':', ''),
            content: match[2].trim(),
          });
        }
        if (daySections.length > 0) {
          // Join date lines if they look like year/month/day
          const joinDateLines = (lines: string[]) => {
            const dateRegex = /^\d{4}$/;
            const monthRegex = /^\d{2}$/;
            const dayRegex = /^\d{2}$/;
            const result: string[] = [];
            for (let i = 0; i < lines.length; i++) {
              if (
                dateRegex.test(lines[i]) &&
                monthRegex.test(lines[i + 1] || "") &&
                dayRegex.test(lines[i + 2] || "")
              ) {
                result.push(`${lines[i]}-${lines[i + 1]}-${lines[i + 2]}`);
                i += 2;
              } else {
                result.push(lines[i]);
              }
            }
            return result;
          };
          setItinerary({
            tripTitle: "AI Trip Plan",
            summary: "",
            daily_plan: daySections.map((section, idx) => {
              const lines = section.content.split(/\n|•|\-/).filter(Boolean).map((l: string) => l.trim());
              const formattedLines = joinDateLines(lines);
              return {
                day: idx + 1,
                date: "",
                theme: section.heading,
                activities: formattedLines.map((line: string) => ({
                  time: "",
                  title: "",
                  description: line,
                  booking_needed: false,
                })),
              };
            }),
          });
        } else {
          const lines = data.result.split(/\n|•|\-/).filter(Boolean).map((l: string) => l.trim());
          const joinDateLines = (lines: string[]) => {
            const dateRegex = /^\d{4}$/;
            const monthRegex = /^\d{2}$/;
            const dayRegex = /^\d{2}$/;
            const result: string[] = [];
            for (let i = 0; i < lines.length; i++) {
              if (
                dateRegex.test(lines[i]) &&
                monthRegex.test(lines[i + 1] || "") &&
                dayRegex.test(lines[i + 2] || "")
              ) {
                result.push(`${lines[i]}-${lines[i + 1]}-${lines[i + 2]}`);
                i += 2;
              } else {
                result.push(lines[i]);
              }
            }
            return result;
          };
          const formattedLines = joinDateLines(lines);
          setItinerary({
            tripTitle: "AI Trip Plan",
            summary: "",
            daily_plan: [
              {
                day: 1,
                date: "",
                theme: "Your Trip Plan",
                activities: formattedLines.map((line: string) => ({
                  time: "",
                  title: "",
                  description: line,
                  booking_needed: false,
                })),
              },
            ],
          });
        }
      } else {
        throw new Error('No itinerary or result data received from the server');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-pink-200 to-yellow-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">AI Trip Planner</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          </div>
        ) : itinerary ? (
          <div className="space-y-6">
            <button
              onClick={() => setItinerary(null)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
            >
              ← Create New Trip
            </button>
            <ItineraryDisplay itinerary={itinerary} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <input
                  id="destination"
                  type="text"
                  placeholder="e.g., Tokyo, Japan"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="dates" className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Dates
                </label>
                <input
                  id="dates"
                  type="text"
                  placeholder="e.g., 2024-07-01 to 2024-07-07"
                  value={dates}
                  onChange={e => setDates(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget
                </label>
                <input
                  id="budget"
                  type="text"
                  placeholder="e.g., $2000"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="travelStyle" className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Style
                </label>
                <input
                  id="travelStyle"
                  type="text"
                  placeholder="e.g., Adventure, Relaxation, Foodie"
                  value={travelStyle}
                  onChange={e => setTravelStyle(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Generate Trip Plan
            </button>
          </form>
        )}
      </div>
    </div>
  );
} 
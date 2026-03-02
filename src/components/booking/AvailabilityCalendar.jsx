import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isBefore, startOfDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export default function AvailabilityCalendar({
    initialDate = new Date(),
    blockedDates = [],
    onSelectRange,
    selectedRange = { from: null, to: null }
}) {
    const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialDate));

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const isDateBlocked = (date) => {
        return blockedDates.some(bd => isSameDay(new Date(bd), date));
    };

    const isPast = (date) => {
        return isBefore(date, startOfDay(new Date()));
    };

    const handleDateClick = (date) => {
        if (isDateBlocked(date) || isPast(date)) return;

        if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
            onSelectRange({ from: date, to: null });
        } else if (selectedRange.from && !selectedRange.to) {
            if (isBefore(date, selectedRange.from)) {
                onSelectRange({ from: date, to: null });
            } else {
                onSelectRange({ from: selectedRange.from, to: date });
            }
        }
    };

    const isDateInRange = (date) => {
        if (!selectedRange.from || !selectedRange.to) return false;
        return (date >= selectedRange.from && date <= selectedRange.to);
    };

    return (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{format(currentMonth, 'MMMM yyyy')}</h3>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="h-9 w-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-3">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
                {daysInMonth.map((date) => {
                    const blocked = isDateBlocked(date);
                    const past = isPast(date);
                    const isSelected = isSameDay(date, selectedRange.from) || isSameDay(date, selectedRange.to);
                    const inRange = isDateInRange(date);
                    const isToday = isSameDay(date, new Date());

                    return (
                        <div
                            key={date.toString()}
                            onClick={() => handleDateClick(date)}
                            className={cn(
                                "h-11 w-full flex items-center justify-center text-sm transition-all relative group cursor-pointer",
                                !isSameMonth(date, currentMonth) ? "text-gray-300 dark:text-gray-700 pointer-events-none" :
                                    blocked ? "text-gray-300 dark:text-gray-700 line-through cursor-not-allowed" :
                                        past ? "text-gray-300 dark:text-gray-700 cursor-not-allowed" :
                                            inRange ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" :
                                                "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
                                isSelected && "bg-blue-600 !text-white rounded-lg z-10",
                                isSameDay(date, selectedRange.from) && selectedRange.to && "rounded-r-none",
                                isSameDay(date, selectedRange.to) && "rounded-l-none"
                            )}
                        >
                            <span className={cn(
                                "z-10",
                                isToday && !isSelected && "underline decoration-blue-500 decoration-2 underline-offset-4 font-bold"
                            )}>
                                {format(date, 'd')}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-6 text-[11px] text-gray-500 justify-center">
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div> Selected
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-50 dark:bg-blue-900/20"></div> Range
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-200 dark:bg-gray-700"></div> Unavailable
                </div>
            </div>
        </div>
    );
}


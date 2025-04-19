import React from 'react';
import { FiClock } from 'react-icons/fi';

function ProgressBar({ currentStep, totalSteps, type, timeRemaining, pointsEarned, totalPoints }) {
    const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
    const isKunuz = type === 'Kunuz';

    return (
        <div className="px-4 py-2 bg-gray-50 border-t border-b border-gray-200">
            <div className="flex items-center justify-between mb-1 text-xs font-medium text-gray-600">
                <span>Progress: {currentStep}/{totalSteps} Steps</span>
                {isKunuz && pointsEarned !== undefined && (
                    <span>Points: {pointsEarned} / {totalPoints}</span>
                )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-2.5 rounded-full transition-all duration-300 ease-linear ${isKunuz ? 'bg-cyan-600' : 'bg-teal-600'}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            {isKunuz && timeRemaining && (
                <div className="flex items-center justify-center mt-1.5 text-xs text-red-600 font-medium">
                    <FiClock size={12} className="mr-1" />
                    <span>Time Remaining: {timeRemaining}</span> {/* Format time as needed */}
                </div>
            )}
        </div>
    );
}

export default ProgressBar;
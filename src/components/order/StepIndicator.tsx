'use client';

import React from 'react';
import { CheckCircle, CircleDot, Circle } from 'lucide-react';

interface StepConfig {
  id: string;
  name: string;
}

interface StepIndicatorProps {
  steps: StepConfig[];
  currentStepId: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStepId }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);

  return (
    <nav aria-label="Progress" className="mb-8 md:mb-12">
      <ol role="list" className="flex flex-col md:flex-row md:items-start md:space-x-4">
        {steps.map((step, stepIdx) => {
          const isCompleted = stepIdx < currentStepIndex;
          const isCurrent = stepIdx === currentStepIndex;

          return (
            <li key={step.id} className="relative md:flex-1 pb-10 md:pb-0">
              <div className="flex items-center space-x-3 group">
                <span
                  className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full transition-all duration-300
                    ${isCompleted ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30' 
                        : isCurrent ? 'border-2 border-indigo-600 bg-white shadow-lg shadow-indigo-500/30' 
                        : 'border-2 border-gray-300 bg-gray-100 group-hover:border-gray-400'}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  ) : isCurrent ? (
                    <CircleDot className="h-5 w-5 md:h-6 md:w-6 text-indigo-600 animate-pulse" />
                  ) : (
                    <Circle className="h-5 w-5 md:h-6 md:w-6 text-gray-400 group-hover:text-gray-500 transition-colors" />
                  )}
                </span>
                <span
                  className={`text-sm md:text-base font-semibold transition-colors duration-300
                    ${isCompleted ? 'text-indigo-600' 
                        : isCurrent ? 'text-indigo-700' 
                        : 'text-gray-500 group-hover:text-gray-700'}
                  `}
                >
                  {step.name}
                </span>
              </div>

              {/* Connector line - not for the last step */}
              {stepIdx < steps.length - 1 && (
                <div
                  className={`absolute left-4 md:left-[2.5rem] lg:left-[2.75rem] top-10 md:top-5 h-full md:h-0.5 w-0.5 md:w-[calc(100%_+_1rem)] transition-colors duration-300 -z-10
                  ${isCompleted ? 'bg-indigo-600' : 'bg-gray-300'}
                  `}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default StepIndicator; 
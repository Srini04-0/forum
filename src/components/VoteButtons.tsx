import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface VoteButtonsProps {
  votes: number;
  onUpvote: () => void;
  onDownvote: () => void;
  orientation?: 'vertical' | 'horizontal';
}

export const VoteButtons: React.FC<VoteButtonsProps> = ({
  votes,
  onUpvote,
  onDownvote,
  orientation = 'vertical'
}) => {
  const containerClass = orientation === 'vertical' 
    ? 'flex flex-col items-center space-y-1'
    : 'flex items-center space-x-2';

  return (
    <div className={containerClass}>
      <button
        onClick={onUpvote}
        className="p-1 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
      
      <span className={`font-medium text-sm ${votes > 0 ? 'text-green-600' : votes < 0 ? 'text-red-600' : 'text-gray-600'}`}>
        {votes}
      </span>
      
      <button
        onClick={onDownvote}
        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  );
};
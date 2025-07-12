import React from 'react';
import { Question } from '../types';
import { VoteButtons } from './VoteButtons';
import { MessageCircle, Eye, Clock } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  onQuestionClick: (id: string) => void;
  onVote: (questionId: string, delta: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onQuestionClick,
  onVote
}) => {
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex space-x-4">
        {/* Vote buttons */}
        <div className="flex-shrink-0">
          <VoteButtons
            votes={question.votes}
            onUpvote={() => onVote(question.id, 1)}
            onDownvote={() => onVote(question.id, -1)}
          />
        </div>

        {/* Question content */}
        <div className="flex-1 min-w-0">
          <h3 
            className="text-lg font-semibold text-gray-900 hover:text-blue-600 cursor-pointer mb-2"
            onClick={() => onQuestionClick(question.id)}
          >
            {question.title}
          </h3>
          
          <div 
            className="text-gray-600 text-sm mb-3 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: question.description.substring(0, 150) + '...' }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Stats and metadata */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">{question.answers.length} answers</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{question.views} views</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>asked {formatTimeAgo(question.createdAt)} by {question.author}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
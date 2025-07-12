import React from 'react';
import { Question, SortOption, PaginationInfo } from '../types';
import { QuestionCard } from './QuestionCard';
import { FilterDropdown } from './FilterDropdown';
import { Pagination } from './Pagination';

interface QuestionListProps {
  questions: Question[];
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  showUnanswered: boolean;
  onUnansweredChange: (show: boolean) => void;
  onQuestionClick: (id: string) => void;
  onVote: (questionId: string, delta: number) => void;
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  sortBy,
  onSortChange,
  showUnanswered,
  onUnansweredChange,
  onQuestionClick,
  onVote,
  pagination,
  onPageChange
}) => {

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          All Questions
          <span className="ml-2 text-base font-normal text-gray-500">
            ({pagination.totalItems} questions)
          </span>
        </h1>

        <FilterDropdown
          sortBy={sortBy}
          onSortChange={onSortChange}
          showUnanswered={showUnanswered}
          onUnansweredChange={onUnansweredChange}
        />
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {showUnanswered ? 'No unanswered questions found.' : 'No questions found. Be the first to ask!'}
            </p>
          </div>
        ) : (
          questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onQuestionClick={onQuestionClick}
              onVote={onVote}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <Pagination
        pagination={pagination}
        onPageChange={onPageChange}
      />
    </div>
  );
};
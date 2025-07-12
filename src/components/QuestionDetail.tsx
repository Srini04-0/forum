import React, { useState } from 'react';
import { Question, Answer } from '../types';
import { VoteButtons } from './VoteButtons';
import { Clock, MessageCircle, Send, Eye } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import { RichTextEditor } from './RichTextEditor';

interface QuestionDetailProps {
  question: Question;
  onBack: () => void;
  onVoteQuestion: (delta: number) => void;
  onVoteAnswer: (answerId: string, delta: number) => void;
  onAddAnswer: (content: string) => void;
  user: { name: string } | null;
}

export const QuestionDetail: React.FC<QuestionDetailProps> = ({
  question,
  onBack,
  onVoteQuestion,
  onVoteAnswer,
  onAddAnswer,
  user
}) => {
  const [answerContent, setAnswerContent] = useState('');

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

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) {
      alert('Please write an answer');
      return;
    }
    
    if (!user) {
      alert('Please sign in to post an answer');
      return;
    }
    
    if (answerContent.trim() && user) {
      onAddAnswer(answerContent.trim());
      setAnswerContent('');
    }
  };

  const sortedAnswers = [...question.answers].sort((a, b) => b.votes - a.votes);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Questions', onClick: onBack },
          { label: question.title.length > 50 ? question.title.substring(0, 50) + '...' : question.title }
        ]}
      />

      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex space-x-4">
          <div className="flex-shrink-0">
            <VoteButtons
              votes={question.votes}
              onUpvote={() => onVoteQuestion(1)}
              onDownvote={() => onVoteQuestion(-1)}
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {question.title}
            </h1>

            <div className="prose prose-sm max-w-none mb-4 text-gray-700">
              <div dangerouslySetInnerHTML={{ __html: question.description }} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Question metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{question.answers.length} answers</span>
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

      {/* Answers header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
      </div>

      {/* Answers */}
      <div className="space-y-4 mb-8">
        {sortedAnswers.map((answer) => (
          <div key={answer.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <VoteButtons
                  votes={answer.votes}
                  onUpvote={() => onVoteAnswer(answer.id, 1)}
                  onDownvote={() => onVoteAnswer(answer.id, -1)}
                />
              </div>

              <div className="flex-1">
                <div className="prose prose-sm max-w-none mb-4 text-gray-700">
                  <div dangerouslySetInnerHTML={{ __html: answer.content }} />
                </div>

                <div className="flex items-center justify-end text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>answered {formatTimeAgo(answer.createdAt)} by {answer.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {question.answers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No answers yet. Be the first to answer!
          </div>
        )}
      </div>

      {/* Add answer form */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
        
        {!user && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800">
              Please set your name in the header before posting an answer.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmitAnswer}>
          <RichTextEditor
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Write your answer here..."
          />
          
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={!answerContent.trim() || !user}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4 mr-1" />
              Submit Your Answer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
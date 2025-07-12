import React, { useState, useEffect } from 'react';
import { Question, Answer, User, SortOption, PaginationInfo } from './types';
import { Header } from './components/Header';
import { QuestionList } from './components/QuestionList';
import { QuestionDetail } from './components/QuestionDetail';
import { AskQuestion } from './components/AskQuestion';
import { UserModal } from './components/UserModal';
import { LoginModal } from './components/LoginModal';
import { 
  loadQuestions, 
  saveQuestions, 
  loadUser, 
  saveUser, 
  generateId 
} from './utils/storage';

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showUnanswered, setShowUnanswered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Load data on mount
  useEffect(() => {
    setQuestions(loadQuestions());
    setUser(loadUser());
  }, []);

  // Save questions when they change
  useEffect(() => {
    if (questions.length > 0) {
      saveQuestions(questions);
    }
  }, [questions]);

  // Filter and sort questions
  const filteredQuestions = questions
    .filter(q => 
      (q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       q.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
       q.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (!showUnanswered || q.answers.length === 0)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return b.votes - a.votes;
        case 'answers':
          return b.answers.length - a.answers.length;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Pagination
  const totalItems = filteredQuestions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedQuestions = filteredQuestions.slice(startIndex, startIndex + itemsPerPage);

  const pagination: PaginationInfo = {
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems
  };

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy, showUnanswered]);

  const handleAskQuestion = (title: string, description: string, tags: string[]) => {
    if (!user) return;

    const newQuestion: Question = {
      id: generateId(),
      title,
      description,
      tags,
      author: user.name,
      createdAt: new Date().toISOString(),
      votes: 0,
      answers: [],
      views: 0
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setCurrentView('home');
  };

  const handleQuestionClick = (id: string) => {
    // Increment view count
    setQuestions(prev => prev.map(q => 
      q.id === id ? { ...q, views: q.views + 1 } : q
    ));
    
    setSelectedQuestionId(id);
    setCurrentView('question');
  };

  const handleVoteQuestion = (questionId: string, delta: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, votes: q.votes + delta } : q
    ));
  };

  const handleVoteAnswer = (questionId: string, answerId: string, delta: number) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? {
            ...q,
            answers: q.answers.map(a => 
              a.id === answerId ? { ...a, votes: a.votes + delta } : a
            )
          }
        : q
    ));
  };

  const handleAddAnswer = (questionId: string, content: string) => {
    if (!user) return;

    const newAnswer: Answer = {
      id: generateId(),
      questionId,
      content,
      author: user.name,
      createdAt: new Date().toISOString(),
      votes: 0
    };

    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, answers: [...q.answers, newAnswer] }
        : q
    ));
  };

  const handleUserSave = (name: string) => {
    const newUser = { name, isLoggedIn: true };
    setUser(newUser);
    saveUser(newUser);
  };

  const handleLogin = (email: string, name: string) => {
    const newUser = { name, email, isLoggedIn: true };
    setUser(newUser);
    saveUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('stackit_user');
  };
  const selectedQuestion = selectedQuestionId 
    ? questions.find(q => q.id === selectedQuestionId)
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        user={user}
        onUserClick={() => user?.isLoggedIn ? setUserModalOpen(true) : setLoginModalOpen(true)}
        onLoginClick={() => setLoginModalOpen(true)}
        onLogoutClick={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        {currentView === 'home' && (
          <QuestionList
            questions={paginatedQuestions}
            sortBy={sortBy}
            onSortChange={setSortBy}
            showUnanswered={showUnanswered}
            onUnansweredChange={setShowUnanswered}
            onQuestionClick={handleQuestionClick}
            onVote={handleVoteQuestion}
            pagination={pagination}
            onPageChange={setCurrentPage}
          />
        )}

        {currentView === 'ask' && (
          <AskQuestion
            onSubmit={handleAskQuestion}
            onBack={() => setCurrentView('home')}
            user={user}
          />
        )}

        {currentView === 'question' && selectedQuestion && (
          <QuestionDetail
            question={selectedQuestion}
            onBack={() => setCurrentView('home')}
            onVoteQuestion={(delta) => handleVoteQuestion(selectedQuestion.id, delta)}
            onVoteAnswer={(answerId, delta) => handleVoteAnswer(selectedQuestion.id, answerId, delta)}
            onAddAnswer={(content) => handleAddAnswer(selectedQuestion.id, content)}
            user={user}
          />
        )}
      </main>

      <UserModal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        currentUser={user}
        onSave={handleUserSave}
      />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
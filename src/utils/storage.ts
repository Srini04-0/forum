import { Question, Answer, User } from '../types';

const QUESTIONS_KEY = 'stackit_questions';
const USER_KEY = 'stackit_user';

export const saveQuestions = (questions: Question[]): void => {
  localStorage.setItem(QUESTIONS_KEY, JSON.stringify(questions));
};

export const loadQuestions = (): Question[] => {
  const stored = localStorage.getItem(QUESTIONS_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Return sample data if no stored questions
  return [
    {
      id: '1',
      title: 'How do I center a div in CSS?',
      description: 'I\'ve been trying to center a div both horizontally and vertically for hours. What\'s the best modern approach using CSS?',
      tags: ['css', 'html', 'frontend'],
      author: 'WebDevNewbie',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      votes: 5,
      views: 23,
      answers: [
        {
          id: '1',
          questionId: '1',
          content: 'The most modern and flexible approach is using CSS Flexbox:\n\n```css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n}\n```\n\nThis works reliably across all modern browsers.',
          author: 'CSSExpert',
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          votes: 8
        }
      ]
    },
    {
      id: '2',
      title: 'What\'s the difference between React hooks and class components?',
      description: 'I\'m learning React and confused about when to use hooks vs class components. Can someone explain the key differences and modern best practices?',
      tags: ['react', 'javascript', 'hooks'],
      author: 'ReactLearner',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      votes: 12,
      views: 45,
      answers: []
    }
  ];
};

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const loadUser = (): User | null => {
  const stored = localStorage.getItem(USER_KEY);
  const user = stored ? JSON.parse(stored) : null;
  return user ? { ...user, isLoggedIn: true } : null;
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
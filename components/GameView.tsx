
import React, { useState, useEffect, useCallback } from 'react';
import { MathQuestion } from '../types';
import { generateMathQuestions } from '../services/geminiService';
import Spinner from './shared/Spinner';
import { GAME_QUESTIONS_COUNT } from '../constants';

interface GameViewProps {
  grade: number;
  onGameFinish: (score: number) => void;
}

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

const GameView: React.FC<GameViewProps> = ({ grade, onGameFinish }) => {
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [answerStatus, setAnswerStatus] = useState<AnswerStatus>('unanswered');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        const fetchedQuestions = await generateMathQuestions(grade);
        setQuestions(fetchedQuestions);
        setError(null);
      } catch (err) {
        setError("Failed to load questions. Please try again in a moment.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [grade]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
      setAnswerStatus('unanswered');
    } else {
      const finalScore = Math.round((score / questions.length) * 100);
      onGameFinish(finalScore);
    }
  }, [currentQuestionIndex, questions.length, score, onGameFinish]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerStatus !== 'unanswered' || !userAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = Number(userAnswer) === currentQuestion.answer;

    if (isCorrect) {
      setScore(score + 1);
      setAnswerStatus('correct');
    } else {
      setAnswerStatus('incorrect');
    }

    setTimeout(() => {
      handleNextQuestion();
    }, 1500); // Wait 1.5 seconds to show feedback
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-brand-primary text-white p-4">
        <Spinner />
        <p className="mt-4 text-lg">Generating your questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-100 text-red-700 p-4">
        <p className="text-xl font-bold">Oops!</p>
        <p>{error}</p>
        <button onClick={() => onGameFinish(0)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Go Back</button>
      </div>
    );
  }
    
  if (questions.length === 0) {
      return <div>No questions available.</div>
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const getBackgroundColor = () => {
    if (answerStatus === 'correct') return 'bg-green-500';
    if (answerStatus === 'incorrect') return 'bg-red-500';
    return 'bg-brand-primary';
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-8 text-white transition-colors duration-500 ${getBackgroundColor()}`}>
      <header>
        <div className="flex justify-between items-center text-lg font-semibold">
          <span>Score: {score}</span>
          <span>Question: {currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full bg-white bg-opacity-30 rounded-full h-2.5 mt-2">
          <div className="bg-white h-2.5 rounded-full" style={{ width: `${progressPercentage}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
      </header>
      
      <main className="flex flex-col items-center justify-center flex-grow text-center">
        {answerStatus === 'correct' && <h2 className="text-5xl font-bold mb-8">Correct! 🎉</h2>}
        {answerStatus === 'incorrect' && (
            <div className="mb-8">
                <h2 className="text-5xl font-bold">Not Quite...</h2>
                <p className="text-2xl mt-2">The answer was: {currentQuestion.answer}</p>
            </div>
        )}
        {answerStatus === 'unanswered' && (
            <>
                <p className="text-2xl md:text-3xl text-gray-200 mb-4">What is...</p>
                <p className="text-6xl md:text-8xl font-bold tracking-tighter" style={{fontFamily: "'Inter', sans-serif"}}>
                    {currentQuestion.question}
                </p>
            </>
        )}
      </main>

      <form onSubmit={handleSubmit} className="mt-auto">
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type your answer..."
          disabled={answerStatus !== 'unanswered'}
          className="w-full text-center text-4xl p-4 rounded-lg bg-white bg-opacity-20 border-2 border-transparent focus:border-white focus:outline-none placeholder-gray-300 transition disabled:opacity-50"
          autoFocus
        />
        <button
          type="submit"
          disabled={answerStatus !== 'unanswered' || !userAnswer}
          className="w-full mt-4 py-4 bg-white text-brand-primary font-bold text-xl rounded-lg shadow-lg hover:bg-gray-200 disabled:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default GameView;

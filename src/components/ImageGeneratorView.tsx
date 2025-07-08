import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import Spinner from './shared/Spinner';

interface ImageGeneratorViewProps {
  onBack: () => void;
}

const ImageGeneratorView: React.FC<ImageGeneratorViewProps> = ({ onBack }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description for the image.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    try {
      const imageBytes = await generateImage(prompt);
      setGeneratedImage(imageBytes);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">AI Image Playground</h1>
            <p className="text-gray-500">Turn your imagination into images!</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-white text-brand-primary font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition"
          >
            &larr; Back to Dashboard
          </button>
        </header>

        <main className="bg-white p-6 rounded-xl shadow-md space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-1">
              Describe the image you want to create:
            </label>
            <textarea
              id="prompt"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A friendly robot playing chess with a squirrel in a park"
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary text-gray-900"
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full px-8 py-3 bg-brand-primary text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 text-lg"
          >
            {isLoading ? 'Generating...' : '✨ Generate Image'}
          </button>

          <div className="mt-6 min-h-[300px] flex items-center justify-center bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300">
            {isLoading && <Spinner />}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {generatedImage && (
              <img
                src={`data:image/jpeg;base64,${generatedImage}`}
                alt={prompt}
                className="rounded-lg shadow-lg max-w-full max-h-[512px]"
              />
            )}
            {!isLoading && !error && !generatedImage && (
              <p className="text-gray-400 text-center">Your generated image will appear here.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ImageGeneratorView;

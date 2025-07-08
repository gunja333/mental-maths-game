import React from 'react';

const APIKeyChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const apiKey = import.meta.env.VITE_API_KEY;

  if (!apiKey) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8 border-t-8 border-red-500">
          <h1 className="text-3xl font-bold text-red-800">Configuration Error</h1>
          <p className="mt-4 text-gray-700 text-lg">
            This application is not properly configured. The Gemini API Key required to generate math questions is missing.
          </p>
          <p className="mt-4 text-gray-600">
            If you are the administrator of this application, please follow these steps to resolve the issue:
          </p>
          <div className="mt-6 bg-gray-50 p-6 rounded-lg border border-gray-200 text-sm">
            <ol className="list-decimal list-inside space-y-4">
              <li>
                <span className="font-semibold">Log in to your Netlify account.</span>
              </li>
              <li>
                Navigate to your site's dashboard (<span className="font-mono bg-gray-200 px-1 rounded">sparkly-stardust-61ff3d</span>).
              </li>
              <li>
                Go to <span className="font-semibold">Site configuration</span> &rarr; <span className="font-semibold">Environment variables</span>.
              </li>
              <li>
                Click <span className="font-semibold">"Add a variable"</span> and create a new variable with the following details:
                <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li><strong>Key:</strong> <code className="bg-gray-200 px-1 rounded">VITE_API_KEY</code></li>
                    <li><strong>Value:</strong> Paste your Gemini API Key here.</li>
                </ul>
              </li>
              <li>
                After adding the variable, you must <span className="font-semibold">re-deploy your site</span>. Go to the "Deploys" tab and trigger a new deploy by selecting "Clear cache and deploy site".
              </li>
            </ol>
          </div>
           <p className="mt-6 text-xs text-gray-500">
            Your students will not be able to access the game until this is resolved.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default APIKeyChecker;
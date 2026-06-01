import React, { useState, useEffect } from 'react';
import { generateVideo, checkVeoKeyStatus, requestVeoKeySelection } from '../services/gemini';
import { Button } from './ui/Button';
import { TextArea } from './ui/Input';

export const TextToVideo = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasPaidKey, setHasPaidKey] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    checkKeyStatus();
  }, []);

  const checkKeyStatus = async () => {
    try {
      const status = await checkVeoKeyStatus();
      setHasPaidKey(status);
    } catch (e) {
      console.warn("Failed to check API key status", e);
    }
  };

  const handleKeySelection = async () => {
    try {
      await requestVeoKeySelection();
      setHasPaidKey(true);
    } catch (e) {
      console.error(e);
      setError("Failed to open key selection dialog.");
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!hasPaidKey) {
      await handleKeySelection();
      return; 
    }

    setIsLoading(true);
    setError(null);
    setStatusMessage('INITIALIZING VEO MODEL...');

    try {
      setStatusMessage('DREAMING FRAMES (THIS MAY TAKE A MINUTE)...');
      
      const videoUrl = await generateVideo({
        prompt,
        aspectRatio: '16:9',
        resolution: '720p'
      });
      
      onGenerate(videoUrl, 'video');
    } catch (err) {
      if (err.message && err.message.includes('Requested entity was not found')) {
         setHasPaidKey(false);
         setError("Authorization failed. Please select a valid paid API key.");
      } else {
        setError(err.message || 'Failed to generate video');
      }
    } finally {
      setIsLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="p-4 lg:p-6 relative">
      {!hasPaidKey ? (
        <div className="py-8 px-4 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Unlock Veo Studio</h3>
            <p className="text-gray-400 text-xs max-w-xs mx-auto leading-relaxed mt-2">
              Video generation requires a paid billing account.
            </p>
          </div>
          <Button onClick={handleKeySelection} variant="primary">
            Connect Account
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <TextArea
            label="Video Description"
            placeholder="A cinematic drone shot of a cyberpunk city in rain..."
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {statusMessage && (
            <div className="flex items-center gap-3 text-xs text-cyan-300 bg-cyan-950/30 p-3 rounded-xl border border-cyan-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="font-mono uppercase tracking-wider">{statusMessage}</span>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={handleGenerate} 
            isLoading={isLoading} 
            disabled={!prompt.trim()}
            className="w-full"
          >
            {isLoading ? 'Rendering...' : 'Generate Video'}
          </Button>
        </div>
      )}
    </div>
  );
};
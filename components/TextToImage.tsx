import React, { useState } from 'react';
import { generateImage } from '../services/gemini';
import { Button } from './ui/Button';
import { TextArea } from './ui/Input';

export const TextToImage = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generateImage({
        prompt,
        aspectRatio
      });
      onGenerate(imageUrl, 'image');
    } catch (err) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  const ratios = ["1:1", "3:4", "4:3", "9:16", "16:9"];

  return (
    <div className="p-4 lg:p-6">
      <div className="space-y-6">
        <TextArea
          label="Prompt"
          placeholder="A cyberpunk street in rain, neon lights reflection, 8k..."
          rows={4}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Aspect Ratio</label>
          <div className="grid grid-cols-5 gap-2">
            {ratios.map((r) => (
              <button
                key={r}
                onClick={() => setAspectRatio(r)}
                className={`py-2 rounded-lg text-xs font-bold transition-all border ${
                  aspectRatio === r 
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25' 
                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm backdrop-blur-sm">
            {error}
          </div>
        )}

        <div className="pt-2">
          <Button 
            onClick={handleGenerate} 
            isLoading={isLoading} 
            disabled={!prompt.trim()}
            className="w-full"
            variant="primary"
          >
            {isLoading ? 'Generating...' : 'Generate Art'}
          </Button>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useRef } from 'react';
import { generateImage } from '../services/gemini';
import { Button } from './ui/Button';
import { TextArea } from './ui/Input';

export const ImageToImage = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setError("File size too large. Please select an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const imageUrl = await generateImage({
        prompt,
        aspectRatio,
        baseImage: selectedImage
      });
      onGenerate(imageUrl, 'image');
    } catch (err) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
        <div className="space-y-6">
          <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Source Image</label>
             <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative h-48 border border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${
                  selectedImage 
                    ? 'border-indigo-500/50 bg-black/40' 
                    : 'border-white/10 bg-black/20 hover:border-white/30 hover:bg-black/30'
                }`}
              >
                {selectedImage ? (
                  <>
                    <img src={selectedImage} alt="Reference" className="w-full h-full object-contain p-4 opacity-80 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-white/10">
                         <span className="text-white text-xs font-bold">Replace</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                    <p className="text-gray-300 text-sm font-medium">Upload Image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
          </div>

          <TextArea
            label="Instructions"
            placeholder="Turn day into night, add snow, cybernetic enhancements..."
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          <Button 
            onClick={handleGenerate} 
            isLoading={isLoading} 
            disabled={!prompt.trim() || !selectedImage}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Generate Variation'}
          </Button>
        </div>
    </div>
  );
};
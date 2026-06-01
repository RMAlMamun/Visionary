import { GoogleGenAI } from "@google/genai";

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

// Helper to get a fresh instance (important for Veo key selection updates)
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateImage = async (options: { prompt: string; aspectRatio: string; baseImage?: string }) => {
  const ai = getAIClient();
  const { prompt, aspectRatio, baseImage } = options;

  const parts = [];

  // If baseImage exists, it's Image-to-Image
  if (baseImage) {
    // baseImage should be raw base64 data (without data:image/png;base64 prefix if possible, 
    // but the inlineData accepts it cleaner if we strip the prefix)
    const cleanBase64 = baseImage.split(',')[1] || baseImage;
    let mimeType = 'image/png';
    if (baseImage.includes('data:') && baseImage.includes(';base64,')) {
      mimeType = baseImage.split(';')[0].split(':')[1];
    }
    
    parts.push({
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType
      }
    });
  }

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image', // Standard model for both T2I and I2I
    contents: {
      parts: parts
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
      }
    }
  });

  // Extract image from response
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }

  throw new Error("No image data found in response");
};

export const generateVideo = async (options: { prompt: string; resolution: string; aspectRatio: string }) => {
  const ai = getAIClient();
  
  // Start the operation
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: options.prompt,
    config: {
      numberOfVideos: 1,
      resolution: options.resolution,
      aspectRatio: options.aspectRatio
    }
  });

  // Poll for completion
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
  
  if (!videoUri) {
    throw new Error("Video generation failed: No URI returned.");
  }

  // Fetch the actual video bytes using the key
  const fetchUrl = `${videoUri}&key=${process.env.API_KEY}`;
  const response = await fetch(fetchUrl);
  
  if (!response.ok) {
    throw new Error(`Failed to download video: ${response.statusText}`);
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const checkVeoKeyStatus = async () => {
  if (window.aistudio?.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return true; // Fallback if not running in specific environment, assume env key is fine
};

export const requestVeoKeySelection = async () => {
  if (window.aistudio?.openSelectKey) {
    await window.aistudio.openSelectKey();
  }
};
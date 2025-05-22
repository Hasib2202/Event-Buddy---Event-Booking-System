import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';

declare global {
  interface Window {
    TailwindCSS?: any;
  }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [tailwindLoaded, setTailwindLoaded] = useState(false);

  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://cdn.tailwindcss.com"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tailwindcss.com';
      script.async = true;
      
      script.onload = () => {
        // Add small delay to ensure Tailwind is fully loaded
        setTimeout(() => setTailwindLoaded(true), 100);
      };
      
      document.head.appendChild(script);
    } else {
      setTailwindLoaded(true);
    }

    // Add necessary plugins
    window.TailwindCSS = { plugins: { forms: true, typography: true } };
    
    // Cleanup
    return () => {
      if (existingScript) document.head.removeChild(existingScript);
    };
  }, []);

  if (!tailwindLoaded) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return <Component {...pageProps} />;
}
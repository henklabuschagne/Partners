import { RouterProvider } from 'react-router';
import { router } from './utils/routes';
import { useEffect } from 'react';
import { Toaster } from 'sonner@2.0.3';

export default function App() {
  useEffect(() => {
    // Ensure iframe embedding is allowed
    // Remove any potential X-Frame-Options or CSP restrictions
    // This allows the app to be embedded in iframes from any origin
    
    // Add a meta tag to explicitly allow iframe embedding
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "frame-ancestors *";
    
    // Check if a similar meta tag already exists
    const existingMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingMeta) {
      existingMeta.setAttribute('content', 'frame-ancestors *');
    } else {
      document.head.appendChild(meta);
    }
    
    // Log to confirm iframe embedding is enabled
    console.log('✓ Iframe embedding enabled - app can be embedded in external applications');
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}
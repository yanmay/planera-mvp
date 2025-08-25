import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import mock API service for development (disabled for real API testing)
// if (import.meta.env.DEV) {
//   import('./services/mockApiService.ts')
// }

createRoot(document.getElementById("root")!).render(<App />);

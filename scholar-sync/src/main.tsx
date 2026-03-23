import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Roster } from './pages/Roster';
import { Gradebook } from './pages/Gradebook';
import { Schedule } from './pages/Schedule';
import { Resources } from './pages/Resources';
import { AppProvider } from './context/AppContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/roster",
        element: <Roster />,
      },
      {
        path: "/gradebook",
        element: <Gradebook />,
      },
       {
        path: "/schedule",
        element: <Schedule />,
      },
       {
        path: "/resources",
        element: <Resources />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
        <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
)

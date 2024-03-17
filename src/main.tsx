import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Root, {
  loader as rootLoader,
  action as rootAction,
} from './routes/root';
import Contact, { loader as contactLoader } from './routes/contact';
import Edit, {
  loader as editLoader,
  action as editAction,
} from './routes/edit';
import Error from './error';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <Error />,
    children: [
      {
        path: 'contacts/:contactId',
        element: <Contact />,
        loader: contactLoader,
      },
      {
        path: 'contacts/:contactId/edit',
        element: <Edit />,
        loader: editLoader,
        action: editAction,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormEditor from './components/FormEditor/FormEditor';
import FormViewer from './components/FormViewer/FormViewer';
import HomePage from './components/HomePage/HomePage';
import NotFound from './components/NotFound/NotFound';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/editor" element={<FormEditor />} />
          <Route path="/editor/:id" element={<FormEditor />} />
          <Route path="/form/:id" element={<FormViewer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
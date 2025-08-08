import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import FormEditor from './components/FormEditor/FormEditor';
import FormViewer from './components/FormViewer/FormViewer';
import HomePage from './components/HomePage/HomePage';
import NotFound from './components/NotFound/NotFound';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
}

export default App;
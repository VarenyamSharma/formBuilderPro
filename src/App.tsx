import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FormProvider } from './context/FormContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Home from './components/Home/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import FormBuilder from './components/FormBuilder/FormBuilder';
import PublicForm from './components/PublicForm/PublicForm';
import ResponseView from './components/Responses/ResponseView';
import ShareForm from './components/Share/ShareForm';

function App() {
  return (
    <AuthProvider>
      <FormProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/form/:id" element={<PublicForm />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/forms/create" element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              } />
              
              <Route path="/forms/:id/edit" element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              } />
              
              <Route path="/forms/:id/preview" element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              } />
              
              <Route path="/forms/:id/share" element={
                <ProtectedRoute>
                  <ShareForm />
                </ProtectedRoute>
              } />
              
              <Route path="/forms/:id/responses" element={
                <ProtectedRoute>
                  <ResponseView />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </FormProvider>
    </AuthProvider>
  );
}

export default App;
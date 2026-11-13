import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Scene, { Sheet } from './components/Scene.jsx';
import DesignSystem from './scenes/DesignSystem.jsx';
import { chapters } from './chapters.js';

export default function App() {
  const location = useLocation();
  return (
    <Routes location={location}>
      {chapters.map((ch) => (
        // keyed by path so each page turn mounts a fresh scene and its intro choreography
        <Route key={ch.path} path={ch.path} element={<Scene key={ch.path} chapter={ch} />} />
      ))}
      <Route
        path="/design-system"
        element={<Sheet component={DesignSystem} width={1440} title="Storybook Forest — design system" />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

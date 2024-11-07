import React from 'react';
import ImageViewer from './components/ImageViewer';
import Metrics from './components/Metrics';

function App() {
  const imageId = "id_de_prueba"; // Reemplaza con el ID real

  return (
    <div className="App">
      <h1>Visualizador de Organoides</h1>
      <ImageViewer imageId={imageId} />
      <Metrics imageId={imageId} />
    </div>
  );
}

export default App;

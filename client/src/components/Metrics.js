import React, { useState, useEffect } from 'react';

const Metrics = ({ imageId }) => {
  const [metrics, setMetrics] = useState({
    area: 0,
    contrast: 0,
    brightness: 0
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`http://localhost:5001/metrics/${imageId}`);
        const data = await response.json();
        setMetrics(data);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      }
    };

    fetchMetrics();
  }, [imageId]);

  return (
    <div className="metrics">
      <h3>Métricas del Organoide</h3>
      <ul>
        <li><strong>Área:</strong> {metrics.area} μm²</li>
        <li><strong>Contraste:</strong> {metrics.contrast}</li>
        <li><strong>Brillo:</strong> {metrics.brightness}</li>
      </ul>
    </div>
  );
};

export default Metrics;

import React, { useState, useEffect } from 'react';
import './ImageViewer.css';

const ImageViewer = ({ imageId }) => {
  const [imageData, setImageData] = useState(null);
  const [maskData, setMaskData] = useState(null);

  useEffect(() => {
    const fetchImageAndMask = async () => {
      try {
        const imageResponse = await fetch(`/images/${imageId}`);
        const maskResponse = await fetch(`/masks/${imageId}`);
        
        const imageData = await imageResponse.json();
        const maskData = await maskResponse.json();
        
        setImageData(imageData);
        setMaskData(maskData);
      } catch (error) {
        console.error("Error fetching image or mask:", error);
      }
    };

    fetchImageAndMask();
  }, [imageId]);

  if (!imageData || !maskData) {
    return <div>Cargando imagen y máscara...</div>;
  }

  return (
    <div className="image-viewer">
      <div className="image-layer">
        <img src={imageData.image} alt="Imagen de Organoide" />
        <img src={maskData.mask} alt="Máscara de Organoide" className="mask-layer" />
      </div>
    </div>
  );
};

export default ImageViewer;

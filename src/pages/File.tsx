import FileDropzone from '@/components/Widgets/Imput/FileDropzone';
import React from 'react';

const UploadPage: React.FC = () => {
  const handleFileChange = (file: File | null) => {
    // Aquí puedes realizar acciones con el archivo seleccionado
    console.log('Archivo seleccionado:', file);
  };

  return (
    <div>
      <h1>Subir archivo</h1>
      <FileDropzone onFileChange={handleFileChange} />
    </div>
  );
};

export default UploadPage;

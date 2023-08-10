import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
    onFileChange: (file: File | null) => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({ onFileChange }) => {
    // Función para manejar el evento de "drop" de archivos
    const handleDrop = useCallback(
        (acceptedFiles: File[]) => {
            // Filtrar los archivos para eliminar cualquier valor "undefined"
            const validFiles = acceptedFiles.filter(file => file);

            // Procesar los archivos aceptados (puedes agregar validaciones u otras operaciones aquí)
            if (validFiles.length > 0) {
                // Asignar el primer archivo válido a "fileValue" o "null" si no hay archivos válidos
                const fileValue = validFiles[0] || null;

                // Llamar a la función "onFileChange" y pasarle el archivo seleccionado
                onFileChange(fileValue);
            }
        },
        [onFileChange]
    );

    // Obtener las propiedades necesarias para el área de "dropzone" mediante el hook "useDropzone"
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

    return (
        <div {...getRootProps()} className="flex items-center justify-center w-full">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-24 sm:h-36 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100  text-gray-500 hover:text-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>

                    {/* Renderizar el input que maneja el "dropzone" */}
                    <input {...getInputProps()} className="hidden" />

                    {/* Mostrar un mensaje según el estado de "isDragActive" */}
                    {isDragActive ?
                        <p className="mb-2 text-xs sm:text-sm"><span className='font-semibold'>Arrastra el archivo aquí...</span></p>
                        : <p className="mb-2 text-xs sm:text-sm"><span className='font-semibold'>Arrastra un archivo aquí o haz clic para seleccionarlo.</span></p>}
                </div>
            </label>
        </div>
    );
};

export default FileDropzone;

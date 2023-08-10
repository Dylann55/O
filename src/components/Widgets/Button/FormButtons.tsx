import React from 'react';
import CustomButton from './CustomButton';

interface FormButtonsProps {
    handleSubmit: (event: React.FormEvent) => Promise<void>;
    closeModal: () => void;
    updateId: number | null;
    itemName: string;
}

const FormButtons: React.FC<FormButtonsProps> = ({ handleSubmit, closeModal, updateId, itemName }) => {
    return (
        <div className="flex flex-col items-center gap-1 sm:gap-2 sm:flex-row sm:justify-center">
            <div className="flex-1 w-96 sm:w-52">
                <CustomButton
                    onClick={handleSubmit}
                    type="submit"
                    color="indigo"
                    padding_x="0"
                    padding_smx="0"
                    padding_mdx="0"
                    padding_y="2.5"
                    width="full"
                    height="10"
                >
                    {!updateId && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}

                    {updateId && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                        </svg>
                    )}

                    {updateId ? `Editar ${itemName}` : `Crear ${itemName}`}
                </CustomButton>
            </div>
            <div className="flex-1 w-96 sm:w-52">
                <CustomButton
                    onClick={closeModal}
                    type="button"
                    color="red"
                    padding_x="0"
                    padding_smx="0"
                    padding_mdx="0"
                    padding_y="2.5"
                    width="full"
                    height="10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    Cancelar
                </CustomButton>
            </div>
        </div>
    );
};

export default FormButtons;

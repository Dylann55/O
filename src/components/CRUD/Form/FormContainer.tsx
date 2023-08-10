import React from 'react';
import FormHeader from './FormHeader';
import FormButtons from '@/components/Widgets/Button/FormButtons';

interface FormContainerProps {
    updateId: any | null;
    itemName: string;
    h2Text: string;
    pText: string;
    handleSubmit: (event: React.FormEvent) => Promise<void>;
    closeModal: () => void;
    children: React.ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({
    updateId,
    itemName,
    h2Text, 
    pText,
    handleSubmit,
    closeModal,
    children,
}) => {
    return (
        <div className="mx-auto max-w-screen items-center">
            <form onSubmit={handleSubmit} className="mb-0 space-y-4 rounded-lg p-4 sm:p-6 lg:p-8">
                <FormHeader updateId={updateId} itemName={itemName} h2Text={h2Text} pText={pText} />

                <div className="space-y-1 sm:space-y-2">
                    {children}
                </div>

                <FormButtons handleSubmit={handleSubmit} closeModal={closeModal} updateId={updateId} itemName={itemName} />
            </form>
        </div>
    );
};

export default FormContainer;

import React from 'react';
import { TemplateForm } from './_components/template-form';

const CreateTemplatePage = () => {
  return (
    <div className="w-[40%] m-auto">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Create New Template</h1>
        <TemplateForm />
      </div>
    </div>
  );
};

export default CreateTemplatePage;
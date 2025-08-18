import React from 'react';
import { TemplateForm } from './_components/template-form';
import { TemplatePreview } from './_components/template-preview';

const CreateTemplatePage = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      <div className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">Create New Template</h1>
        <TemplateForm />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Live Preview</h2>
        <TemplatePreview />
      </div>
    </div>
  );
};

export default CreateTemplatePage;
"use client";

import React from 'react';
import { useGetTemplates } from './_hooks/useGetTemplates';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

export default function ChoiceTemplatePage() {
  const { data, isLoading, isError } = useGetTemplates();
  const router = useRouter();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching templates.</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Choose a Template</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.templates.map((template) => (
          <div
            key={template.id}
            className="cursor-pointer"
            onClick={() => router.push(`/create/${template.id}`)}
          >
            <Card>
              <CardHeader>
                <CardTitle>{template.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{template.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TemplatePreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Template Name:</h3>
            <p className="text-muted-foreground">e.g., Space Adventure</p>
          </div>
          <div>
            <h3 className="font-semibold">Description:</h3>
            <p className="text-muted-foreground">A short description of the template.</p>
          </div>
          <div>
            <h3 className="font-semibold">Category:</h3>
            <p className="text-muted-foreground">Adventure</p>
          </div>
          <div>
            <h3 className="font-semibold">Age Group:</h3>
            <p className="text-muted-foreground">6-8 years</p>
          </div>
          <div>
            <h3 className="font-semibold">Structure:</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>Chapter 1: The Launch</li>
              <li>Chapter 2: The Alien Encounter</li>
              <li>Chapter 3: The Homeward Journey</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Sample Prompts:</h3>
            <ul className="list-disc list-inside text-muted-foreground">
              <li>What does the spaceship look like?</li>
              <li>Describe the friendly alien.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
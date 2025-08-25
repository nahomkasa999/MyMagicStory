'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

type ReviewItem = {
  id: string
  icon: IconName
  question: string
  answer: string
}

export default function ReviewSectionFAQ() {
  const reviewItems: ReviewItem[] = [
    {
      id: 'item-1',
      icon: 'star',
      question: 'The story was so beautiful and my daughter loved it. Can I create more books?',
      answer: 'Absolutely! You can create unlimited personalized storybooks, choosing different characters and storylines for each one.',
    },
    {
      id: 'item-2',
      icon: 'star',
      question: 'How high is the quality of illustrations?',
      answer: 'Our AI generates stunning illustrations based on the details you provide, ensuring each book looks professional and magical.',
    },
    {
      id: 'item-3',
      icon: 'star',
      question: 'Is this a good gift for children?',
      answer: 'Yes, personalized storybooks make unique and thoughtful gifts. Children love seeing themselves as the main character.',
    },
  ]

  return (
    <section className="w-[70%] m-auto px-[5%] py-16">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 md:flex-row md:gap-16">
          <div className="md:w-1/3">
            <div className="sticky top-20">
              <h2 className="mt-4 text-4xl font-serif font-bold leading-tight">
                What Our Magical Customers Say
              </h2>
              <p className="text-muted-foreground mt-4">
                Read stories from other parents and creators who made magical books for their children.
              </p>
            </div>
          </div>
          <div className="md:w-2/3">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {reviewItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="bg-background shadow-xs rounded-lg border px-4 last:border-b"
                >
                  <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="flex size-6">
                        <DynamicIcon name={item.icon} className="m-auto size-4 text-foreground" />
                      </div>
                      <span className="text-base text-foreground">{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="px-9">
                      <p className="text-base text-foreground">{item.answer}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}

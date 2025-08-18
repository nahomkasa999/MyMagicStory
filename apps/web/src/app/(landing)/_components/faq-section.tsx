import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion";

type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  heading: string;
  faqItems: FaqItem[];
};

export type FaqSectionProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const FaqSection = (props: FaqSectionProps) => {
  const { heading, faqItems } = {
    ...FaqSectionDefaults,
    ...props,
  };
  return (
    <section id="faq" className="py-12 w-[50%] m-auto md:py-20">
      <div className="container mx-auto px-4 w-[50%] md:w-10/12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{heading}</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="text-center mt-8">
          <Button variant="link">View all frequently asked questions <ArrowRight className="ml-2 h-4 w-4" /></Button>
        </div>
      </div>
    </section>
  );
};

import { Button } from "../../../components/ui/button";
import { ArrowRight } from "lucide-react";

export const FaqSectionDefaults: Props = {
  heading: "Frequently Asked Questions",
  faqItems: [
    {
      question: "How do I create a personalized children's book?",
      answer: "You can create a personalized children's book by using our easy-to-use online editor. Simply upload your photos, choose a story theme, and customize the details to create a unique book for your child.",
    },
    {
      question: "What exactly do I receive when I create a book?",
      answer: "You will receive a beautifully illustrated, professionally printed hardcover book with a personalized story and characters based on the photos you provide.",
    },
    {
      question: "How much does a personalized children's book cost?",
      answer: "The price of a personalized children's book varies depending on the number of pages and other customization options. You can see the final price during the checkout process.",
    },
    {
        question: "Can I see a sample of the book?",
        answer: "Yes, you can view a digital preview of your book before you place your order. This allows you to see exactly how your personalized story will look.",
    },
    {
        question: "What if I don't like the children's book?",
        answer: "We offer a satisfaction guarantee. If you are not happy with your book for any reason, please contact our customer support team, and we will be happy to assist you.",
    },
    {
        question: "When can I order a hardcover and have it delivered?",
        answer: "Hardcover books are available for order at any time. Delivery times may vary depending on your location, but we strive to deliver your personalized book as quickly as possible.",
    },
  ],
};
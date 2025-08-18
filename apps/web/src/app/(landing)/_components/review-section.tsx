import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../../components/ui/card";

type ReviewItem = {
  quote: string;
  author: string;
  rating: number;
};

type Props = {
  heading: string;
  reviewItems: ReviewItem[];
};

export type ReviewSectionProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

export const ReviewSection = (props: ReviewSectionProps) => {
  const { heading, reviewItems } = {
    ...ReviewSectionDefaults,
    ...props,
  };
  return (
    <section id="reviews" className="w-[70%] m-auto px-[5%] py-16">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-8 text-4xl font-serif font-bold leading-tight">
            {heading}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {reviewItems.map((item, index) => (
              <Card
                key={index}
                className="bg-[#FFF9F4] rounded-xl p-6 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <CardHeader>
                  <div className="flex justify-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < item.rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic">"{item.quote}"</p>
                </CardContent>
                <CardFooter>
                  <p className="font-semibold w-full text-right">- {item.author}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const ReviewSectionDefaults: Props = {
  heading: "What Our Magical Customers Say",
  reviewItems: [
    {
      quote:
        "The story was so beautiful and my daughter's face lit up seeing her name in a real book. A truly magical gift!",
      author: "Sarah J.",
      rating: 5,
    },
    {
      quote:
        "I was amazed by the quality of the book. The illustrations are stunning and the story is heartwarming. Highly recommended!",
      author: "Michael B.",
      rating: 5,
    },
    {
      quote:
        "A fantastic and unique present for my nephew. He loves his personalized adventure and reads it every night.",
      author: "Emily R.",
      rating: 5,
    },
  ],
};
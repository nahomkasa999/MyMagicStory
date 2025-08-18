import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  heading: string;
  description: string;
  buttons: { title: string; variant?: "default" | "secondary" }[];
  image: {
    src: string;
    alt: string;
  };
};

export type HeroSectionProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>;

export const HeroSection = (props: HeroSectionProps) => {
  const { heading, description, buttons, image } = {
    ...HeroSectionDefaults,
    ...props,
  };
  return (
    <section id="relume" className="px-[5%] py-16 w-[70%] m-auto mt-10 ">
      <div className="container flex flex-row gap-10">
        <div>
          <div>
            <h1 className="mb-5 text-5xl font-semibold md:mb-6 leading-tight">{heading}</h1>
            <p className="md:text-2xl font-thin">{description}</p>
            <div className="mt-6 flex flex-wrap gap-4 md:mt-8">
              {buttons.map((button, index) => (
                <Button key={index} variant={button.variant} className="px-8 py-4 text-lg w-100 h-auto rounded-3xl">
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div>
          <img
            src={image.src}
            className="w-full object-cover scale-150"
            alt={image.alt}
          />
        </div>
      </div>
    </section>
  );
};

export const HeroSectionDefaults: Props = {
  heading: "Create your personalized children's book",
  description:
    "Design a unique children's book with AI, tailored specifically for each child. Bring a custom story and stunning illustrations to life.",
  buttons: [{ title: "Create a children's book" }],
  image: {
    src: "/heroImage.png",
    alt: "Hero Image",
  },
};

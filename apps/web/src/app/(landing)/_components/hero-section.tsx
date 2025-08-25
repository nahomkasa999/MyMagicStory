import { Button } from "@/components/ui/button"
import React from "react"

type Props = {
  heading: string
  description: string
  buttons: { title: string; variant?: "default" | "secondary" }[]
  image: {
    src: string
    alt: string
  }
}

export type HeroSectionProps = React.ComponentPropsWithoutRef<"section"> &
  Partial<Props>

export const HeroSection = (props: HeroSectionProps) => {
  const { heading, description, buttons, image } = {
    ...HeroSectionDefaults,
    ...props,
  }

  return (
    <section id="relume" className="px-[5%] py-12 md:py-20 w-full max-w-7xl mx-auto mt-10">
      <div className="container flex flex-col-reverse md:flex-row items-center gap-10">
        <div className="flex-1 text-center md:text-left">
          <h1 className="mb-5 text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            {heading}
          </h1>
          <p className="text-base sm:text-lg md:text-2xl font-light text-background dark:text-foreground">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 md:mt-8">
            {buttons.map((button, index) => (
              <Button
                key={index}
                variant={button.variant}
                className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-2xl"
              >
                {button.title}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex-1">
          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-md"
          />
        </div>
      </div>
    </section>
  )
}

export const HeroSectionDefaults: Props = {
  heading: "Create your personalized children's book",
  description:
    "Design a unique children's book with AI, tailored specifically for each child. Bring a custom story and stunning illustrations to life.",
  buttons: [{ title: "Create a children's book" }],
  image: {
    src: "https://covers.openlibrary.org/b/id/10523362-L.jpg", // real storybook cover from Open Library
    alt: "Children's storybook cover",
  },
}

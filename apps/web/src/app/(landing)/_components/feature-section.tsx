import Image from "next/image"
import { Button } from "../../../components/ui/button"

const features: {
  number: number
  header: string
  description: string
  image: string
  layout: "text-left" | "image-left"
}[] = [
  {
    number: 1,
    header: "Personalize the Main Character",
    description:
      "Fill in the characters’ names and details and upload their photos so that illustrations based on your photos are generated.",
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    layout: "text-left",
  },
  {
    number: 2,
    header: "Create a Personalized Story",
    description:
      "With our generative AI, you create a custom story. Choose the storyline and style options that best match the child's interests.",
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    layout: "image-left",
  },
  {
    number: 3,
    header: "Receive Your Book in Various Formats",
    description:
      "Not subscribed, Receive the eBook for $29.95 immediately. Do you also want a physical copy? Then choose a hardcover for $34.99 afterwards.",
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    layout: "text-left",
  },
]

function Feature({
  number,
  header,
  description,
  image,
  layout,
}: {
  number: number
  header: string
  description: string
  image: string
  layout: "text-left" | "image-left"
}) {
  const textContent = (
    <div className="flex flex-col justify-center text-foreground">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary p-3 text-background">
          {number}
        </div>
        <h2 className="text-xl font-bold">{header}</h2>
      </div>
      <p className="mt-4 text-muted-foreground">{description}</p>
    </div>
  )

  const imageContent = (
    <div className="flex items-center justify-center">
      <Image
        src={image}
        alt={header}
        width={300}
        height={300}
        className="rounded-lg border border-border bg-background"
      />
    </div>
  )

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {layout === "text-left" ? (
        <>
          {textContent}
          {imageContent}
        </>
      ) : (
        <>
          {imageContent}
          {textContent}
        </>
      )}
    </div>
  )
}

export default function FeatureSection() {
  return (
    <div className="mx-auto w-3/5 rounded-3xl bg-background p-8">
      <div className="flex flex-col gap-16">
        {features.map((feature) => (
          <Feature key={feature.number} {...feature} />
        ))}
      </div>
      <div className="mt-12 flex justify-center">
        <Button>Create a children's book</Button>
      </div>
    </div>
  )
}

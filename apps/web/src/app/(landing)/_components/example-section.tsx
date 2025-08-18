import React from "react";
import Image from "next/image";

const ageCategories = [
  {
    age: "0 to 2 years",
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
  {
    age: "3 to 5 years",
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
  {
    age: "6 to 9 years",
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
  {
    age: "10+ years",
    image: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
  },
];

function AgeCategoryCard({ age, image }: { age: string; image: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Image
        src={image}
        alt={age}
        width={200}
        height={200}
        className="rounded-lg"
      />
      <p className="text-lg font-medium">{age}</p>
    </div>
  );
}

export const ExampleSection = () => {
  return (
    <div className="mx-auto w-3/5 rounded-3xl bg-destructive/9 p-8 m-10">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          Create a Personal Children's Book
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg">
          Start creating your personal children's book: choose a story, upload a
          photo, and see your unique book come to life.
        </p>
      </div>
      <div className="mt-12">
        <h2 className="text-center text-2xl font-bold">
          Choose the Age Category
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {ageCategories.map((category) => (
            <AgeCategoryCard key={category.age} {...category} />
          ))}
        </div>
      </div>
    </div>
  );
};
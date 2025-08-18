export const themes = [
  { name: 'Dinosaurs', emoji: '🦕', className: 'col-span-2' },
  { name: 'Unicorns', emoji: '🦄', className: '' },
  { name: 'Space', emoji: '🚀', className: '' },
  { name: 'Travel', emoji: '✈️', className: '' },
  { name: 'Pirates', emoji: '🏴‍☠️', className: '' },
  { name: 'Underwater', emoji: '🐠', className: 'col-span-2' },
  { name: 'Jungle', emoji: '🌴', className: '' },
  { name: 'Fairy Tales', emoji: '🧚‍♀️', className: '' },
  { name: 'Princes And Princesses', emoji: '👸', className: 'col-span-3' },
  { name: 'Cooking And Baking', emoji: '🍳', className: '' },
  { name: 'Learning To Count', emoji: '🔢', className: '' },
  { name: 'Wizard School', emoji: '🧙‍♂️', className: '' },
  { name: 'Alphabet', emoji: '🔤', className: '' },
  { name: 'Birthday', emoji: '🎂', className: '' },
  { name: 'Going To School', emoji: '🏫', className: 'col-span-2' },
  { name: 'Christmas', emoji: '🎄', className: '' },
  { name: 'Wild West', emoji: '🤠', className: '' },
  { name: 'Sports', emoji: '⚽️', className: '' },
  { name: 'Outdoor Play', emoji: '🌳', className: '' },
  { name: 'Toothbrushing', emoji: '🦷', className: '' },
  { name: 'Secret Missions', emoji: '🤫', className: '' },
  { name: 'Holiday', emoji: '🎉', className: '' },
  { name: 'First Words', emoji: '🗣️', className: '' },
];

export const ageCategories = [
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

// Define the Story type if it's not already defined elsewhere
// For now, I'll assume a basic structure based on the provided data.
// If a more comprehensive Story type exists, it should be used.
export type Story = {
  bgColor: string;
  usedPhotos: string[];
  coverImage: string;
  title: string;
  age: string;
  theme: string;
  subject: string;
  style: string;
  font: string;
  characters: number;
};

export const stories: Story[] = [
  {
    bgColor: 'bg-orange-50',
    usedPhotos: ['/heroImage.png'],
    coverImage: '/heroImage.png',
    title: "Emma's Garden of Care",
    age: '6 to 9 years',
    theme: 'Activities',
    subject: 'Caring for Animals',
    style: '3D Animation',
    font: 'Candy Dreams',
    characters: 1,
  },
  {
    bgColor: 'bg-green-50',
    usedPhotos: ['/heroImage.png', '/heroImage.png', '/heroImage.png'],
    coverImage: '/heroImage.png',
    title: "Max's Brave Pirate Adventure",
    age: '6 to 9 years',
    theme: 'Adventure',
    subject: 'Pirates',
    style: 'Storybook',
    font: 'Storybook Classic',
    characters: 3,
  },
    {
    bgColor: 'bg-blue-50',
    usedPhotos: ['/heroImage.png', '/heroImage.png', '/heroImage.png', '/heroImage.png'],
    coverImage: '/heroImage.png',
    title: "Tom's Seasons of Wonder",
    age: '0 to 2 years',
    theme: 'Educational',
    subject: 'Seasons and Weather',
    style: 'Watercolour',
    font: 'Cozy Curves',
    characters: 4,
  },
  {
    bgColor: 'bg-purple-50',
    usedPhotos: ['/heroImage.png', '/heroImage.png'],
    coverImage: '/heroImage.png',
    title: "Into the Woods: A Tale of Trust",
    age: '10+ years',
    theme: 'Activities',
    subject: 'To the forest',
    style: '3D Animation',
    font: 'Candy Dreams',
    characters: 2,
  },
];
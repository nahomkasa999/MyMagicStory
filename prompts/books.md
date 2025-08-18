#this is for the books section

### Description

The image displays a component for selecting book themes and occasions. It consists of a title and a grid of interactive buttons, each representing a different theme.

**Overall Structure:**

  * A container with a rounded-corner, light-colored background.
  * The container has a main heading at the top.
  * Below the heading, there is a grid of buttons.
  * The last button in the grid is a call-to-action button with a different style.

**Content:**

  * **Main Title:** "Books for every theme and occasion"
  * **Buttons (each with an icon):** this part should he in benetto grid
      * Dinosaurs
      * Unicorns
      * Space
      * Travel
      * Pirates
      * Underwater
      * Jungle
      * Fairy Tales
      * Princes And Princesses
      * Cooking And Baking
      * Learning To Count
      * Wizard School
      * Alphabet
      * Birthday
      * Going To School
      * Christmas
      * Wild West
      * Sports
      * Outdoor Play
      * Toothbrushing
      * Secret Missions
      * Holiday
      * First Words
  * **Call-to-Action Button:** "View all themes" (This button has an orange background and white text, distinguishing it from the others).

**Styling:**

  * The default theme buttons are styled with a light background and a subtle shadow, giving them a three-dimensional, "pill" shape.
  * Each theme button has a small, relevant icon to its left.
  * The overall container has padding, and the content is centrally aligned.

### Structure

```
__________________________________________________________________
|                                                                 |
|     Books for every theme and occasion                          |
|                                                                 |
|   _________________________________________________________     |
|  |  (Button)   | (Button)    | (Button)    | (Button)      |    |
|  | Dinosaurs   | Unicorns    | Space       | Travel        |    |
|  |_____________|_____________|_____________|_______________|    |
|   _________________________________________________________     |
|  |  (Button)   | (Button)    | (Button)    | (Button)      |    |
|  | Princes And | Cooking And | Learning To | Wizard School |    |
|  | Princesses  | Baking      | Count       |               |    |
|  |_____________|_____________|_____________|_______________|    |
|   _________________________________________________________     |
|  |  (Button)   | (Button)    | (Button)    | (Button)      |    |
|  | Birthday    | Going To    | Christmas   | Wild West     |    |
|  |             | School      |             |               |    |
|  |_____________|_____________|_____________|_______________|    |
|                                                                 |
|   _______________________________________                       |
|  | (Button)    | (Button)    | (Button)    | (CTA Button)  |    |
|  | Secret      | Holiday     | First Words | View all      |    |
|  | Missions    |             |             | themes        |    |
|  |_____________|_____________|_____________|_______________|    |
|                                                                 |
|_________________________________________________________________|

(remeber the layout should be in gird(beneto) not in tablelar form for the buttons )
```

#

good but add the follow 

1) add a container and the container should have a light blud bg color very light
2) decrease the size of the width of the buttons and increase the height
3) use emoji rather than lucide react icons
4) add a bento gread meaning like this
  
   Dinosurs     Unicorns     Space     Travel     pirates     underwater    jungle        Faire Tale 
      [ Prince and princes]     [cooking and Baking]    [ Learing to count]   [ wizard school]
   [Birth day]   [Going to school ] .....
5) decrease the width of the container around 80% of the totla width

now create one file called resoures in the lib file where you export this things


const themes = [
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
from the books section


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


const stories: Story[] = [
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

and all the metadatas, form the components and you will paste them in the resources file which you will create and then you will export them.

so if you are in explanation-section you would import the sotyries form teh lib and then use here 

ultimately makeing the coudes clearener 



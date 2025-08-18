import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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

export function BooksSection() {
  return (
    <section className="py-12 w-[80%] m-auto md:py-20">
      <div className="container mx-auto px-4 w-full md:w-10/12 bg-blue-50 rounded-2xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Books for every theme and occasion
          </h2>
        </div>
        <div className=" w-[80%] m-auto grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {themes.map((theme, index) => (
            <Button
              key={index}
              variant="outline"
              className={cn(
                "flex items-center justify-center p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-auto w-auto text-sm",
                theme.className
              )}
            >
              <span className="text-xl mr-2">{theme.emoji}</span>
              <span className="font-medium text-xs">{theme.name}</span>
            </Button>
          ))}
          <Button
            className="col-span-2 flex items-center justify-center p-3 bg-orange-500 text-white rounded-xl shadow-sm hover:shadow-md transition-shadow h-14 text-sm"
          >
            View all themes
          </Button>
        </div>
      </div>
    </section>
  );
}
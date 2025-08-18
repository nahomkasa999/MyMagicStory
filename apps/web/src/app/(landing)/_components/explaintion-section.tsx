// import Image from 'next/image';
// import { Button } from '../../../components/ui/button';
// import { Card } from '../../../components/ui/card';
// import { ArrowRight, ChevronsRight } from 'lucide-react';
// import { stories, Story } from '../../lib/resources';

//   <Card className={`p-6 md:p-8 ${story.bgColor} border-none w-[80%] m-auto`}>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
//       {/* Used Photos */}
//       <div className="flex flex-col items-center text-center">
//         <h3 className="text-lg font-semibold mb-4">Used photos</h3>
//         <div className={`grid grid-cols-${story.usedPhotos.length > 1 ? '2' : '1'} gap-2`}>
//           {story.usedPhotos.map((photo, index) => (
//             <Image
//               key={index}
//               src={photo}
//               alt={`Used photo ${index + 1}`}
//               width={100}
//               height={100}
//               className="rounded-lg object-cover"
//             />
//           ))}
//         </div>
//       </div>

//       {/* Arrow and Book Cover */}
//       <div className="flex items-center justify-center relative">
//          <ChevronsRight className="text-orange-400 h-12 w-12 absolute -left-4 hidden md:block" />
//         <div className="flex flex-col items-center text-center">
//             <h3 className="text-lg font-semibold mb-4 md:invisible">Storybook cover</h3>
//             <Image
//                 src={story.coverImage}
//                 alt={story.title}
//                 width={250}
//                 height={250}
//                 className="rounded-lg shadow-lg"
//             />
//         </div>
//       </div>


//       {/* Story Choices */}
//       <div className="flex flex-col">
//         <h3 className="text-lg font-semibold mb-4">Story Choices</h3>
//         <ul className="space-y-2 text-sm text-gray-700 mb-6">
//           <li><strong>Title:</strong> {story.title}</li>
//           <li><strong>Age:</strong> {story.age}</li>
//           <li><strong>Theme:</strong> {story.theme}</li>
//           <li><strong>Subject:</strong> {story.subject}</li>
//           <li><strong>Style:</strong> {story.style}</li>
//           <li><strong>Font:</strong> {story.font}</li>
//           <li><strong>Number of characters:</strong> {story.characters}</li>
//         </ul>
//         <div className="flex flex-col space-y-2">
//           <Button variant="outline" className="bg-transparent">View Example <ArrowRight className="ml-2 h-4 w-4" /></Button>
//           <Button>Create Your Own Children's Book <ArrowRight className="ml-2 h-4 w-4" /></Button>
//         </div>
//       </div>
//     </div>
//   </Card>
// );

// export function ExplaintionSection() {
//   return (
//     <section className="py-12 md:py-20">
//       <div className="container mx-auto px-4 w-full md:w-10/12">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Examples</h2>
//           <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
//             View examples of stories with unique characters and illustrations based on uploaded photos, perfect for every child.
//           </p>
//         </div>

//         <div className="space-y-8">
//           {stories.map((story, index) => (
//             <StoryCard key={index} story={story} />
//           ))}
//         </div>

//         <div className="text-center mt-12">
//           <Button size="lg" variant="secondary">View all examples</Button>
//         </div>
//       </div>
//     </section>
//   );
// }
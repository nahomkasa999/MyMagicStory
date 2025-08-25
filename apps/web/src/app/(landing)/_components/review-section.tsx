import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'

type Testimonial = {
  name: string
  role: string
  image: string
  quote: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Amanuel Tesfaye',
    role: 'Parent',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    quote:
      'MyMagicalStory made it so easy to create a personalized storybook for my daughter. She absolutely loved seeing herself as the main character!',
  },
  {
    name: 'Selamawit Bekele',
    role: 'Teacher',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    quote:
      'I love using MyMagicalStory to encourage children to read. The templates are beautiful, and kids get so excited seeing their own adventures in print.',
  },
  {
    name: 'Daniel Hailu',
    role: 'Software Engineer & Parent',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    quote:
      'Creating a gift for my son has never been easier. MyMagicalStory lets me build a storybook with just a few clicks, and the result is magical.',
  },
  {
    name: 'Marta Abebe',
    role: 'Parent',
    image: 'https://randomuser.me/api/portraits/women/4.jpg',
    quote:
      'The templates on MyMagicalStory are incredible! I could customize everything from the storyline to illustrations, and my kids loved it.',
  },
  {
    name: 'Hailemariam Yohannes',
    role: 'Graphic Designer',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    quote:
      'I was impressed by how user-friendly MyMagicalStory is. Even without technical skills, I was able to make a professional-looking storybook for my niece.',
  },
  {
    name: 'Liya Getachew',
    role: 'Parent',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
    quote:
      'I gifted my daughter a storybook I made with MyMagicalStory, and she was over the moon. This platform truly helps make reading magical!',
  },
  {
    name: 'Samuel Kassa',
    role: 'Writer',
    image: 'https://randomuser.me/api/portraits/men/7.jpg',
    quote:
      'MyMagicalStory bridges creativity and technology perfectly. It lets parents and kids co-create stories that feel truly special and unique.',
  },
  {
    name: 'Helen Tadesse',
    role: 'Parent',
    image: 'https://randomuser.me/api/portraits/women/8.jpg',
    quote:
      'I love how easy it is to make a gift that is meaningful and personalized. MyMagicalStory brings joy to both children and parents alike.',
  },
  {
    name: 'Getnet Alemu',
    role: 'Parent',
    image: 'https://randomuser.me/api/portraits/men/9.jpg',
    quote:
      'From start to finish, MyMagicalStory makes creating a storybook intuitive and fun. My kids are thrilled every time they see a new story starring themselves.',
  },
  {
    name: 'Mimi Desta',
    role: 'Parent',
    image: 'https://randomuser.me/api/portraits/women/10.jpg',
    quote:
      'This platform turns imagination into reality. Making custom storybooks for my children has never been so joyful and easy.',
  },
  {
    name: 'Hailemariam Yohannes',
    role: 'Graphic Designer',
    image: 'https://randomuser.me/api/portraits/men/5.jpg',
    quote:
      'I was impressed by how user-friendly MyMagicalStory is. Even without technical skills, I was able to make a professional-looking storybook for my niece.',
  },
  {
    name: 'Liya Getachew',
    role: 'Parent',
    image: 'https://randomuser.me/api/portraits/women/6.jpg',
    quote:
      'I gifted my daughter a storybook I made with MyMagicalStory, and she was over the moon. This platform truly helps make reading magical!',
  },
];


const chunkArray = (array: Testimonial[], chunkSize: number): Testimonial[][] => {
  const result: Testimonial[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}

const testimonialChunks = chunkArray(testimonials, Math.ceil(testimonials.length / 3))

export default function ReviewSection() {
  return (
    <section id="reviews" className="w-[70%] m-auto px-[5%] py-16">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold">Loved by the Community</h2>
          <p className="mt-6 text-foreground/70">
            Harum quae dolore orrupti aut temporibus ariatur.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {testimonialChunks.map((chunk, chunkIndex) => (
            <div key={chunkIndex} className="space-y-3">
              {chunk.map(({ name, role, quote, image }, index) => (
                <Card key={index}>
                  <CardContent className="grid grid-cols-[auto_1fr] gap-3 pt-6">
                    <Avatar className="size-9">
                      <AvatarImage
                        alt={name}
                        src={image}
                        loading="lazy"
                        width="120"
                        height="120"
                      />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{name}</h3>
                      <span className="text-muted-foreground block text-sm tracking-wide">
                        {role}
                      </span>
                      <blockquote className="mt-3">
                        <p className="text-foreground/80">{quote}</p>
                      </blockquote>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

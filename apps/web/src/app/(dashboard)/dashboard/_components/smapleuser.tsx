
export const sampleUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "", // Empty for now, will show fallback
  plan: "paid" as const
};

export const sampleStorybooks = [
  {
    id: "1",
    title: "The Magical Forest Adventure",
    description: "A young explorer discovers a hidden world filled with talking animals and magical creatures in an enchanted forest.",
    coverImage: "/1.png", // Using existing image from public folder
    createdAt: "2024-01-15T10:30:00Z",
    status: "completed" as const,
    pageCount: 12
  },
  {
    id: "2",
    title: "Space Pirates and the Crystal Moon",
    description: "Captain Luna and her crew embark on an intergalactic quest to find the legendary Crystal Moon before the evil Space Emperor.",
    coverImage: "", // No cover image
    createdAt: "2024-01-10T14:20:00Z",
    status: "completed" as const,
    pageCount: 16
  },
  {
    id: "3",
    title: "The Little Dragon's First Flight",
    description: "A heartwarming tale about a young dragon who's afraid of heights but must overcome his fears to save his village.",
    coverImage: "", // No cover image
    createdAt: "2024-01-08T09:15:00Z",
    status: "draft" as const,
    pageCount: 8
  },
  {
    id: "4",
    title: "Underwater Kingdom Mystery",
    description: "Princess Marina discovers a conspiracy in her underwater kingdom and must solve the mystery to save her people.",
    coverImage: "", // No cover image
    createdAt: "2024-01-05T16:45:00Z",
    status: "processing" as const,
    pageCount: 0
  },
  {
    id: "5",
    title: "The Time-Traveling Teddy Bear",
    description: "When Emma's teddy bear comes to life, they travel through different time periods learning about history and friendship.",
    coverImage: "", // No cover image
    createdAt: "2024-01-03T11:30:00Z",
    status: "completed" as const,
    pageCount: 14
  },
  {
    id: "6",
    title: "Robot Friends in the Future City",
    description: "In the year 3000, a lonely child befriends a group of helpful robots who teach him about technology and teamwork.",
    coverImage: "", // No cover image
    createdAt: "2024-01-01T08:00:00Z",
    status: "completed" as const,
    pageCount: 10
  },
  {
    id: "7",
    title: "The Secret Garden Mystery",
    description: "Two siblings discover a hidden garden behind their grandmother's house with magical plants that can grant wishes.",
    coverImage: "",
    createdAt: "2024-01-20T12:00:00Z",
    status: "draft" as const,
    pageCount: 6
  },
  {
    id: "8",
    title: "Pirate Adventure on Treasure Island",
    description: "Young Captain Sam and his crew search for buried treasure while learning about friendship and courage.",
    coverImage: "",
    createdAt: "2024-01-18T15:30:00Z",
    status: "completed" as const,
    pageCount: 18
  }
];

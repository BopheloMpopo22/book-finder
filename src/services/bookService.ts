// API Keys should be stored in environment variables
const AMAZON_ACCESS_KEY = process.env.REACT_APP_AMAZON_ACCESS_KEY;
const AMAZON_SECRET_KEY = process.env.REACT_APP_AMAZON_SECRET_KEY;
const AMAZON_ASSOCIATE_TAG = process.env.REACT_APP_AMAZON_ASSOCIATE_TAG;
const GOOGLE_BOOKS_API_KEY = "AIzaSyCkzADtrUlngGfuUoTOpcIuqy7xly18kgI";

import { searchBooks } from "./amazonService";

export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  imageUrl: string;
  amazonUrl: string;
  price: string;
  categories?: string[];
  publishedDate?: string;
  pageCount?: number;
  language?: string;
  publisher?: string;
  averageRating?: number;
  ratingsCount?: number;
}

// Comprehensive trope and genre keywords
const TROPE_KEYWORDS = {
  // Romance Tropes
  "friends to lovers": "romance friendship love relationship",
  "enemies to lovers": "romance enemies love relationship",
  "love triangle": "romance love triangle relationship",
  "second chance": "romance second chance love",
  "fake relationship": "romance fake relationship love",
  "arranged marriage": "romance arranged marriage love",
  soulmates: "romance soulmates destiny love",
  "love at first sight": "romance instant attraction love",
  "forbidden love": "romance forbidden love relationship",
  "childhood friends": "romance childhood friends love",
  "office romance": "romance workplace love",
  "marriage of convenience": "romance marriage convenience",
  amnesia: "romance amnesia memory loss",
  pregnancy: "pregnancy young mother family",
  "secret baby": "romance secret baby family",
  "single parent": "romance single parent family",

  // Fantasy Tropes
  "chosen one": "fantasy chosen one prophecy",
  "magic school": "fantasy magic school wizard",
  quest: "fantasy quest adventure journey",
  dragons: "fantasy dragon mythical creature",
  "magical creatures": "fantasy magical creatures mythical",
  "world building": "fantasy world building magic",
  "magic system": "fantasy magic system power",
  "portal fantasy": "fantasy portal another world",
  "fairy tale": "fantasy fairy tale magic",
  mythology: "fantasy mythology gods legends",

  // Mystery/Thriller Tropes
  whodunit: "mystery detective crime whodunit",
  "cold case": "mystery cold case detective",
  "serial killer": "thriller serial killer crime",
  "amateur detective": "mystery amateur detective",
  "police procedural": "mystery police detective",
  "psychological thriller": "thriller psychological suspense",
  "missing person": "mystery missing person detective",
  heist: "thriller heist crime",

  // Sci-Fi Tropes
  "time travel": "science fiction time travel",
  "space opera": "science fiction space opera",
  dystopian: "dystopian future society",
  "post apocalyptic": "post apocalyptic survival",
  "artificial intelligence": "science fiction AI robots",
  "first contact": "science fiction aliens first contact",
  "space exploration": "science fiction space exploration",
  "alternate history": "alternate history what if",

  // Horror Tropes
  ghost: "horror ghost supernatural",
  vampire: "horror vampire supernatural",
  zombie: "horror zombie apocalypse",
  "haunted house": "horror haunted house supernatural",
  possession: "horror possession supernatural",
  paranormal: "horror paranormal supernatural",

  // General Fiction Tropes
  "coming of age": "coming of age young adult",
  "family drama": "family drama relationships",
  "historical fiction": "historical fiction period",
  contemporary: "contemporary modern fiction",
  "literary fiction": "literary fiction character study",
  satire: "satire humor comedy",
  retelling: "retelling adaptation",
  "multiple pov": "multiple point of view",
  "unreliable narrator": "unreliable narrator mystery",

  // Genre-Specific
  "cozy mystery": "cozy mystery amateur detective",
  "hard sci fi": "hard science fiction technology",
  "epic fantasy": "epic fantasy high fantasy",
  "urban fantasy": "urban fantasy magic modern",
  "paranormal romance": "paranormal romance supernatural",
  "dark fantasy": "dark fantasy horror",
  gothic: "gothic horror mystery",
  noir: "noir crime mystery",
  steampunk: "steampunk alternate history",
  cyberpunk: "cyberpunk future technology",

  // Themes
  redemption: "redemption forgiveness",
  revenge: "revenge vengeance",
  betrayal: "betrayal trust",
  survival: "survival adventure",
  war: "war military historical",
  politics: "politics power",
  "social justice": "social justice activism",
  identity: "identity self-discovery",
  immortality: "immortality eternal life",
  "parallel worlds": "parallel worlds alternate reality",
};

export const searchBooksByTitle = async (query: string): Promise<Book[]> => {
  try {
    console.log("Enhanced Search Query:", query);
    const books = await searchBooks({ keywords: query });
    console.log("Amazon API Response:", books);

    return books.map((book: { author: string; title: string }) => ({
      ...book,
      authors: [book.author],
      description: book.title,
      categories: [],
      publishedDate: "",
      pageCount: 0,
      language: "en",
      publisher: "Amazon",
      averageRating: 0,
      ratingsCount: 0,
    }));
  } catch (error) {
    console.error("Error searching books:", error);
    return [];
  }
};

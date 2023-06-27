import {
  GoogleNaturalLanguageL1,
  GoogleNaturalLanguageL2,
  GoogleNaturalLanguageL3,
} from "../../rural-event-categories/src/types/googleNaturalLanguageCategories";

type GoogleNaturalLanguageClassification =
  | GoogleNaturalLanguageL1
  | GoogleNaturalLanguageL2
  | GoogleNaturalLanguageL3;
interface categoryMapping {
  category: string;
  section: GoogleNaturalLanguageL1;
  classifications: GoogleNaturalLanguageClassification[];
}

export const categoryMappings: categoryMapping[] = [
  {
    category: "Kirche",
    section: "/People & Society",
    classifications: ["/People & Society/Religion & Belief"],
  },
  {
    category: "Bildung",
    section: "/Jobs & Education",
    classifications: ["/Jobs & Education/Education"],
  },
  {
    category: "Kultur",
    section: "/Arts & Entertainment",
    classifications: ["/Arts & Entertainment"],
  },
  {
    category: "Ehrenamt",
    section: "/People & Society",
    classifications: [
      "/People & Society/Social Issues & Advocacy/Charity & Philanthropy",
    ],
  },
  {
    category: "Gemeindeleben",
    section: "/People & Society",
    classifications: [
      "/Law & Government/Government",
      "/Law & Government/Legal",
    ],
  },
  {
    category: "Gottesdienste",
    section: "/People & Society",
    classifications: ["/People & Society/Religion & Belief"],
  },
  {
    category: "Konzerte",
    section: "/Arts & Entertainment",
    classifications: [
      "/Arts & Entertainment/Events & Listings/Concerts & Music Festivals",
    ],
  },
  {
    category: "Musik",
    section: "/Arts & Entertainment",
    classifications: ["/Arts & Entertainment/Music & Audio"],
  },
  {
    category: "Sitzungen",
    section: "/Law & Government",
    classifications: [
      "/Law & Government/Government",
      "/Law & Government/Legal",
    ],
  },
  {
    category: "Gremien",
    section: "/Law & Government",
    classifications: [
      "/Law & Government/Government",
      "/Law & Government/Legal",
    ],
  },
];

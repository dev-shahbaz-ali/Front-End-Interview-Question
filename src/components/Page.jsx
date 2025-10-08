import { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import frontend from "../assets/frontend.png";

const ITEMS_PER_PAGE = 8;

const categories = [
  { id: "all", name: "All", count: 0 },
  {
    id: "react",
    name: "React.js",
    count: 0,
    subcategories: ["hooks", "components", "jsx"],
  },
  { id: "nextjs", name: "Next.js", count: 0 },
  { id: "tailwind", name: "TailwindCSS", count: 0 },
  { id: "css", name: "CSS", count: 0 },
  {
    id: "javascript",
    name: "JavaScript",
    count: 0,
    subcategories: ["closures", "prototypes", "es6"],
  },
  { id: "html", name: "HTML", count: 0 },
  { id: "typescript", name: "TypeScript", count: 0 },
  {
    id: "sass",
    name: "Sass",
    count: 0,
    subcategories: ["mixins", "variables"],
  },
  { id: "regex", name: "Regex", count: 0 },
  { id: "prisma", name: "Prisma ORM", count: 0 },
  { id: "drizzle", name: "Drizzle ORM", count: 0 },
  { id: "backend", name: "Backend", count: 0 },
  { id: "nodejs", name: "Node.js", count: 0 },
  { id: "express", name: "Express", count: 0 },
  { id: "other", name: "Other", count: 0 },
];

// Difficulty colors
const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "bg-white text-green-800 hover:bg-0";
    case "medium":
      return "bg-white text-yellow-800 hover:bg-0";
    case "hard":
      return "bg-white text-red-800 hover:bg-0";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getDifficultyText = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "Easy";
    case "medium":
      return "Medium";
    case "hard":
      return "Hard";
    default:
      return "Unknown";
  }
};

const capitalizeWords = (str) =>
  str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function Page() {
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load questions
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/questions.json");
        const data = await response.json();
        const sortedData = data.sort((a, b) => {
          const categoryComparison = a.category.localeCompare(b.category);
          if (categoryComparison !== 0) return categoryComparison;
          return a.question.localeCompare(b.question);
        });
        setQuestions(sortedData);
      } catch (error) {
        console.error("Error loading questions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, []);

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((item) => {
      const matchesSearch =
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, questions]);

  const totalPages = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const validCurrentPage = Math.min(
    Math.max(1, currentPage),
    Math.max(1, totalPages)
  );

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = filteredQuestions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? questions.length
        : questions.filter((q) => q.category === cat.id).length,
  }));

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    if (searchTerm) setSearchTerm("");
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPaginationButtons = () => {
    const buttons = [];
    if (totalPages <= 1) return buttons;

    buttons.push(1);
    const current = validCurrentPage;
    const start = Math.max(2, current - 1);
    const end = Math.min(totalPages - 1, current + 1);

    if (start > 2) buttons.push("...");
    for (let i = start; i <= end; i++) buttons.push(i);
    if (end < totalPages - 1) buttons.push("...");
    if (totalPages > 1) buttons.push(totalPages);

    return buttons;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center
        
        dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen 
        dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl pb-16">
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <h1
              className="text-3xl flex gap-4 items-center font-bold tracking-tight 
                text-blue-900 dark:text-gray-100"
            >
              Frontend Interview Q&A
              <img src={frontend} className="h-10" alt="" />
            </h1>
          </div>
          <p className="text-muted-foreground mb-4">
            Common frontend development interview questions and answers to help
            you prepare
          </p>
          <div className=" backdrop-blur-sm border border-yellow-200 rounded-lg p-4 max-w-2xl mx-auto shadow-md">
            <p className="text-sm text-blue-800">
              <strong className="text-red-300">Note :</strong> The following
              questions are designed to support preliminary preparation and
              interview practice. For comprehensive learning and advanced
              mastery, it is recommended to utilize specialized resources and
              professional tools—such as
              <a
                href="https://www.google.com/search?q=interview+questions"
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong> Google </strong>
              </a>
              and
              <a
                href="https://chatgpt.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                <strong> ChatGPT </strong>
              </a>
              —for in-depth study and skill development
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <div className="w-full flex justify-center items-center gap-2 relative">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-5 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6 justify-center sm:justify-start">
          {categoriesWithCount.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.id)}
              className={`cursor-pointer px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                selectedCategory === category.id
                  ? "bg-blue-900 text-white hover:bg-blue-800"
                  : " backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-blue-200"
              }`}
            >
              {capitalizeWords(category.name)}
            </Badge>
          ))}
        </div>

        <div className="flex fle-col items-center sm:flex-row sm:justify-between sm:items-center mb-6 text-sm text-muted-foreground gap-2">
          <div className="shadow-2xl bg-gray-50 hover:bg-gray-100 py-2 px-2 border border-gray-300 rounded-sm">
            Showing {startIndex + 1}
            {"-"}
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              filteredQuestions.length
            )} of {filteredQuestions.length} questions
          </div>

          <Button variant={"outline"}>
            Page {validCurrentPage} of {totalPages}
          </Button>
        </div>

        {paginatedQuestions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No questions found matching your search.
            </p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-3">
            {paginatedQuestions.map((item, index) => {
              const questionNumber = startIndex + index + 1;
              return (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border rounded-lg px-4 hover:shadow-md transition-all duration-200 cursor-pointer backdrop-blur-sm text-blue-400 border-blue-900"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-sm text-grblueay-400 font-medium min-w-[2rem] flex-shrink-0">
                          {questionNumber}
                        </span>
                        <span className="font-medium text-left leading-relaxed">
                          {item.question}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-11 sm:ml-4 flex-shrink-0">
                        <Badge
                          className={`text-[0.65rem] px-1 py-0.5 ${getDifficultyColor(
                            item.difficulty
                          )}`}
                        >
                          {getDifficultyText(item.difficulty)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {capitalizeWords(item.category)}
                        </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 pt-2">
                    <div className="ml-8 text-muted-foreground leading-relaxed text-left">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage === 1}
              className="bg-white/70 cursor-pointer backdrop-blur-sm border-gray-200 hover:bg-white/90"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            <div className="flex gap-1">
              {getPaginationButtons().map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-2 py-1 text-gray-500"
                  >
                    ...
                  </span>
                ) : (
                  <Button
                    key={`page-${page}`}
                    variant={validCurrentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[35px] sm:min-w-[40px] cursor-pointer text-xs sm:text-sm ${
                      validCurrentPage === page
                        ? "bg-blue-900 text-white hover:bg-blue-800"
                        : "bg-white/70 backdrop-blur-sm border-gray-200 hover:bg-white/90"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              className="bg-white/70 backdrop-blur-sm cursor-pointer border-gray-200 hover:bg-white/90"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

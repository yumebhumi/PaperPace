export type ShelfStatus = "WANT_TO_READ" | "CURRENTLY_READING" | "FINISHED";

export type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  description: string;
  pageCount: number;
  genres: string[];
  routeStops: string[];
  status: ShelfStatus;
  currentPage: number;
};

export type ReadingSession = {
  id: string;
  bookId: string;
  bookTitle: string;
  startedAt: string;
  endedAt: string;
  durationMinutes: number;
  pagesRead: number;
  paceSecondsPerPage: number;
  mood?: string;
  focusScore?: number;
  notes?: string;
};

export type ReadingReceipt = {
  sessionId: string;
  bookId: string;
  bookTitle: string;
  coverUrl?: string;
  date: string;
  mood?: string;
  distancePages: number;
  durationMinutes: number;
  paceSecondsPerPage: number;
  currentStreak: number;
};

export type Achievement = {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
};

export type Quote = {
  id: string;
  bookId: string;
  quoteText: string;
  pageNumber?: number;
};

export type ReaderSnapshot = {
  user: {
    id: string;
    displayName: string;
    currentStreak: number;
    bestStreak: number;
    totalPages: number;
    totalMinutes: number;
    totalSessions: number;
    booksFinished: number;
    averagePace: number;
    readingGoalValue: number;
  };
  books: Book[];
  currentBook: Book;
  sessions: ReadingSession[];
  achievements: Achievement[];
  quotes: Quote[];
  weeklyPages: { day: string; pages: number }[];
  heatmap: { day: string; sessions: number }[];
  genrePace: { genre: string; pace: number }[];
};

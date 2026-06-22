import { prisma } from "@/lib/prisma";
import { demoSnapshot } from "@/lib/demo-data";
import type { ReaderSnapshot, ReadingReceipt } from "@/lib/types";

type NewSessionInput = {
  bookId: string;
  startPage: number;
  endPage: number;
  durationSeconds: number;
  mood?: string;
  focusScore?: number;
  notes?: string;
};

function buildGenrePaceData(
  sessions: Array<{
    pagesRead: number;
    durationSeconds?: number;
    paceSecondsPerPage?: number;
    bookGenres: string[];
  }>,
) {
  const genreTotals = new Map<string, { pages: number; duration: number }>();

  for (const session of sessions) {
    if (session.pagesRead <= 0 || session.bookGenres.length === 0) {
      continue;
    }

    const durationSeconds =
      session.durationSeconds ??
      Math.round((session.paceSecondsPerPage ?? 0) * session.pagesRead);

    for (const genre of session.bookGenres) {
      const current = genreTotals.get(genre) ?? { pages: 0, duration: 0 };
      current.pages += session.pagesRead;
      current.duration += durationSeconds;
      genreTotals.set(genre, current);
    }
  }

  return [...genreTotals.entries()]
    .filter(([, totals]) => totals.pages > 0)
    .map(([genre, totals]) => ({
      genre,
      pace: Math.round(totals.duration / totals.pages),
    }))
    .sort((left, right) => left.genre.localeCompare(right.genre));
}

function cloneSnapshot(snapshot: ReaderSnapshot) {
  return JSON.parse(JSON.stringify(snapshot)) as ReaderSnapshot;
}

const localSnapshot = cloneSnapshot(demoSnapshot);

function canUseDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

async function getDatabaseSnapshot(): Promise<ReaderSnapshot | null> {
  if (!canUseDatabase()) {
    return null;
  }

  try {
    const user = await prisma.user.findFirst({
      include: {
        userBooks: {
          include: {
            book: true,
          },
          orderBy: {
            updatedAt: "desc",
          },
        },
        userAchievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    if (!user) {
      return null;
    }

    const books = user.userBooks.map((entry) => ({
      id: entry.book.id,
      title: entry.book.title,
      author: entry.book.author,
      coverUrl: entry.book.coverUrl ?? undefined,
      description: entry.book.description ?? "",
      pageCount: entry.book.pageCount,
      genres: entry.book.genres,
      routeStops: entry.book.routeStops,
      status: entry.status,
      currentPage: entry.currentPage,
    }));

    const currentBook = books.find((entry) => entry.status === "CURRENTLY_READING") ?? books[0];

    if (!currentBook) {
      return null;
    }

    const sessions = await prisma.readingSession.findMany({
      where: { userId: user.id },
      include: { book: true },
      orderBy: { endedAt: "desc" },
      take: 12,
    });

    const quotes = await prisma.quote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const genrePace = buildGenrePaceData(
      sessions.map((entry) => ({
        pagesRead: entry.pagesRead,
        durationSeconds: entry.durationSeconds,
        bookGenres: entry.book.genres,
      })),
    );

    return {
      user: {
        id: user.id,
        displayName: user.displayName,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        totalPages: user.totalPages,
        totalMinutes: user.totalMinutes,
        totalSessions: user.totalSessions,
        booksFinished: user.booksFinished,
        averagePace: user.averagePace,
        readingGoalValue: user.readingGoalValue,
      },
      books,
      currentBook,
      sessions: sessions.map((entry) => ({
        id: entry.id,
        bookId: entry.bookId,
        bookTitle: entry.book.title,
        startedAt: entry.startedAt.toISOString(),
        endedAt: entry.endedAt.toISOString(),
        durationMinutes: Math.round(entry.durationSeconds / 60),
        pagesRead: entry.pagesRead,
        paceSecondsPerPage: entry.paceSecondsPerPage,
        mood: entry.mood ?? undefined,
        focusScore: entry.focusScore ?? undefined,
        notes: entry.notes ?? undefined,
      })),
      achievements: user.userAchievements.map((entry) => ({
        id: entry.id,
        key: entry.achievement.key,
        name: entry.achievement.name,
        description: entry.achievement.description,
        icon: entry.achievement.icon,
        unlocked: true,
      })),
      quotes: quotes.map((entry) => ({
        id: entry.id,
        bookId: entry.bookId,
        quoteText: entry.quoteText,
        pageNumber: entry.pageNumber ?? undefined,
      })),
      weeklyPages: cloneSnapshot(demoSnapshot).weeklyPages,
      heatmap: cloneSnapshot(demoSnapshot).heatmap,
      genrePace,
    };
  } catch {
    return null;
  }
}

export async function getAppSnapshot(): Promise<ReaderSnapshot> {
  const databaseSnapshot = await getDatabaseSnapshot();

  return databaseSnapshot ?? cloneSnapshot(localSnapshot);
}

export async function getBooks() {
  return cloneSnapshot(localSnapshot).books;
}

export async function createReadingSession(input: NewSessionInput) {
  if (canUseDatabase()) {
    try {
      const user = await prisma.user.findFirst({
        include: {
          userBooks: {
            include: {
              book: true,
            },
          },
        },
      });

      if (user) {
        const userBook = user.userBooks.find((entry) => entry.bookId === input.bookId);
        if (userBook) {
          const pagesRead = Math.max(0, input.endPage - input.startPage);
          const session = await prisma.readingSession.create({
            data: {
              userId: user.id,
              bookId: input.bookId,
              userBookId: userBook.id,
              startedAt: new Date(Date.now() - input.durationSeconds * 1000),
              endedAt: new Date(),
              durationSeconds: input.durationSeconds,
              startPage: input.startPage,
              endPage: input.endPage,
              pagesRead,
              paceSecondsPerPage:
                pagesRead > 0 ? input.durationSeconds / pagesRead : input.durationSeconds,
              mood: input.mood,
              focusScore: input.focusScore,
              notes: input.notes,
            },
          });

          await prisma.user.update({
            where: { id: user.id },
            data: {
              totalSessions: { increment: 1 },
              totalPages: { increment: pagesRead },
              totalMinutes: { increment: Math.round(input.durationSeconds / 60) },
              currentStreak: { increment: 1 },
              bestStreak: Math.max(user.bestStreak, user.currentStreak + 1),
            },
          });

          await prisma.userBook.update({
            where: { id: userBook.id },
            data: {
              currentPage: input.endPage,
              lastReadPage: input.endPage,
              status: input.endPage >= userBook.currentPage ? "CURRENTLY_READING" : userBook.status,
            },
          });

          return {
            session,
            receipt: {
              sessionId: session.id,
              bookId: input.bookId,
              bookTitle: userBook.book.title,
              coverUrl: userBook.book.coverUrl ?? undefined,
              date: session.endedAt.toISOString(),
              mood: input.mood,
              distancePages: pagesRead,
              durationMinutes: Math.round(input.durationSeconds / 60),
              paceSecondsPerPage:
                pagesRead > 0 ? input.durationSeconds / pagesRead : input.durationSeconds,
              currentStreak: user.currentStreak + 1,
            } satisfies ReadingReceipt,
          };
        }
      }
    } catch {
      // Fall back to local state in fresh environments.
    }
  }

  const book = localSnapshot.books.find((entry) => entry.id === input.bookId);

  if (!book) {
    throw new Error("Book not found");
  }

  const pagesRead = Math.max(0, input.endPage - input.startPage);
  const session = {
    id: `session-${Date.now()}`,
    bookId: input.bookId,
    bookTitle: book.title,
    startedAt: new Date(Date.now() - input.durationSeconds * 1000).toISOString(),
    endedAt: new Date().toISOString(),
    durationMinutes: Math.round(input.durationSeconds / 60),
    pagesRead,
    paceSecondsPerPage: pagesRead > 0 ? input.durationSeconds / pagesRead : input.durationSeconds,
    mood: input.mood,
    focusScore: input.focusScore,
    notes: input.notes,
  };

  localSnapshot.sessions = [session, ...localSnapshot.sessions];
  localSnapshot.user.totalSessions += 1;
  localSnapshot.user.totalPages += pagesRead;
  localSnapshot.user.totalMinutes += Math.round(input.durationSeconds / 60);
  localSnapshot.user.averagePace = Math.round(
    localSnapshot.sessions.reduce((sum, item) => sum + item.paceSecondsPerPage, 0) /
      localSnapshot.sessions.length,
  );
  book.currentPage = Math.max(book.currentPage, input.endPage);
  localSnapshot.currentBook = book;
  localSnapshot.weeklyPages[localSnapshot.weeklyPages.length - 1].pages += pagesRead;
  localSnapshot.heatmap[localSnapshot.heatmap.length - 1].sessions += 1;
  localSnapshot.genrePace = buildGenrePaceData(
    localSnapshot.sessions.map((entry) => ({
      pagesRead: entry.pagesRead,
      paceSecondsPerPage: entry.paceSecondsPerPage,
      bookGenres:
        localSnapshot.books.find((bookEntry) => bookEntry.id === entry.bookId)?.genres ?? [],
    })),
  );

  if (book.currentPage >= book.pageCount) {
    book.status = "FINISHED";
    localSnapshot.user.booksFinished += 1;
  } else {
    book.status = "CURRENTLY_READING";
  }

  return {
    session,
    receipt: {
      sessionId: session.id,
      bookId: input.bookId,
      bookTitle: book.title,
      coverUrl: book.coverUrl,
      date: session.endedAt,
      mood: input.mood,
      distancePages: pagesRead,
      durationMinutes: Math.round(input.durationSeconds / 60),
      paceSecondsPerPage: pagesRead > 0 ? input.durationSeconds / pagesRead : input.durationSeconds,
      currentStreak: localSnapshot.user.currentStreak,
    } satisfies ReadingReceipt,
  };
}

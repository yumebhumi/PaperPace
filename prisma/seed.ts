import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const bookOne = await prisma.book.upsert({
    where: { id: "book-atomic" },
    update: {},
    create: {
      id: "book-atomic",
      title: "Atomic Habits",
      author: "James Clear",
      description: "A practical route into systems, consistency, and behavior design.",
      pageCount: 320,
      genres: ["Self-help", "Productivity"],
      routeStops: ["Cue", "Craving", "Response", "Reward", "Identity"],
    },
  });

  const bookTwo = await prisma.book.upsert({
    where: { id: "book-martian" },
    update: {},
    create: {
      id: "book-martian",
      title: "The Martian",
      author: "Andy Weir",
      description: "A fast, witty survival novel that rewards steady page momentum.",
      pageCount: 384,
      genres: ["Science Fiction"],
      routeStops: ["Launch", "Impact", "Survival", "Contact", "Return"],
    },
  });

  const bookThree = await prisma.book.upsert({
    where: { id: "book-circe" },
    update: {},
    create: {
      id: "book-circe",
      title: "Circe",
      author: "Madeline Miller",
      description: "A mythic, lyrical read with strong quote potential and mood swings.",
      pageCount: 408,
      genres: ["Fantasy", "Literary"],
      routeStops: ["Exile", "Craft", "Visitors", "Motherhood", "Release"],
    },
  });

  const user = await prisma.user.upsert({
    where: { clerkUserId: "demo-user" },
    update: {},
    create: {
      clerkUserId: "demo-user",
      email: "demo@paperpace.local",
      displayName: "Bhumika",
      timezone: "Asia/Kolkata",
      readingGoalValue: 5,
      currentStreak: 6,
      bestStreak: 11,
      totalPages: 684,
      totalMinutes: 1060,
      totalSessions: 28,
      booksFinished: 3,
      averagePace: 104,
      streak: {
        create: {
          currentCount: 6,
          bestCount: 11,
          lastQualifiedDate: new Date(),
        },
      },
      stats: {
        create: {
          weekPages: 108,
          monthPages: 344,
          yearPages: 684,
          averageSessionMin: 28,
          activeDays: 24,
          weeklyGoal: 5,
        },
      },
    },
  });

  await prisma.userBook.upsert({
    where: {
      userId_bookId: {
        userId: user.id,
        bookId: bookOne.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      bookId: bookOne.id,
      status: "CURRENTLY_READING",
      currentPage: 214,
      lastReadPage: 214,
      startDate: new Date(),
    },
  });

  await prisma.userBook.upsert({
    where: {
      userId_bookId: {
        userId: user.id,
        bookId: bookTwo.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      bookId: bookTwo.id,
      status: "WANT_TO_READ",
      currentPage: 0,
      lastReadPage: 0,
    },
  });

  await prisma.userBook.upsert({
    where: {
      userId_bookId: {
        userId: user.id,
        bookId: bookThree.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      bookId: bookThree.id,
      status: "FINISHED",
      currentPage: 408,
      lastReadPage: 408,
      finishDate: new Date(),
    },
  });

  await prisma.achievement.createMany({
    data: [
      {
        key: "first-session",
        name: "First Mile",
        description: "Completed your first reading session.",
        icon: "Milestone",
      },
      {
        key: "streak-7",
        name: "Seven-Day Rhythm",
        description: "Read seven days in a row.",
        icon: "Flame",
      },
      {
        key: "pages-500",
        name: "Page Builder",
        description: "Read 500 pages total.",
        icon: "BookOpen",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

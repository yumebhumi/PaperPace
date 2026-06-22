import { BooksPage } from "@/components/pages/books-page";
import { getAppSnapshot } from "@/lib/data";

export default async function Books() {
  const snapshot = await getAppSnapshot();

  return <BooksPage snapshot={snapshot} />;
}

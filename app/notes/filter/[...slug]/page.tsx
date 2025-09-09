import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Notes from "./Notes.client";
import { fetchNotes } from "../../../../lib/api";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const queryClient = new QueryClient();

  const resolvedParams = await params;

  const slug = resolvedParams.slug || [];
  const tag = slug[0] && slug[0] !== "all" ? slug[0] : undefined;

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes(1, 12, "", tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes tag={tag} />
    </HydrationBoundary>
  );
}



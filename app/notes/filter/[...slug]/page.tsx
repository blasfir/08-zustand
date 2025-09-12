import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import Notes from "./Notes.client";
import { fetchNotes } from "../../../../lib/api";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params
  const tag = resolvedParams.slug[0] || "All";

  return {
    title: `${tag} notes`,
    description: `Browse notes tagged with ${tag}`,
    openGraph: {
      title: `${tag} notes`,
      description: `Browse notes tagged with ${tag}`,
      url: `https://notehub.com/notes/filter/${tag}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `${tag} notes`,
        },
      ],
    },
  };
}

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


import type { Metadata } from 'next'
import CreateNote from '@/components/CreateNote/CreateNote';

export const metadata: Metadata = {
  title: "Create Note",
  description: "Create a new note to keep your thoughts, tasks, and ideas organized in one place.", 
  openGraph: {
    title: "Create Note",
    description: "Create a new note to keep your thoughts, tasks, and ideas organized in one place.",
    url: "https://08-zustand-phi-seven.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "Create Note",
      },
    ],
  },
};

const CreateNotePage = async () => {

  return (
    <>
      <CreateNote/>
    </>
  );
};

export default CreateNotePage;


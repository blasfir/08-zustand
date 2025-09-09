"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Modal from "../../../../components/Modal/Modal";
import css from "./NotePreview.module.css";
import { fetchNoteById } from "../../../../lib/api";
import type { Note } from "../../../../types/note";

interface NotePreviewProps {
  id: string;
}

export default function NotePreview({ id }: NotePreviewProps) {
  const router = useRouter();

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
    refetchOnMount: false,
  });

  if (isLoading) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Loading note...</p>
      </Modal>
    );
  }

  if (isError || !note) {
    return (
      <Modal onClose={() => router.back()}>
        <p>Failed to load note.</p>
        <button onClick={() => router.back()} className={css.backBtn}>
          Close
        </button>
      </Modal>
    );
  }

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <header className={css.header}>
          <h2>{note.title}</h2>
          <button onClick={() => router.back()} className={css.backBtn}>
            Close
          </button>
        </header>
        <div>
          <ul>
            <li className={css.item}>
              <p className={css.content}>{note.content}</p>
            </li>
            <li className={css.item}>
              <p className={css.date}>{note.createdAt}</p>
            </li>
            <li className={css.item}>
              <p className={css.tag}>{note.tag}</p>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
}

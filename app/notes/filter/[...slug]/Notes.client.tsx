"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import NoteList from "../../../../components/NoteList/NoteList";
import Pagination from "../../../../components/Pagination/Pagination";
import SearchBox from "../../../../components/SearchBox/SearchBox";
import css from "./page.module.css";
import { useDebounce } from "use-debounce";
import { fetchNotes } from "../../../../lib/api";
import type { NOTEHUBResponse } from "../../../../lib/api";
import type { Note } from "../../../../types/note";
import Link from "next/link";

type Props = {
  tag?: string;
};

export default function Notes({ tag }: Props) {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading } = useQuery<NOTEHUBResponse>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () => fetchNotes(page, 12, debouncedSearch, tag),
    placeholderData: (prevData) => prevData,
  });

  useEffect(() => {
    if (data?.totalPages !== undefined) {
      setPageCount(data.totalPages);
    }
  }, [data]);

  const notes: Note[] = data?.notes || [];

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(newSearch) => {
            setPage(1);
            setSearch(newSearch);
          }}
        />
        {pageCount > 1 && (
          <Pagination
            currentPage={page}
            onPageChange={setPage}
            pageCount={pageCount}
          />
        )}
         <Link href="/notes/action/create" className={css.createButton}>
          Create note +
        </Link>
      </header>

      {isLoading && <strong>Loading...</strong>}
      {notes.length > 0 && <NoteList notes={notes} />}

    </div>
  );
}



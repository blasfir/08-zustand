import Link from 'next/link';
import css from "./SidebarNotes.module.css";

const tags = ["All", "Todo", "Work", "Meeting", "Personal", "Shopping"];

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
        {tags.map((tag) => (
          <li key={tag} className={css.menuItem}>
            <Link
              href={tag === "All" ? "/notes/filter/All" : `/notes/filter/${tag}`}
              className={css.menuLink}
            >
              {tag}
            </Link>
          </li>
        ))}
    </ul>
  );
};

import { useCallback, useState } from "react";
import { NewNoteCard } from "./componets/new-note-card";
import { NoteCard } from "./componets/note-card";

interface Note {
  id: string;
  content: string;
  date: Date;
}

const NOTES_KEY = "notes" as const;

function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const notes = localStorage.getItem(NOTES_KEY);
    if (notes) {
      return JSON.parse(notes);
    }
    return [];
  });
  const [search, setSearch] = useState("");

  const handleAddNewNote = useCallback(
    (content: string) => {
      const newNote: Note = {
        id: crypto.randomUUID(),
        date: new Date(),
        content,
      };
      setNotes((prev) => {
        localStorage.setItem(NOTES_KEY, JSON.stringify([newNote, ...prev]));
        return [newNote, ...prev];
      });
    },
    [setNotes]
  );

  const handleRemoveNote = useCallback(
    (id: string) => {
      const newArray = notes.filter((note) => note.id !== id);
      setNotes(newArray);
      localStorage.setItem(NOTES_KEY, JSON.stringify(newArray));
    },
    [setNotes, notes]
  );

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    setSearch(event.target.value);
  }

  const filteredNotes = search
    ? notes.filter((note) =>
        note.content.toLowerCase().includes(search.toLowerCase())
      )
    : notes;
  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <form className="w-full">
        <input
          type="text"
          placeholder="Browse here your notes..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>
      <div className="h-px bg-slate-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard onAddNote={handleAddNewNote} />
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            removeNote={handleRemoveNote}
            id={note.id}
            content={note.content}
            date={note.date}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { X } from "lucide-react";

interface NoteCardProps {
  id: string;
  date: Date;
  content: string;
  removeNote: (id: string) => void;
}

export function NoteCard({ date, content, id, removeNote }: NoteCardProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className="text-left flex flex-col rounded-md bg-slate-700 p-5 gap-3 relative overflow-hidden hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-200">
          {formatDistanceToNow(date, { addSuffix: true })}
        </span>
        <p className="text-sm leading-6 text-slate-400">{content}</p>
        <div className="absolute bottom-0 right-0 left-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-500 hover:bg-slate-300">
            <X className="size-5" />
          </Dialog.Close>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <span className="text-sm font-medium text-slate-200">
              {formatDistanceToNow(date, { addSuffix: true })}
            </span>
            <p className="text-sm leading-6 text-slate-400">{content}</p>
          </div>
          <button
            onClick={() => removeNote(id)}
            type="button"
            className="cursor-pointer w-full text-center text-sm py-4 bg-slate-800 text-slate-300 outline-none font-medium group"
          >
            Want to{" "}
            <span className="text-red-400 group-hover:underline">
              remove this note
            </span>
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

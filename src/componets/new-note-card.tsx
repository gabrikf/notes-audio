import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, FormEventHandler, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onAddNote: (content: string) => void;
}

let speechRecognition: SpeechRecognition | null;

export function NewNoteCard({ onAddNote }: NewNoteCardProps) {
  const [shouldShouldOnboarding, setShouldShowOnBoarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState("");

  function handleStartEditor() {
    setShouldShowOnBoarding(false);
  }

  function handleChangeContent(e: ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    if (e.target.value === "") setShouldShowOnBoarding(true);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!content) {
      toast.error("Content is empty!");
      return;
    }
    onAddNote(content);

    setContent("");
    setShouldShowOnBoarding(true);
    toast.success("Note added successfully!");
  }

  function handleResetModal() {
    setContent("");
    setShouldShowOnBoarding(true);
  }

  function handleStartRecording() {
    const isSpeechRecognitionAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    if (!isSpeechRecognitionAvailable) {
      toast.error("Tool not supported, try other browser");
      return;
    }
    setIsRecording(true);
    setShouldShowOnBoarding(false);
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((acc, cur) => {
        return acc.concat(cur[0].transcript);
      }, "");

      setContent(transcription);
    };
    speechRecognition.onerror = (event) => {
      console.error(event);
    };
    speechRecognition.start();
  }

  function handleStopRecording() {
    setIsRecording(false);
    if (speechRecognition) {
      speechRecognition.stop();
    }
  }

  return (
    <Dialog.Root onOpenChange={handleResetModal}>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3">
        <span className="text-sm font-medium text-slate-200">Add a note</span>
        <p className="text-sm leading-6 text-slate-400">
          Record or type a note...
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2  md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] md:w-full bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 p-1.5 bg-slate-500 hover:bg-slate-300">
            <X className="size-5" />
          </Dialog.Close>
          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-200">
                Adicionar nota
              </span>
              {shouldShouldOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Start{" "}
                  <button
                    type="button"
                    className="text-lime-500 hover:underline"
                    onClick={handleStartRecording}
                  >
                    recording an audio to transcript to text{" "}
                  </button>{" "}
                  or if you prefer{" "}
                  <button
                    type="button"
                    onClick={handleStartEditor}
                    className="text-lime-500 hover:underline"
                  >
                    just use text
                  </button>
                  .
                </p>
              ) : (
                <textarea
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  autoFocus
                  onChange={handleChangeContent}
                  value={content}
                />
              )}
            </div>
            {isRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                className="w-full flex items-center gap-1 justify-center cursor-pointer text-center text-sm py-4 bg-slate-900 text-slate-300 outline-none font-medium hover:text-slate-100 transition-colors duration-200"
              >
                <div className="bg-red-500 size-2.5 rounded-full animate-pulse" />
                Recording! (Click here to stop)
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer w-full text-center text-sm py-4 bg-lime-400 text-lime-950 outline-none font-medium hover:bg-lime-500 transition-colors duration-200"
              >
                Salvar nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

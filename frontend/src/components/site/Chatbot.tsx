import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Sparkles, Paperclip, Image as ImageIcon, Maximize2, Minimize2, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

// This file defines the Chatbot component for the frontend application. It includes a button to toggle the chatbot open or closed, a chat window that displays messages from the user and the bot, and an input field for the user to type their messages. The Chatbot component uses React state to manage the open/closed state of the chatbot, the list of messages, and the current input value. It also includes a set of predefined suggestions that the user can click to send as messages. The component is styled using Tailwind CSS classes and includes animations for opening and closing the chat window.
type Msg = { id: number; from: "bot" | "you"; text: string; image?: string };
const seed: Msg[] = [
  {
    id: 1,
    from: "bot",
    text: "Hi! I'm ViBeS Lab Assistant 🤖 — ask me about the lab, our research domains, or scholars.",
  },
];
const suggestions = [
  "Who leads the lab?",
  "Show research domains",
  "Recent publications",
  "How do I join?",
];

const MarkdownImage = ({ node, ...props }: any) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 my-2 text-xs font-medium text-muted-foreground bg-muted/50 rounded border border-border/50">
        <ImageIcon size={12} />
        {props.alt || "Image"} (Unavailable)
      </span>
    );
  }
  
  return (
    <img 
      {...props} 
      className="max-w-full rounded-md my-3 max-h-60 object-contain border border-border/40"
      alt={props.alt || "Image"}
      onError={() => setError(true)}
    />
  );
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>(seed);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setSelectedImage(reader.result as string);
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  const send = async (text: string) => {
    if ((!text.trim() && !selectedImage) || isLoading) return;
    
    const imageToSend = selectedImage; // Keep a local reference
    const userMsg: Msg = { id: Date.now(), from: "you", text, image: imageToSend || undefined };
    setMsgs((m) => [...m, userMsg]);
    setInput("");
    setSelectedImage(null); // Clear preview immediately for better UX
    setIsLoading(true);
    
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const payload: any = {
        message: text,
        history: msgs.map(m => ({
          role: m.from === "you" ? "user" : "assistant",
          content: m.text
        }))
      };
      
      if (imageToSend) {
        payload.image = imageToSend;
      }

      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      
      if (!response.ok) {
        try {
          const errData = await response.json();
          setMsgs((m) => [
            ...m,
            { id: Date.now() + 1, from: "bot", text: errData.error ? `Server Error: ${errData.error}` : "Oops, something went wrong." },
          ]);
        } catch(e) {
          setMsgs((m) => [
            ...m,
            { id: Date.now() + 1, from: "bot", text: "Oops, something went wrong communicating with the server." },
          ]);
        }
      } else {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (reader) {
          let answerText = "";
          let buffer = "";
          const botMsgId = Date.now() + 1;
          setMsgs((m) => [...m, { id: botMsgId, from: "bot", text: "" }]);
          
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ""; // Keep the incomplete line in the buffer
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6);
                if (dataStr.trim() === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.error) {
                      answerText += `\n\n**Error**: ${parsed.error}`;
                      setMsgs((m) => m.map(msg => msg.id === botMsgId ? { ...msg, text: answerText } : msg));
                  } else if (parsed.chunk) {
                      answerText += parsed.chunk;
                      setMsgs((m) => m.map(msg => msg.id === botMsgId ? { ...msg, text: answerText } : msg));
                  }
                } catch (e) {
                  // If JSON parse fails, it might be an incomplete chunk due to weird flushing, but buffering usually fixes this.
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Chat generation stopped by user.");
      } else {
        console.error("Chat error:", error);
        setMsgs((m) => [
          ...m,
          { id: Date.now() + 1, from: "bot", text: "Oops, failed to reach the server. Make sure the backend is running." },
        ]);
      }
    } finally {
      setAbortController(null);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleOpenChatbot = (e: CustomEvent) => {
      setOpen(true);
      if (e.detail && typeof e.detail === "string") {
        // Automatically send the message from the event
        send(e.detail);
      }
    };

    window.addEventListener("open-chatbot", handleOpenChatbot as EventListener);
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot as EventListener);
  }, [msgs, send]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-full grid place-items-center bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:scale-105 transition"
        aria-label="Open chatbot"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-5 z-50 origin-bottom-right transition-all duration-300",
          open ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none",
          isMaximized ? "w-[min(95vw,800px)]" : "w-[min(92vw,360px)]"
        )}
      >
        <div className="rounded-2xl border border-border/70 glass overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/60 bg-background/50">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 grid place-items-center shrink-0">
              <Sparkles size={16} className="text-primary" />
            </div>
            <div className="leading-tight flex-1">
              <div className="text-sm font-semibold">ViBeS Lab Assistant</div>
              <div className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary pulse-dot" /> online · UI preview
              </div>
            </div>
            <button 
              onClick={() => setIsMaximized(!isMaximized)}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-black/5"
              title={isMaximized ? "Minimize" : "Maximize"}
            >
              {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          <div className={cn("overflow-y-auto p-3 space-y-2 transition-all duration-300", isMaximized ? "h-[65vh]" : "max-h-80")}>
            {msgs.map((m) => (
              <div
                key={m.id}
                className={cn("flex", m.from === "you" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-3 py-2 text-sm",
                    m.from === "you"
                      ? "bg-primary/15 border border-primary/30 text-foreground"
                      : "bg-card border border-border/60 text-foreground",
                  )}
                >
                  {m.image && (
                    <img 
                      src={m.image} 
                      alt="Uploaded by user" 
                      className="max-w-full rounded-md mb-2 object-cover max-h-48 cursor-pointer hover:opacity-90 transition-opacity" 
                      onClick={() => setExpandedImage(m.image!)}
                    />
                  )}
                  {m.from === "bot" ? (
                    <ReactMarkdown
                      components={{
                        strong: ({node, ...props}) => <span className="font-bold" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1 my-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1 my-2" {...props} />,
                        li: ({node, ...props}) => <li {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        img: MarkdownImage,
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-[11px] px-2 py-1 rounded-full border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/40"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-background/50 border-t border-border/60">
            {selectedImage && (
              <div className="px-3 pt-3 pb-1">
                <div className="relative h-14 w-14 inline-block group">
                  <img 
                    src={selectedImage} 
                    alt="Upload preview" 
                    className="object-cover h-full w-full rounded-md border border-border/70 shadow-sm cursor-pointer" 
                    onClick={() => setExpandedImage(selectedImage)}
                  />
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-background border border-border/70 rounded-full p-0.5 text-muted-foreground hover:text-foreground shadow-md transition-transform hover:scale-110"
                    title="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                title="Attach image"
              >
                <Paperclip size={18} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload}
                accept="image/*" 
                className="hidden" 
              />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onPaste={handlePaste}
                placeholder={isLoading ? "Thinking..." : "Ask about ViBeS Lab…"}
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              {isLoading ? (
                <button
                  type="button"
                  onClick={() => abortController?.abort()}
                  className="h-8 w-8 grid place-items-center rounded-md bg-red-500/10 text-red-500 hover:bg-red-500/20"
                  title="Stop generating"
                >
                  <Square size={13} fill="currentColor" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() && !selectedImage}
                  className="h-8 w-8 grid place-items-center rounded-md bg-primary/20 text-primary hover:bg-primary/30 disabled:opacity-50"
                  title="Send message"
                >
                  <Send size={15} />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {expandedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setExpandedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/50 rounded-full p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setExpandedImage(null);
            }}
          >
            <X size={24} />
          </button>
          <img 
            src={expandedImage} 
            alt="Expanded view" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotesStore } from "@/store/useNotesStore";
import { answerQuestionFromNotes } from "@/lib/openai";
import { MessageCircle, Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatDialogProps {
  children: React.ReactNode;
}

export function ChatDialog({ children }: ChatDialogProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hi! I'm your AI assistant. I can help answer questions based on your notes. What would you like to know?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { notes } = useNotesStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: question.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const answer = await answerQuestionFromNotes(question.trim(), notes);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: answer,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to get answer from AI");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <span>Chat with your Notes</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 chat-scroll">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.isUser ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isUser
                      ? "bg-blue-500 text-white"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  }`}
                >
                  {message.isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg shadow-sm ${
                    message.isUser
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-100 text-gray-900 border"
                  }`}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    className="text-sm prose prose-sm max-w-none prose-p:my-1 prose-a:text-blue-600 prose-li:marker:text-blue-500"
                  >
                    {message.content}
                  </ReactMarkdown>

                  <p
                    className={`text-xs mt-2 ${
                      message.isUser ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 border px-4 py-3 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex space-x-2 pt-4 border-t">
          <Input
            placeholder="Ask a question about your notes..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !question.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

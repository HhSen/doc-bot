"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlertCircleIcon, BotIcon, UserIcon } from "lucide-react";
import PromptForm from "@/components/chat/prompt-form";
import {
  ChatCompletionRequest,
  ChatCompletionResponseSchema,
} from "@/lib/types";
import type {
  ChatCompletionMessageParam,
  ChatCompletionUserMessageParam,
} from "openai/resources";

// Display metadata for UI purposes (fields not in OpenAI's type)
interface MessageDisplayMeta {
  id: string;
  timestamp: Date;
  // Extend with more display-only fields as needed:
  // isStreaming?: boolean;
  // error?: string;
}

// Wrapper types that extend OpenAI's types with display metadata
type DisplayMessage = ChatCompletionMessageParam & MessageDisplayMeta;

// Factory to create display messages with auto-generated metadata
function NewDisplayMessage<T extends ChatCompletionMessageParam>(
  message: T,
): T & MessageDisplayMeta {
  return {
    ...message,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };
}

export default function ChatPage() {
  const [messages, setMessages] = React.useState<DisplayMessage[]>([
    NewDisplayMessage({
      role: "assistant",
      content: "You are a helpful assistant...",
    }),
  ]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (input: string) => {
    if (!input.trim() || loading) return;

    const message = NewDisplayMessage<ChatCompletionUserMessageParam>({
      role: "user",
      content: input,
    });

    setLoading(true);
    setError(null);
    setMessages((prev) => [...prev, message]);

    console.log("waiting for response...");
    const request: ChatCompletionRequest = {
      input: [
        ...messages.map((msg): ChatCompletionMessageParam => {
          const { ...params } = msg;
          return params;
        }),
        message,
      ],
    };
    try {
      const response = await fetch("/api/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
      const data = ChatCompletionResponseSchema.parse(await response.json());
      if (!data.response || !data.success) {
        throw Error(`failed to receive from provider: ${data.message}`);
      }
      const choice = data.response?.choices[0];

      setMessages((prev) => [
        ...prev,
        NewDisplayMessage({
          role: choice.message.role,
          content: choice.message.content,
        }),
      ]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`unknown error: ${err}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl h-150 flex flex-col pb-0">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <BotIcon className="size-5" />
            Chat with Bot
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>
                      <BotIcon className="size-3" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex gap-1">
                      <span className="size-2 bg-foreground/50 rounded-full animate-bounce" />
                      <span className="size-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.1s]" />
                      <span className="size-2 bg-foreground/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon className="size-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <div className="flex gap-2">
              <PromptForm onSend={handleSend} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChatMessage({ message }: { message: DisplayMessage }) {
  const asstMessage = message.role === "assistant" ? true : false;

  // Helper to extract text content (handles both string and content parts)
  const getTextContent = (): string => {
    if (typeof message.content === "string") return message.content;
    if (Array.isArray(message.content)) {
      return message.content
        .filter(
          (part): part is { type: "text"; text: string } =>
            part.type === "text",
        )
        .map((part) => part.text)
        .join("");
    }
    return "";
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        !asstMessage && "flex-row-reverse",
      )}
    >
      <Avatar size="sm">
        <AvatarFallback>
          {asstMessage ? (
            <BotIcon className="size-6" />
          ) : (
            <UserIcon className="size-6" />
          )}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "rounded-lg px-3 py-2 max-w-[80%]",
          asstMessage ? "bg-muted" : "bg-primary text-primary-foreground",
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{getTextContent()}</p>
        <span className="text-xs opacity-50 mt-1 block">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  PlusIcon,
  PaperclipIcon,
  SparklesIcon,
  ShoppingBagIcon,
  WandIcon,
  MousePointerIcon,
  MoreHorizontalIcon,
  ShareIcon,
  BookOpenIcon,
  GlobeIcon,
  PenToolIcon,
  ArrowUpIcon,
} from "lucide-react";

export default function PromptForm({
  onSend,
}: {
  onSend: (input: string) => void;
}) {
  const [dictateEnabled, setDictateEnabled] = React.useState(false);

  // ========== refs ==========
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // ========== handlers ==========
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!inputRef.current) {
        return;
      }

      console.log("sending message...");
      onSend(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  const handleClick = () => {
    setDictateEnabled(!dictateEnabled);

    if (!inputRef.current) {
      return;
    }

    console.log("sending message...");
    onSend(inputRef.current.value);
    inputRef.current.value = "";
  };

  return (
    <>
      <Field>
        <FieldLabel htmlFor="prompt" className="sr-only">
          Chat
        </FieldLabel>
        <InputGroup>
          <InputGroupTextarea
            id="prompt"
            ref={inputRef}
            placeholder="Ask anything"
            onKeyDown={handleKeyDown}
            className="p-4"
          />
          <InputGroupAddon align="block-end" className="flex justify-between">
            <DropdownMenu>
              <Tooltip>
                <DropdownMenuTrigger asChild>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDictateEnabled(!dictateEnabled)}
                      className="rounded-4xl"
                    >
                      <PlusIcon />
                    </InputGroupButton>
                  </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent>
                  Add files and more <Kbd>/</Kbd>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                className="w-56"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem>
                  <PaperclipIcon />
                  Add photos & files
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SparklesIcon />
                  Deep research
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ShoppingBagIcon />
                  Shopping research
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <WandIcon />
                  Create image
                </DropdownMenuItem>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem>
                      <MousePointerIcon />
                      Agent mode
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="font-medium">35 left</div>
                    <div className="text-primary-foreground/80 text-xs">
                      More available for purchase
                    </div>
                  </TooltipContent>
                </Tooltip>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <MoreHorizontalIcon />
                    More
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <ShareIcon />
                      Add sources
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BookOpenIcon />
                      Study and learn
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <GlobeIcon />
                      Web search
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PenToolIcon />
                      Canvas
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            <InputGroupButton
              size="icon-sm"
              variant="default"
              onClick={handleClick}
              className="rounded-4xl"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Field>
    </>
  );
}

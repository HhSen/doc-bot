import { z } from "zod";
import type {
  ChatCompletion,
  ChatCompletionMessageParam,
} from "openai/resources";

// Chat Completion API Response Schemas
export const ChatCompletionResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  response: z.custom<ChatCompletion>().optional(),
});

export type ChatCompletionResponse = z.infer<
  typeof ChatCompletionResponseSchema
>;

export const ChatCompletionRequestSchema = z.object({
  input: z.array(z.custom<ChatCompletionMessageParam>()),
});

export type ChatCompletionRequest = z.infer<typeof ChatCompletionRequestSchema>;

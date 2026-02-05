import { OpenAIClient } from "@/lib/agent/openai";
import {
  ChatCompletionRequest,
  ChatCompletionRequestSchema,
} from "@/lib/types";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const data: ChatCompletionRequest = ChatCompletionRequestSchema.parse(json);
    const response = await OpenAIClient.chat.completions.create({
      model: "kimi-k2.5",
      messages: data.input,
      tools: [],
    });

    if (response) {
      return Response.json(
        { success: true, message: "", response },
        { status: 200 },
      );
    }

    throw new Error("No response received");
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : "Unexpected error";

    return Response.json({ success: false, message }, { status: 500 });
  }
}

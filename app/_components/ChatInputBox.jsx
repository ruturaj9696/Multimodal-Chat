import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MicIcon, Paperclip, SendIcon } from "lucide-react";
import React, { useContext, useState } from "react";
import AiMultiModals from "./AiMultiModals";
import { AiSelectedModelContext } from "../context/AiSelectedModelContext";
import axios from "axios";

const ChatInputBox = () => {
  const [userInput, setUserInput] = useState("");
  const { aiSelectedModels, messages, setMessages } = useContext(
    AiSelectedModelContext
  );

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // 1️⃣ Add user message to every model
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiSelectedModels).forEach((modelKey) => {
        if (aiSelectedModels[modelKey].enable) {
          updated[modelKey] = [
            ...(prev[modelKey] ?? []),
            { role: "user", content: userInput },
          ];
        }
      });
      return updated;
    });

    const currentInput = userInput;
    setUserInput("");

    // 2️⃣ Fetch response from each model
    Object.entries(aiSelectedModels).forEach(
      async ([parentModel, modelInfo]) => {
        if (
          (!modelInfo?.modelId && !modelInfo?.enable) ||
          aiSelectedModels[parentModel].enable == false
        )
          return;

        // Add placeholder
        setMessages((prev) => ({
          ...prev,
          [parentModel]: [
            ...(prev[parentModel] ?? []),
            {
              role: "assistant",
              content: "Thinking...",
              model: parentModel,
              loading: true,
            },
          ],
        }));

        try {
          const result = await axios.post("/api/ai-multi-modal", {
            model: modelInfo.modelId,
            message: [{ role: "user", content: currentInput }], // FIXED
            parentModel,
          });

          const { aiResponse, model } = result.data;
          console.log("result is ", result.data);
          // Replace loading message
          setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];
            const loadingIndex = updated.findIndex((m) => m.loading === true);

            if (loadingIndex !== -1) {
              updated[loadingIndex] = {
                role: "assistant",
                content: aiResponse,
                model,
                loading: false,
              };
            }

            return { ...prev, [parentModel]: updated };
          });
        } catch (err) {
          console.error(err);
          setMessages((prev) => ({
            ...prev,
            [parentModel]: [
              ...(prev[parentModel] ?? []),
              { role: "assistant", content: "⚠️ Error fetching response." },
            ],
          }));
        }
      }
    );
  };

  return (
    <div>
      <div className="relative h-screen">
        <AiMultiModals />
      </div>

      <div className="fixed bottom-0 left-0 px-4 pb-6 flex justify-center w-full">
        <div className="w-full border rounded-xl shadow-sm max-w-2xl p-4">
          <Input
            type="text"
            placeholder="Ask me anything..."
            className="border-0 outline-none"
            onChange={(e) => setUserInput(e.target.value)}
            onClick={(e) => event == "Enter" && handleSend}
            value={userInput}
          />

          <div className="flex justify-between mt-2">
            <Button variant="ghost" size="icon">
              <Paperclip />
            </Button>

            <div className="flex gap-5">
              <Button variant="ghost" size="icon">
                <MicIcon />
              </Button>

              <Button size="icon" onClick={handleSend}>
                <SendIcon />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;

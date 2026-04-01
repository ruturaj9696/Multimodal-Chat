import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MicIcon, Paperclip, SendIcon } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import AiMultiModals from "./AiMultiModals";
import { AiSelectedModelContext } from "../context/AiSelectedModelContext";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

const ChatInputBox = () => {
  const [userInput, setUserInput] = useState("");
  const { aiSelectedModels, messages, setMessages } = useContext(
    AiSelectedModelContext
  );
  const [chatId, setChatId] = useState(null);
  const { user } = useUser();

  const params = useSearchParams();

  // Create unique chat ID once
  useEffect(() => {
    if (params.get("chatId")) {
      setChatId(params.get("chatId"));
      GetMessages();
    } else {
      setChatId(uuidv4());
    }
  }, [params]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Add user message to each enabled model
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

    // Fetch response from each enabled model
    Object.entries(aiSelectedModels).forEach(
      async ([parentModel, modelInfo]) => {
        if (!modelInfo?.modelId || !modelInfo?.enable) return;

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

          // Replace placeholder with real response
          setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];
            const loadingIdx = updated.findIndex((m) => m.loading);

            if (loadingIdx !== -1) {
              updated[loadingIdx] = {
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
  const saveMessage = async () => {
    if (!chatId) return;
    const docRef = doc(db, "chatHistory", chatId);
    await setDoc(docRef, {
      chatId,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      messages,
      lastupdated: new Date(),
    });
  };

  // Save only when chatId exists & messages updated
  useEffect(() => {
    if (!chatId) return;
    if (!messages) return;

    saveMessage();
  }, [messages, chatId]);

  const GetMessages = async () => {
    const docRef = doc(db, "chatHistory", chatId);
    const docSnap = await getDoc(docRef);
    const docData = docSnap.data();
    setMessages(docData);
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
            className="border-0 outline-none rounded-lg" // Updated to add rounded corners
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
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

              <Button size="icon" onClick={handleSend} className="bg-blue-500 text-white rounded-full"> // Updated to add a prominent send button
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

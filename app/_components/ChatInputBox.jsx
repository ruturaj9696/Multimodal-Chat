import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MicIcon, Paperclip, Send, SendIcon } from "lucide-react";
import React from "react";
import AiMultiModals from "./AiMultiModals";

const ChatInputBox = () => {
  return (
    <div>
      {/* Page content */}
      <div className="relative h-screen">
        <div><AiMultiModals/> </div>
      </div>
      {/* Chat Input box */}
      <div className="fixed bottom-0 left-0 px-4 pb-6 flex justify-center w-full">
        <div className="w-full border rounded-xl shadow-sm max-w-2xl p-4">
          <Input
            type={"text"}
            placeholder="Ask me anything..."
            className="border-0 outline-none"
          />
          <div>
            <div className="flex justify-between mt-2">
              <Button variant={"ghost"} size={"icon"}>
                <Paperclip />
              </Button>
              <div className="flex gap-5">
                <Button variant={"ghost"} size={"icon"}>
                  <MicIcon />
                </Button>
                <Button size={"icon"}>
                  <SendIcon />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputBox;

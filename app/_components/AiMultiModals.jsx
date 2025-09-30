"use client";

import React, { useEffect, useState } from "react";
import AIModelList from "../shared/AIModelList";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MessageSquare } from "lucide-react";

const AiMultiModals = () => {
  const [aiModalList, setAiModalList] = useState(AIModelList);

  // Handle toggle separately by model id
  const onToggleChange = (model, value) => {
    setAiModalList((prevList) =>
      prevList.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );
  };

  return (
    <div className="flex flex-1 h-[75vh] border-1 w-full">
      {aiModalList.map((model) => (
        <div
          key={model.id}
          className={
            model.enable
              ? `flex flex-col border h-full overflow-auto min-w-[400px]`
              : `flex flex-col border h-full overflow-auto min-w-[100px]`
          }
        >
          <div className="flex w-full items-center justify-between border-b h-[70px] p-4">
            <div className="flex items-center gap-4">
              <Image src={model.icon} alt={model.name} width={25} height={25} />
              {model.enable && (
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={model.subModel[0].name} />
                  </SelectTrigger>
                  <SelectContent>
                    {model.subModel.map((subModel) => (
                      <SelectItem key={subModel.id} value={subModel.id}>
                        {subModel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              {model.enable ? (
                <Switch
                  checked={model.enable}
                  onCheckedChange={(checked) =>
                    onToggleChange(model.model, checked)
                  }
                />
              ) : (
                <MessageSquare
                  onClick={() => onToggleChange(model.model, true)}
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AiMultiModals;

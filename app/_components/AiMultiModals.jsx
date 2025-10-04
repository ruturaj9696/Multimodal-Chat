"use client";

import React, { useContext, useEffect, useState } from "react";
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
import { LockIcon, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { AiSelectedModelContext } from "../context/AiSelectedModelContext";
import { useUser } from "@clerk/nextjs";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";

const AiMultiModals = () => {
  const [aiModalList, setAiModalList] = useState(AIModelList);
  const { aiSelectedModels, setAiSelectedModels } = useContext(
    AiSelectedModelContext
  );
  const { user } = useUser();
  // Handle toggle separately by model id
  const onToggleChange = (model, value) => {
    setAiModalList((prevList) =>
      prevList.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );
  };

  // Update the model id
  const onSelectValue = async (parentModel, value) => {
    setAiSelectedModels((prev) => ({
      ...prev,
      [parentModel]: {
        ...prev[parentModel],
        modelId: value,
      },
    }));

    //Update to the firebase database
    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docRef, {
      selectedModelRef: aiSelectedModels,
    });
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
                <Select
                  defaultValue={aiSelectedModels[model.model].modelId}
                  onValueChange={(value) => onSelectValue(model.model, value)}
                  disabled={model.premium === true}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={aiSelectedModels[model.model].modelId}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup className="p-3">
                      <SelectLabel className="px-2">Free</SelectLabel>
                      {model.subModel.map(
                        (subModel, index) =>
                          subModel.premium === false && (
                            <SelectItem key={index} value={subModel.id}>
                              {subModel.name}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>
                    <SelectGroup className="p-3">
                      <SelectLabel className="mx-2">Premium</SelectLabel>
                      {model.subModel.map(
                        (subModel, index) =>
                          subModel.premium === true && (
                            <SelectItem
                              key={index}
                              value={subModel.name}
                              disabled={subModel.premium}
                            >
                              {subModel.name} {subModel.premium && <LockIcon />}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>
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
          {model.premium && model.enable && (
            <div className="flex justify-center items-center h-full">
              <Button>
                {" "}
                <LockIcon /> Upgrade to Premium
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AiMultiModals;

import React from "react";
import { Progress } from "@/components/ui/progress";
const UseCreditProgressBar = () => {
  return (
    <div className="mb-4 p-3 border rounded-xl flex flex-col ">
      <h2 className="text-lg font-bold">Free Plan</h2>
      <p>0/5 Messages used</p>
      <Progress value={33} />
    </div>
  );
};

export default UseCreditProgressBar;

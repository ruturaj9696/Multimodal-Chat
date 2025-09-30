import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import React from "react";

const AppHeader = () => {
  return (
    <div className="p-3 w-full shadow flex justify-between">
      <SidebarTrigger />
      <Button>Sign In</Button>
    </div>
  );
};

export default AppHeader;

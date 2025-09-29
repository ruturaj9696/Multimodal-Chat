"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  return (
    <Sidebar>
      <SidebarHeader />
      <div className="p-3">
        <div className=" flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={"./logo.svg"}
              alt="logo"
              width={50}
              height={50}
              className="w-[40px] h-[40px]"
            />
            <h2 className="text-xl font-bold">AI Fusion</h2>
          </div>
          <div>
            {theme === "light" ? (
              <Button onClick={() => setTheme("dark")}>
                <SunIcon />
              </Button>
            ) : (
              <Button onClick={() => setTheme("light")}>
                <MoonIcon />
              </Button>
            )}
          </div>
        </div>
        <div>
          <Button className=" mt-6 w-full">+ New chat</Button>
        </div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <div className="p-3">
            <div className="font-bold text-lg">Chat</div>
            <div className="text-muted-foreground">
              Sign in to chat with multiple AI models
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button className="w-full" size={"lg"}>
          Sign In
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

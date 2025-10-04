"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { SignInButton, useUser } from "@clerk/nextjs";
import { BoltIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import UseCreditProgressBar from "./UseCreditProgressBar";
export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
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
          {user ? (
            <Button
              className=" mt-6 w-full"
              onClick={() => {
                console.log("New chat");
              }}
            >
              + New chat
            </Button>
          ) : (
            <SignInButton>
              <Button className=" mt-6 w-full">+ New chat</Button>
            </SignInButton>
          )}
        </div>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <div className="p-3">
            <div className="font-bold text-lg">Chat</div>
            {!user && (
              <div className="text-muted-foreground">
                Sign in to chat with multiple AI models
              </div>
            )}
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {!user ? (
          <div className="p-3">
            <SignInButton mode="modal">
              <Button className="w-full">Sign In</Button>
            </SignInButton>
          </div>
        ) : (
          <div className="p-3">
            <UseCreditProgressBar />
            <Button className={" w-full"}>
              <BoltIcon />
              Upgrade Plan
            </Button>
            <Button className="flex items-center mt-2 w-full">
              <UserIcon /> {user.fullName}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

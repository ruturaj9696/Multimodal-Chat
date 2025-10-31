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
import { useEffect, useState } from "react";
export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();

  // prevent hydration mismatch by rendering theme toggle only after mount
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sidebar>
      <SidebarHeader />
      <div className="p-3">
        <div className=" flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="logo"
              width={40}
              height={40}
              className="w-[40px] h-[40px]"
              priority
            />
            <h2 className="text-xl font-bold">AI Fusion</h2>
          </div>

          {/* Theme Toggle */}
          <div>
            {mounted &&
              (theme === "light" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme("dark")}
                >
                  <SunIcon className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme("light")}
                >
                  <MoonIcon className="w-5 h-5" />
                </Button>
              ))}
          </div>
        </div>

        {/* New Chat / Sign In */}
        <div>
          {user ? (
            <Button
              className="mt-6 w-full"
              onClick={() => console.log("New chat")}
            >
              + New chat
            </Button>
          ) : (
            <SignInButton>
              <Button className="mt-6 w-full">+ New chat</Button>
            </SignInButton>
          )}
        </div>
      </div>

      {/* Sidebar Content */}
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

      {/* Sidebar Footer */}
      <SidebarFooter>
        {!user ? (
          <div className="p-3">
            <SignInButton mode="modal">
              <Button className="w-full">Sign In</Button>
            </SignInButton>
          </div>
        ) : (
          <div className="p-3 space-y-2">
            <UseCreditProgressBar />
            <Button className="w-full">
              <BoltIcon className="mr-2" />
              Upgrade Plan
            </Button>
            <Button className="flex items-center w-full">
              <UserIcon className="mr-2" />
              {user.fullName}
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

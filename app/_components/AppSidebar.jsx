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
import Link from "next/link";
import UseCreditProgressBar from "./UseCreditProgressBar";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import moment from "moment/moment";
export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user, isLoaded } = useUser(); // FIXED: Added isLoaded
  const [chatHistory, setChatHistory] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const GetChatHistory = async () => {
    // FIXED: Check if user is loaded and email exists
    if (!user?.primaryEmailAddress?.emailAddress) {
      console.log("User email not available");
      return;
    }

    try {
      const q = query(
        collection(db, "chatHistory"),
        where("userEmail", "==", user.primaryEmailAddress.emailAddress)
      );

      const querySnapshot = await getDocs(q);

      // FIXED: Collect all documents first, then set state once
      const chats = [];
      querySnapshot.forEach((doc) => {
        console.log("chat history is: ", doc.id, doc.data());
        chats.push({ id: doc.id, ...doc.data() });
      });

      // FIXED: Sort by updatedAt in memory (newest first)
      chats.sort((a, b) => {
        const dateA = a.updatedAt?.toDate?.() || new Date(0);
        const dateB = b.updatedAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });

      setChatHistory(chats);
      console.log("Total chats loaded:", chats.length);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const GetLastUserMessageFromChat = (chat) => {
    // FIXED: Added comprehensive null checks
    if (!chat || !chat.messages) {
      console.log("Invalid chat object:", chat);
      return null;
    }

    try {
      const allMessages = Object.values(chat.messages).flat();
      const userMessages = allMessages.filter((msg) => msg?.role === "user");

      // FIXED: Check if userMessages array has items
      if (userMessages.length === 0) {
        return {
          chatId: chat.chatId,
          message: "New chat",
          lastMsgDate: "Just now",
        };
      }

      const lastUserMsg =
        userMessages[userMessages.length - 1]?.content || "New chat";
      const lastUpdated = chat.updatedAt?.toDate?.() || new Date();
      const formattedDate = moment(lastUpdated).fromNow();

      return {
        chatId: chat.chatId,
        message:
          lastUserMsg.substring(0, 50) + (lastUserMsg.length > 50 ? "..." : ""),
        lastMsgDate: formattedDate,
      };
    } catch (error) {
      console.error("Error parsing chat message:", error, chat);
      return null;
    }
  };

  useEffect(() => {
    // FIXED: Wait for user to be loaded
    if (isLoaded && user) {
      GetChatHistory();
    }
  }, [user, isLoaded]);

  return (
    <Sidebar>
      <SidebarHeader />
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/AI-Orchestra.png"
              alt="logo"
              width={40}
              height={40}
              className="w-[40px] h-[40px]"
              priority
            />
            <h2 className="text-xl font-bold">AI-Orchestra</h2>
          </div>

          {/* Theme Toggle */}
          <div>
            {mounted &&
              (theme === "light" ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme("dark")}
                  aria-label="Switch to dark mode"
                >
                  <SunIcon className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme("light")}
                  aria-label="Switch to light mode"
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
              onClick={() => (window.location.href = "/")}
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
            <div className="font-bold text-lg mb-2">Chat History</div>

            {!user && (
              <div className="text-muted-foreground text-sm">
                Sign in to chat with multiple AI models
              </div>
            )}

            {user && chatHistory.length === 0 && (
              <div className="text-muted-foreground text-sm">
                No chat history yet. Start chatting!
              </div>
            )}

            {user && chatHistory.length > 0 && (
              <div className="space-y-1">
                {chatHistory.map((chat, index) => {
                  const chatInfo = GetLastUserMessageFromChat(chat);

                  // FIXED: Skip if chatInfo is null
                  if (!chatInfo) return null;

                  return (
                    // FIXED: Use Link component with query parameter
                    <Link
                      key={chat.id || index}
                      href={`/?chatId=${chatInfo.chatId}`}
                      prefetch={false} // Disable prefetch for better performance
                    >
                      <div className="p-2 hover:bg-accent rounded-md cursor-pointer transition-colors">
                        <h2 className="text-sm font-medium truncate">
                          {chatInfo.message}
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {chatInfo.lastMsgDate}
                        </p>
                      </div>
                    </Link>
                  );
                })}
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
            <Button className="flex items-center w-full" variant="outline">
              <UserIcon className="mr-2" />
              <span className="truncate">{user.fullName}</span>
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;

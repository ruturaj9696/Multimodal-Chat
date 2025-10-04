"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import React, { useEffect } from "react";
import AppSidebar from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Provider = ({ children, ...props }) => {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);
  const CreateNewUser = async () => {
    // If user exists
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("user exists");
      return;
    } else {
      const userData = {
        name: user.fullName,
        email: user.primaryEmailAddress.emailAddress,
        uid: user.id,
        createdAt: new Date(),
        remainingMsg: 5, //Only for free users
        credits: 1000, //Only for paid users
        plant: "Free",
      };
      await setDoc(userRef, userData);
      console.log("new user data created");
    }
  };
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <AppHeader />
          {children}
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default Provider;

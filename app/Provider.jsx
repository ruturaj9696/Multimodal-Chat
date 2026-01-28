"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import React, { useEffect, useState } from "react";
import AppSidebar from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";
import { useUser } from "@clerk/nextjs";
import { db } from "@/config/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { AiSelectedModelContext } from "./context/AiSelectedModelContext";
import { DefaultModel } from "./shared/AIModels";
import { UserDetailContext } from "./context/UserDetailContext";

const Provider = ({ children }) => {
  const { user } = useUser();
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [userDetails, setUserDetails] = useState();
  const [messages, setMessages] = useState({});

  const CreateNewUser = async () => {
    if (!user) return; // protect from undefined user

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    const userRef = doc(db, "users", email);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo?.selectedModelRef ?? DefaultModel);
      setUserDetails(userInfo);
      return;
    }

    const userData = {
      name: user.fullName,
      email,
      uid: user.id,
      createdAt: new Date(),
      remainingMsg: 5,
      credits: 1000,
      plant: "Free",
    };

    await setDoc(userRef, userData);
    setUserDetails(userData);
  };

  // Run CreateNewUser when user is available
  useEffect(() => {
    if (!user) return;
    CreateNewUser();
  }, [user]);

  const updateAImodalSelectionPref = async () => {
    if (!user) return;

    const email = user.primaryEmailAddress?.emailAddress;
    if (!email) return;

    const docRef = doc(db, "users", email);
    await updateDoc(docRef, {
      selectedModelRef: aiSelectedModels,
    });
  };

  useEffect(() => {
    if (!user) return;

    const run = async () => {
      await updateAImodalSelectionPref();
    };
    run();
  }, [aiSelectedModels, user]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AiSelectedModelContext.Provider
        value={{ aiSelectedModels, setAiSelectedModels, messages, setMessages }}
      >
        <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
          <SidebarProvider>
            <AppSidebar />
            <div className="w-full">
              <AppHeader />
              {children}
            </div>
          </SidebarProvider>
        </UserDetailContext.Provider>
      </AiSelectedModelContext.Provider>
    </ThemeProvider>
  );
};

export default Provider;

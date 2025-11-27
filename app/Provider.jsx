"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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

const Provider = ({ children, ...props }) => {
  const { user } = useUser();
  const [aiSelectedModels, setAiSelectedModels] = useState(DefaultModel);
  const [userDetails, setUserDetails] = useState();
  const [messages, setMessages] = useState({});
  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);
  useEffect(async () => {
    if (aiSelectedModels) {
      updateAImodalSelectionPref();
    }
  }, [aiSelectedModels]);
  const updateAImodalSelectionPref = async () => {
    //Update to the firebase database
    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docRef, {
      selectedModelRef: aiSelectedModels,
    });
  };
  const CreateNewUser = async () => {
    // If user exists
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      console.log("user exists");
      const userInfo = userSnap.data();
      setAiSelectedModels(userInfo?.selectedModelRef ?? DefaultModel);
      setUserDetails(userInfo);
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
      setUserDetails(userData);
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

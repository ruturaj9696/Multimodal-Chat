import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import React from "react";
import AppSidebar from "./_components/AppSidebar";
import AppHeader from "./_components/AppHeader";

const Provider = ({ children, ...props }) => {
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

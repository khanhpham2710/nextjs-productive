"use client";

import { useToggleSidebar } from "@/context/ToggleSidebar";
import { Button } from "../ui/button";
import { PanelLeftOpen } from "lucide-react";

function OpenSidebar(){
  const { setIsOpen } = useToggleSidebar();

  return (
    <Button
      onClick={() => {
        setIsOpen(true);
      }}
      className="text-muted-foreground lg:hidden"
      variant={"ghost"}
      size={"icon"}
    >
      <PanelLeftOpen />
    </Button>
  );
};

export default OpenSidebar
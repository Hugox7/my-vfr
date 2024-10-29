import { UserContext, UserContextType } from "@/context/UserContext";
import { useContext } from "react";

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
      throw new Error('useUser must be used inside UserProvider');
    }
    return context;
  };
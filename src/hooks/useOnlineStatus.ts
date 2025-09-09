import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("You’re back online 🚀 Changes will now be synced automatically.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.error("You're offline 🔴");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

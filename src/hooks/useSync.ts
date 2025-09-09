/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { supabase } from "../lib/supabase-client";
import { getAllUsers } from "../lib/db";

export const useSync = () => {
  useEffect(() => {
    // const sync = async () => {
    //   if (navigator.onLine) {
    //     console.log("🔄 Syncing with Supabase...");
    //     const localUsers = await getAllUsers();

    //     // push local → Supabase
    //     for (const user of localUsers) {
    //       await supabase.from("users").upsert(user);
    //       console.log('users = ', user)
    //     }

    //     // pull Supabase → local
    //     const { data } = await supabase.from("users").select("*");
    //     if (data) {
    //       await bulkInsert(data);
    //     }
    //   }
    // };

    // tambahin di useSync

    const sync = async () => {
      if (navigator.onLine) {
        console.log("🔄 Syncing with Supabase...");
        const localUsers = await getAllUsers();

        // ambil semua user supabase
        const { data: remoteUsers } = await supabase.from("users").select("*");

        // cari user yang ada di remote tapi ga ada di local → delete
        if (remoteUsers) {
          const localIds = new Set(localUsers.map((u: any) => u.id));
          for (const r of remoteUsers) {
            if (!localIds.has(r.id)) {
              await supabase.from("users").delete().eq("id", r.id);
            }
          }
        }

        // push local ke supabase
        for (const user of localUsers) {
          await supabase.from("users").upsert(user);
        }
      }
    };

    sync();
    window.addEventListener("online", sync);
    return () => window.removeEventListener("online", sync);
  }, []);
};

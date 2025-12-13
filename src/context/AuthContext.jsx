


// import { createContext, useContext, useEffect, useState } from "react";
// import { syncFavoritesToSupabase, syncWatchlistToSupabase } from "../api/moviesApi";
// import { supabase } from "../lib/supabase";


// const AuthContext = createContext({});

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check active sessions
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setUser(session?.user ?? null);
//       setLoading(false);
//     });

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       console.log("Auth event:", event);
//       setUser(session?.user ?? null);

//       // 🔥 Sync data when user signs in
//       if (event === "SIGNED_IN") {
//         console.log("User signed in, syncing data...");
//         await syncFavoritesToSupabase();
//         await syncWatchlistToSupabase();
//       }

//       setLoading(false);
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const signIn = async (email, password) => {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     return { data, error };
//   };

//   const signUp = async (email, password) => {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//     });

//     return { data, error };
//   };

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut();
//     return { error };
//   };

//   const value = {
//     user,
//     loading,
//     signIn,
//     signUp,
//     signOut,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  syncFavoritesToSupabase,
  syncWatchlistToSupabase,
} from "../api/moviesApi";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /** ============================
   * INITIAL SESSION
   * ============================ */
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    init();
  }, []);

  /** ============================
   * AUTH LISTENER
   * ============================ */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        setUser(session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /** ============================
   * SYNC AFTER LOGIN
   * ============================ */
  useEffect(() => {
    if (!user) return;

    const syncData = async () => {
      try {
        await syncFavoritesToSupabase();
        await syncWatchlistToSupabase();
      } catch (err) {
        console.error("Sync error:", err);
      }
    };

    syncData();
  }, [user?.id]);

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const signUp = (email, password) =>
    supabase.auth.signUp({ email, password });

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

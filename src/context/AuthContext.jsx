// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Listen to auth state changes
//   useEffect(() => {
//     const getUser = async () => {
//       const { data } = await supabase.auth.getUser();
//       if (data?.user) {
//         setUser(data.user);
//       }
//     };

//     getUser();

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setUser(session?.user || null);
//       }
//     );

//     return () => listener.subscription.unsubscribe();
//   }, []);

//   const value = {
//     user,
//     signUp: (email, password) =>
//       supabase.auth.signUp({ email, password }),

//     signIn: (email, password) =>
//       supabase.auth.signInWithPassword({ email, password }),

//     signOut: () => supabase.auth.signOut(),
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => useContext(AuthContext);
import { createContext, useContext, useEffect, useState } from "react";
import { syncFavoritesToSupabase, syncWatchlistToSupabase } from "../api/moviesApi";
import { supabase } from "../lib/supabase";


const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event);
      setUser(session?.user ?? null);

      // 🔥 Sync data when user signs in
      if (event === "SIGNED_IN") {
        console.log("User signed in, syncing data...");
        await syncFavoritesToSupabase();
        await syncWatchlistToSupabase();
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
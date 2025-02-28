import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

import { fetchEmailsByUserId, getCurrentUser } from "./appwrite";
import { useAppwrite } from "./useAppwrite";
import { Redirect } from "expo-router";

interface GlobalContextType {
    isLogged: boolean;
    user: User | null;
    loading: boolean;
    refetch: (newParams: Record<string, string | number>) => Promise<void>
    userEmails: { email: string; id: string }[];
    refreshEmails: () => Promise<void>;
}

interface User {
    $id: string;
    name: string;
    email: string;
    avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalProvider = ({ children }: GlobalProviderProps) => {
    const {
        data: user,
        loading,
        refetch,
    } = useAppwrite({
        fn: getCurrentUser,
    });

    
    const [userEmails, setUserEmails] = useState<{ email: string; id: string }[]>([]);
    const [emailsLoading, setEmailsLoading] = useState(false);
  
    const isLogged = !!user;
  
    // Function to fetch emails
    const fetchEmails = async () => {
      if (!user || !user.$id) return;
      
      setEmailsLoading(true);
      try {
        const emails = await fetchEmailsByUserId(user.$id);
        setUserEmails(emails);
      } catch (error) {
        console.error('Error in fetchEmails:', error);
      } finally {
        setEmailsLoading(false);
      }
    };
  
    // Fetch emails when user logs in
    useEffect(() => {
      if (isLogged) {
        fetchEmails();
      } else {
        setUserEmails([]);
      }
    }, [isLogged, user?.$id]);


    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                user,
                loading,
                refetch,
                userEmails,
                refreshEmails: fetchEmails
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context)
        throw new Error("useGlobalContext must be used within a GlobalProvider");

    return context;
};

export default GlobalProvider;
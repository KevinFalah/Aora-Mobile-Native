import { getCurrentUser } from "@/lib/appwrite";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ICurrentUser {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $tenant: string;
  $updatedAt: string;
  accountId: string;
  avatar: string;
  email: string;
  username: string;
}

type GlobalProvideProps = {
  children: ReactNode;
};

type GlobalContextType = {
  isLoading: boolean;
  setIsLoggedIn: (value: boolean) => void;
  isLoggedIn: boolean;
  user: ICurrentUser | null;
  setUser: (value: any) => void;
};

const GlobalContext = createContext<GlobalContextType>({
  isLoading: false,
  setIsLoggedIn: () => {},
  isLoggedIn: false,
  user: {
    $collectionId: "",
    $createdAt: "",
    $databaseId: "",
    $id: "",
    $permissions: [""],
    $tenant: "",
    $updatedAt: "",
    accountId: "",
    avatar: "",
    email: "",
    username: "",
  },
  setUser: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: GlobalProvideProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res: any) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((err: any) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);
  return (
    <GlobalContext.Provider
      value={{
        isLoading,
        setIsLoggedIn,
        isLoggedIn,
        user,
        setUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;

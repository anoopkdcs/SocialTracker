import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { hasUser } from "@/db/init";

// @ts-ignore


const  Index = ()=> {
   const [initializing, setInitializing] = useState(true);
   const [userExists, setUserExists] = useState(false);
 
   useEffect(() => {
   //   const check = async () => {
   //     const exists = await hasUser();
   //     setUserExists(exists);
   //     setInitializing(false);
   //   };
   //   check();
   }, []);
 
   if (initializing) return null;
 
   return <Redirect href={userExists ? "/app" : "/code"} />;
}

export default Index




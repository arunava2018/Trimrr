import React, { useContext, useEffect } from 'react'
import { createContext} from 'react'
import useFetch from './hooks/useFetch';
import {getCurrentUser} from "./db/apiAuth"
const UrlContext = createContext();
const UrlProvider = ({children})=>{
    const {data:user, loading, fn:fetchUser} = useFetch(getCurrentUser);
    const isAuthenticated = user?.role === "authenticated";
    useEffect(()=>{
        fetchUser();
    },[])
    return <UrlContext.Provider value = {{user, fetchUser, loading, isAuthenticated}}>
        {children}
    </UrlContext.Provider>
}

export const UrlState = () =>{
    return useContext(UrlContext);
}

export default UrlProvider;
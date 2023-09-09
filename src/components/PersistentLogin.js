import { Outlet } from "react-router-dom";
import { useState,useEffect } from "react";
import useRefresToken from "../hooks/useRefresToken";
import useAuth from "../hooks/useAuth";
import useLocalStorage from "../hooks/useLocalStorage";



const PersistLogin=()=>{
    const [isLoaoding, setIsLoading]=useState(true)
    const refresh=useRefresToken()
    const {auth}=useAuth()
    const [persist]=useLocalStorage("persist",false)
    let isMounted=true

    useEffect(()=>{

      
        const verifyRefreshToken=async ()=>{
            try {
               await refresh();

            } catch (error) {
                console.error(error)
            }
            finally{
                isMounted && setIsLoading(false)
            }      

       }

       !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false)
 },[])


 useEffect(()=>{
     isMounted=false
     console.log(`isloading ${isLoaoding}`)
     console.log(`at ${JSON.stringify(auth?.accessToken)}`)
},[isLoaoding])


    return (
        <>
        
        {!persist ? <Outlet/> : isLoaoding ? <p>isLoaoding</p>: <Outlet/> }
       
       
       
        </>
    )


}

export default PersistLogin


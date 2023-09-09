import { axiosPrivate } from "../api/axios"
import { useEffect } from "react"
import useRefresToken from "./useRefresToken"
import useAuth from "./useAuth"

const usePrivateAxios = () => {

   const refresh=useRefresToken()

   const {auth}=useAuth()


   useEffect(()=>{

    const requestIntercepter=axiosPrivate.interceptors.request.use(
        config=>{
            if(!config.headers["Authorization"]){
                config.headers["Authorization"]=`Bearer ${auth?.accessToken}`

            }
            return config
        },error=>Promise.reject(error)
    )

const responseIntercepter=axiosPrivate.interceptors.response.use(
           
        response=>response,

       async (error)=>{
          const prevRequest=error?.config;

          if(error?.response?.status===403 && !prevRequest?.sent ){
               prevRequest.sent=true
               const newAccessToken =await refresh();
               prevRequest.headers["Authorization"]=`Bearer ${newAccessToken}`
               
               return axiosPrivate(prevRequest);
               

          }
          return Promise.reject(error)
       }
        
    )

    return ()=>{
        axiosPrivate.interceptors.response.eject(responseIntercepter)
        axiosPrivate.interceptors.response.eject(requestIntercepter)
     }

       
   },[auth,refresh])




  return axiosPrivate;
}

export default usePrivateAxios
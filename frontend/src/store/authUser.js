import { create } from 'zustand'
import { persist } from "zustand/middleware";
import axios from 'axios'
import toast from "react-hot-toast"


function parseAxiosError(err) {
  return (
    err?.response?.data?.error ||          // { error: "..." }
    err?.response?.data?.message ||        // { message: "..." }
    (typeof err?.response?.data === "string" ? err.response.data : null) ||
    err?.message
  );
}

export const useAuthStore =create(persist((set) =>({
    user:null,
    isRegistered: false,
    isLoggingIn:false,
    isLoggedOut:false,
    register:async (credentials)=>{
        set({isRegistered:true})
        try {
            const res = await axios.post('/api/auth/register',credentials)
            set({user:res.data.user,isRegistered:false})
            toast.success("Account created successfully")
        } catch (error) {
            const message = parseAxiosError(error)
            set({isRegistered:false,user:null})
            toast.error(message || "Register failled")   
        }
    },
    login:async (credentials)=>{
        set({isLoggingIn:true})
        try {
            const res = await axios.post("/api/auth/login",credentials)
            set({user:res.data.user,isLoggingIn:false})
        } catch (error) {
            const message = parseAxiosError(error)
            set({isLoggingIn:false,user:null})
            toast.error(message || "Login failled!")
        }
    },
    logout:async ()=>{
        set({isLoggedOut:true})
        try {
            await axios.post("/api/auth/logout");
            set({user:null,isLoggedOut:false})
        } catch (error) {
            const message = parseAxiosError(error)
            set({isLoggedOut:false})
            toast.error(message || "Logged out failed")
        }
    },
    mergeUser:(partialUser)=>{
        set((state)=>({
            user: state.user ? {...state.user,...partialUser} : partialUser
        }))
    }
}),{name:"auth",getStorage: () => localStorage,})) 

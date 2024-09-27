import {create} from "zustand";

interface useStoreModalStore{
    isOpen:boolean,
    onOpen:()=>void,
    onClose:()=>void
}

export const useStoreModal=create<useStoreModalStore>((Set)=>({
    isOpen:false,
    //IMO isOpen is the state and Set is the state updater and onOpen and onClose are 2 functions that change the state
    onOpen:()=> Set({isOpen:true}),
    onClose:()=> Set({isOpen:false})
}))
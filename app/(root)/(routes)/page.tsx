"use client"

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";


const SetupPage =()=>{
  const onOpen = useStoreModal((state)=>state.onOpen) //keh raha hai ki mujhe on open wala function dedo?

  const isOpen = useStoreModal((state)=>state.isOpen)

  useEffect(()=>{
    if(!isOpen){
      onOpen();
    }
  },[isOpen,onOpen])
  return null;
}

export default SetupPage

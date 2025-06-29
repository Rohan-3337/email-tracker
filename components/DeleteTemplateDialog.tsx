"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"




import { Button } from "@/components/ui/button";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {  TemplateDelete } from "@/lib/actions/Delete";
import { Loader2 } from "lucide-react";
import { Template } from "@/lib/generated/prisma";

interface DeleteEmailModalProps{
    isOpen:boolean;
    onClose:()=>void;
    id:string;
    data?:Template;
}


export const DeleteTemplateModal = ({isOpen,onClose,id,data}:DeleteEmailModalProps)=>{
    
    const router = useRouter();
    
    const [isLoading, setIsLoading] = useState(false);
   
    
    const OnLeave = async() =>{
        try {
            setIsLoading(true);
            await TemplateDelete(id);
            router.refresh();
            window.location.reload();
            onClose(); 
            
        } catch (error) {
            console.log("ERROR FROM LEAVE MODAL ",error);
        }finally{
            setIsLoading(false);
        }
    }
    
    return(
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                <DialogTitle className=" text-2xl font-bold text-center capitalize">
                    Delete Template
                </DialogTitle>
                <DialogDescription className=" text-center text-zinc-500">
                    Are You Sure You want to do this ?<br/>
                     <span className="font-semibold text-indigo-500">{data?.name ||id}</span> will be permanently deleted
                </DialogDescription>
                </DialogHeader>
               
               <DialogFooter className="bg-gray-100 px-6 py-4">
                <div className="flex items-center justify-between w-full">
                    <Button disabled={isLoading} variant={"ghost"} onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={isLoading} variant={"destructive"} onClick={OnLeave}>
                        {isLoading&& <Loader2 className=" mr-2 h-4 w-4 animate-spin"/>}
                        Confirm
                    </Button>
                </div>
            </DialogFooter>
            </DialogContent>
            
        </Dialog>
    )
}
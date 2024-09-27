import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try{
        const {userId}=auth();
        const body = await req.json();

        const {name} = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!name){
            return new NextResponse("Name is required",{status:400})

        }

        if(!params.storeId){
            return new NextResponse("StoreId is required",{status:400})

        }

        const store = await prismadb.store.update({
            where:{
                id:params.storeId,
                userId
            },
            data:{
                name
            }
        })

        return NextResponse.json(store);
    }catch(err){
        console.log('[STORE_PATCH]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}


export async function DELETE(
    //unused
    _req:Request,
    {params}:{params:{storeId:string}}
){
    try{
        const {userId}=auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!params.storeId){
            return new NextResponse("StoreId is required",{status:400})

        }

        const store = await prismadb.store.delete({
            where:{
                id:params.storeId,
                userId
            }
        })

        return NextResponse.json(store);
    }catch(err){
        console.log('[STORE_DELETE]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}
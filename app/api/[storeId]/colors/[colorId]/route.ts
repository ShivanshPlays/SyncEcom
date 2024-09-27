import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//open route for all
export async function GET(
    //unused
    _req:Request,
    {params}:{params:{colorId:string}}
){
    try{
        

        if(!params.colorId){
            return new NextResponse("colorId is required",{status:400})

        }


        const color = await prismadb.color.findUnique({
            where:{
                id:params.colorId
            }
        })

        return NextResponse.json(color);
    }catch(err){
        console.log('[COLOR_GET]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,colorId:string}}
){
    try{
        const {userId}=auth();
        const body = await req.json();

        const {name,value} = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!name){
            return new NextResponse("name is required",{status:400})

        }

        if(!value){
            return new NextResponse("value is required",{status:400})

        }

        if(!params.colorId){
            return new NextResponse("colorId is required",{status:400})

        }
        // checking if the store id is corresponded by user id so that some user cant steal someones store id and create a color 

        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("unauthorised",{status:403})

        }

        const color = await prismadb.color.update({
            where:{
                id:params.colorId,
            },
            data:{
                name,
                value
            }
        })

        return NextResponse.json(color);
    }catch(err){
        console.log('[COLOR_PATCH]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

export async function DELETE(
    //unused
    _req:Request,
    {params}:{params:{storeId:string,colorId:string}}
){
    try{
        const {userId}=auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!params.colorId){
            return new NextResponse("colorId is required",{status:400})

        }

        // checking if the store id is corresponded by user id so that some user cant steal someones store id and create a color 

        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("unauthorised",{status:403})

        }

        const color = await prismadb.color.delete({
            where:{
                id:params.colorId
            }
        })

        return NextResponse.json(color);
    }catch(err){
        console.log('[COLOR_DELETE]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

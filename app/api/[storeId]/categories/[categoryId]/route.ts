import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//open route for all
export async function GET(
    //unused
    _req:Request,
    {params}:{params:{categoryId:string}}
){
    try{
        

        if(!params.categoryId){
            return new NextResponse("categoryId is required",{status:400})

        }


        const category = await prismadb.category.findUnique({
            where:{
                id:params.categoryId
            },
            include:{
                billboard:true
            }
        })

        return NextResponse.json(category);
    }catch(err){
        console.log('[CATEGORY_GET]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,categoryId:string}}
){
    try{
        const {userId}=auth();
        const body = await req.json();

        const {name,billboardId} = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!name){
            return new NextResponse("name is required",{status:400})

        }

        if(!billboardId){
            return new NextResponse("billboardId is required",{status:400})

        }

        if(!params.categoryId){
            return new NextResponse("categoryId is required",{status:400})

        }
        // checking if the store id is corresponded by user id so that some user cant steal someones store id and create a category 

        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("unauthorised",{status:403})

        }

        const category = await prismadb.category.update({
            where:{
                id:params.categoryId,
            },
            data:{
                name,
                billboardId
            }
        })

        return NextResponse.json(category);
    }catch(err){
        console.log('[CATEGORY_PATCH]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

export async function DELETE(
    //unused
    _req:Request,
    {params}:{params:{storeId:string,categoryId:string}}
){
    try{
        const {userId}=auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!params.categoryId){
            return new NextResponse("categoryId is required",{status:400})

        }

        // checking if the store id is corresponded by user id so that some user cant steal someones store id and create a category 

        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("unauthorised",{status:403})

        }

        const category = await prismadb.category.delete({
            where:{
                id:params.categoryId
            }
        })

        return NextResponse.json(category);
    }catch(err){
        console.log('[CATEGORY_DELETE]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

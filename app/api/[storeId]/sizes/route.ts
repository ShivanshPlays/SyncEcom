import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(
    req:Request,
    {params}:{params:{storeId:string}}

) {
    
        try{
            const {userId} = auth();

            const body = await req.json();
            const {value,name} =body;
            if(!userId){

                return new NextResponse("Unauthenticated",{status:401})
            }
            if(!value){
                return new NextResponse("value is required",{status:400})
                
            }

            if(!name){
                return new NextResponse("name is required",{status:400})
                
            }

            if(!params.storeId){
                return new NextResponse("storeId is required",{status:400})

            }
        // checking if the store id is corresponded by user id so that some user cant steal someones store id and create a new size 
            const storeByUserId= await prismadb.store.findFirst({
                where:{
                    id:params.storeId,
                    userId
                }
            })

            if(!storeByUserId){
                return new NextResponse("unauthorised",{status:403})

            }

            const size = await prismadb.size.create({
                data:{
                    value,
                    name,
                    storeId : params.storeId

                }
            });

            return NextResponse.json(size);
        }catch(error){
            console.log('[SIZES_POST]',error);

            return new NextResponse("Internal Error",{status:500});
        }
}

//open route for all
export async function GET(
    req:Request,
    {params}:{params:{storeId:string}}

) {
    
        try{
            if(!params.storeId){
                return new NextResponse("storeId is required",{status:400})

            }
      
            const sizes = await prismadb.size.findMany({
                where:{
                    storeId:params.storeId
                }
            });

            return NextResponse.json(sizes);
        }catch(error){
            console.log('[SIZES_GET]',error);

            return new NextResponse("Internal Error",{status:500});
        }
}
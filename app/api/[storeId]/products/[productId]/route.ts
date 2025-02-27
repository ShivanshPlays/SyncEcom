import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//open route for all
export async function GET(
    //unused
    _req:Request,
    {params}:{params:{productId:string}}
){
    try{
        

        if(!params.productId){
            return new NextResponse("productId is required",{status:400})

        }


        const product = await prismadb.product.findUnique({
            where:{
                id:params.productId
            },
            include:{
                images:true,
                category:true,
                size:true,
                color:true
            }
        })

        return NextResponse.json(product);
    }catch(err){
        console.log('[PRODUCT_GET]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string,productId:string}}
){
    try{
        const {userId}=auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived,
          } = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if (!name) {
        return new NextResponse("Name is required", { status: 400 });
        }
    
        if (!price) {
        return new NextResponse("price is required", { status: 400 });
        }
        if (!categoryId) {
        return new NextResponse("categoryId is required", { status: 400 });
        }
        if (!sizeId) {
        return new NextResponse("sizeId is required", { status: 400 });
        }
        if (!colorId) {
        return new NextResponse("colorId is required", { status: 400 });
        }
        if (!images || !images.length) {
        return new NextResponse("images is required", { status: 400 });
        }

        if(!params.productId){
            return new NextResponse("productdId is required",{status:400})

        }

        
        // checking if the store id is corresponded by user id so that some user cant steal someones store id and create a product

        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("unauthorised",{status:403})

        }

        await prismadb.product.update({
            where:{
                id:params.productId,
            },
            data: {
                name,
                price,
                isFeatured,
                isArchived,
                categoryId,
                colorId,
                sizeId,
                images:{
                    deleteMany:{}
                },
            }
        });

        const product = await prismadb.product.update({
            where:{
                id:params.productId
            },
            data:{
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
    }catch(err){
        console.log('[PRODUCT_PATCH]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

export async function DELETE(
    //unused
    _req:Request,
    {params}:{params:{storeId:string,productId:string}}
){
    try{
        const {userId}=auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401})
        }

        if(!params.productId){
            return new NextResponse("productId is required",{status:400})

        }

        // checking if the store id is corresponded by user id so that some user cant steal someones store id and create a product

        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })

        if(!storeByUserId){
            return new NextResponse("unauthorised",{status:403})

        }

        const product = await prismadb.product.delete({
            where:{
                id:params.productId
            }
        })

        return NextResponse.json(product);
    }catch(err){
        console.log('[PRODUCT_DELETE]',err);
        return new NextResponse("Internal Error",{status:500});
    }
}

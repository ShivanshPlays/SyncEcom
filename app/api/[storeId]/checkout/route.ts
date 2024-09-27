import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import Razorpay from "razorpay";
import { Product } from "@prisma/client";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // console.log("control")
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  // console.log("controlpost")
  const { productIds } = await req.json();

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Products ids are required", {
      status: 400,
      headers: corsHeaders,
    });
  }

  const products:Product[] = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });
  const key_id = String(process.env.RZP_KEY_ID);
  const instance = new Razorpay({
    key_id: key_id,
    key_secret: process.env.RZP_KEY_SECRET,
  });

  const total = products.reduce((total:number, product) => {
    return total + Number(product.price);
  }, 0);

  const options = {
    amount: total * 100,
    currency: "INR",
  };

  try {
    const res = await instance.orders.create(options);
    console.log("from checkout", res);
    const order = await prismadb.order.create({
      data: {
        RZP_OID: res.id,
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });
    console.log(order.RZP_OID);
    return NextResponse.json(
      {
        id: res.id,
        currency: res.currency,
        amount: res.amount,
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ err }, { status: 400 });
  }
}

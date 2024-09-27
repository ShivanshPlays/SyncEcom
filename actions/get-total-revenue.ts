import prismadb from "@/lib/prismadb";
import { Order, OrderItem, Product } from "@prisma/client";

interface orderItemWithProduct extends OrderItem{
  product:Product
}

interface paidOrderProps extends Order {
  orderItems:orderItemWithProduct[]
}

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders:paidOrderProps[] = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // console.log(paidOrders);
  //iterating over all orders
  const totalRevenue = paidOrders.reduce((total:number, order) => {
    //iterating over all order items
    
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price.toNumber();
    }, 0);

    return total + orderTotal;
  }, 0);
  return totalRevenue;
};

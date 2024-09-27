import {format} from "date-fns"
import prismadb from "@/lib/prismadb"
import { ColorsClient } from "./components/client"
import { ColorColumn } from "./components/columns"
import { Color } from "@prisma/client"

const ColorPage = async({
    params
}:{
    params:{storeId:string}
})=>{
    const Colors:Color[]=await prismadb.color.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:"desc"
        }
    });
    const formattedColors:ColorColumn[]=Colors.map((item)=>({
        id:item.id,
        name:item.name,
        value:item.value,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }));
    return (
        <div className="felx-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient data={formattedColors}/>
            </div>
        </div>
    )
}

export default ColorPage
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CompanySchemaType } from "@/lib/schemas";
import { RxCross2 } from "react-icons/rx";

type Props = {
    companies: CompanySchemaType[];
    onClickRemove?: (id: string) => void;
}


export default function ClientCuitList({ companies, onClickRemove }: Props) {
    return (
        companies.length > 0 ?
            <Table>
                <TableHeader className=" bg-white">
                    <TableRow className="hover:bg-white h-8 [&>th]:h-0">
                        <TableHead className="text-[0.75rem] font-bold text-black/90">Nombre</TableHead>
                        <TableHead className="text-[0.75rem] font-bold text-black/90">Razon Social</TableHead>
                        <TableHead className="text-[0.75rem] font-bold text-black/90">CUIT</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="[&>*]:hover:bg-white">
                    {companies.map((company) => (
                        <TableRow key={company.id + "-cuit-list-item"} className="[&>*]:text-center h-8 [&>td]:py-0 [&>td]:text-black/50">
                            <TableCell className="!text-left">
                                {company.name}
                            </TableCell>

                            <TableCell className="!text-left">
                                {company.razonSocial}

                            </TableCell>
                            <TableCell className="!text-left">
                                {company.cuit}

                            </TableCell>
                            {onClickRemove && (
                                <TableCell className="!text-left">
                                    <Button variant="ghost" onClick={() => onClickRemove(company.id)}>
                                        <RxCross2 size={15} className="text-destructive" />
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            :
            (<div className="flex items-center justify-center border-b-[1px] border-border py-1 text-sm">
                <span className="font-bold">
                    No hay clientes seleccionados
                </span>
            </div>
            )

    )
}
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBlackList, removeFromBlackList } from '@/lib/products';
import UseCompanyStore from '@/store/company.store';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from '@tanstack/react-router'
import { AnimatePresence } from "framer-motion";
import AnimatedRow from "@/components/animatedRow";
import { ProductSchemaType } from '@/lib/schemas';
import { useState } from 'react';
import { MdOutlinePlaylistRemove } from "react-icons/md";

export const Route = createFileRoute('/_authenticated/_dashboardLayout/_accountType/client/lists/blackList')({
  component: () => <BlackList />
})


export default function BlackList() {
  const { company } = UseCompanyStore();
  const companyId = company?.id;
  const queryClient = useQueryClient();

  const [, setRemovingItems] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ['blacklist', companyId],
    queryFn: () => companyId ? getBlackList(companyId) : Promise.reject(new Error('Company ID is undefined')),
  })

  function loadingIndicator() {
    return (
      <TableRow className="mt-12 opacity-25">
        <TableCell colSpan={100} className="p-0">
          <div className="w-full flex flex-col space-y-2 mt-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="w-full h-20 rounded-sm bg-muted/50" />
            ))}
          </div>
        </TableCell>
      </TableRow>
    )
  }

  const { mutate: removelackList } = useMutation({
    mutationFn: async ({ companyId, productId }: { companyId: string; productId: string }) => {
      if (!company?.id) throw new Error("Company ID is required");
      return removeFromBlackList(companyId, productId);
    },
    onMutate: async ({ companyId, productId }) => {
      await queryClient.cancelQueries({ queryKey: ["blacklist", companyId] });

      const previousFavorites = queryClient.getQueryData(["blacklist", companyId]);

      setRemovingItems((prev) => new Set(prev).add(productId));

      queryClient.setQueryData(["blacklist", companyId], (old: ProductSchemaType[]) =>
        old?.filter((product) => product.id !== productId)
      );

      return { previousFavorites };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(["blacklist", company?.id], context.previousFavorites);
      }
      setRemovingItems(new Set());
    },
    onSettled: (_, __, { productId }) => {
      setRemovingItems((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    },
  });


  function handleRemove(productId: string) {
    if (!company?.id) return;
    removelackList({ companyId: company.id, productId: productId });
  }

  if (data?.length === 0) return (
    <div className="flex flex-col gap-4 items-center justify-center h-full">
      <MdOutlinePlaylistRemove size={100} className="text-destructive" />
      <p className="text-base font-bold">No hay productos en la lista Negra</p>
    </div>)


  return (
    <div className="relative w-full p-10">
      {/* <div className="h-1 w-full bg-transparent shadow-sm"></div> */}
      <div className="h-[calc(100vh-220px)] overflow-y-auto px-2">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
            <TableRow className="hover:bg-white">
              <TableHead className="w-96">Producto</TableHead>
              <TableHead className={`text-center`}>Unidad</TableHead>
              <TableHead className={`text-center`}>Unidad de Medida</TableHead>
              <TableHead className={`text-center`}>Precio</TableHead>
              <TableHead className={`text-center`}>Precio por Unidad de Medida</TableHead>
              <TableHead className={`text-right`}></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&>*]:hover:bg-white">
            {
              isLoading
                ? loadingIndicator()
                : (
                  <AnimatePresence mode="popLayout">
                    {data?.map((product) => (
                      <AnimatedRow
                        key={product.id}
                        product={product}
                        handleRemove={() => handleRemove(product.id)}
                      />
                    ))}
                  </AnimatePresence>
                )
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchGs1Products } from '@/lib/products';
import { Gs1SearchSchemaType } from '@/lib/schemas';

export const useGs1ProductSearch = () => {
  const [params, setParams] = useState<Gs1SearchSchemaType | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['searchObjects', params],
    queryFn: () => {
      if (!params) {
        return Promise.resolve([]); // Return an empty array when no params
      }
      return searchGs1Products(params); // Call the API with the current params
    },
    enabled: !!params, // Only run the query if params exist
  });

  const handleSearch = (newParams: Gs1SearchSchemaType) => {
    setParams(newParams); // Update params and trigger the query
  };

  return {
    data,
    isLoading,
    isError,
    error,
    handleSearch,
  };
};

import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

type Image = {
  id: string;
  title: string;
  url: string;
  description: string;
  ts: number;
};

type ResponseImages = {
  data: Image[];
  after: string;
};

export default function Home(): JSX.Element {
  async function handleFetchPages({
    pageParam = null,
  }): Promise<ResponseImages> {
    const response = await api.get('/api/images', {
      params: {
        after: pageParam,
      },
    });

    return response.data;
  }

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    'images',
    handleFetchPages,
    {
      getNextPageParam: lastPage => lastPage.after,
    }
    // TODO AXIOS REQUEST WITH PARAM
    // TODO GET AND RETURN NEXT PAGE PARAM
  );

  const formattedData = useMemo(() => {
    return data?.pages.flatMap(format => {
      return format.data.flat();
    });
    // TODO FORMAT AND FLAT DATA ARRAY
  }, [data]);

  // TODO RENDER LOADING SCREEN
  if (isLoading) {
    return <Loading />;
  }

  // TODO RENDER ERROR SCREEN
  if (isError) {
    return <Error />;
  }
  return (
    <>
      <Header />

      <Box maxW={1120} px={20} mx="auto" my={20}>
        <CardList cards={formattedData} />
        {hasNextPage && (
          <Button type="button" onClick={() => fetchNextPage()}>
            Mais imagens
          </Button>
        )}
      </Box>
    </>
  );
}

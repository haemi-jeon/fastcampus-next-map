'use client';

import axios from 'axios';
import { useQuery } from 'react-query';

import { LikeApiResponse, LikeInterface } from '@/interface';
import Loading from '@/components/Loading';
import StoreList from '@/components/StoreList';
import Pagination from '@/components/Pagination';

export default function LikesPage({ params }: { params: { page: string } }) {
  const page = params?.page || '1';

  const fetchLikes = async () => {
    const { data } = await axios(`/api/likes?limit=10&page=${page}`);
    return data as LikeApiResponse;
  };

  const {
    data: likes,
    isError,
    isLoading,
    isSuccess,
  } = useQuery(`likes-${page}`, fetchLikes);

  if (isError) {
    return (
      <div className='w-full h-screen mx-auto pt-[10%] text-red-500 text-center font-semibold'>
        다시 시도해주세요
      </div>
    );
  }

  return (
    <div className='px-4 md:max-w-5xl mx-auto py-8'>
      <h3 className='text-lg font-semibold'>찜한 맛집</h3>
      <div className='mt-1 text-gray-500 text-sm'>찜한 가게 리스트입니다.</div>
      <ul className='divide-y divide-gray-100' role='list'>
        {isLoading ? (
          <Loading />
        ) : (
          likes?.data.map((like: LikeInterface, index) => (
            <StoreList store={like.store} i={index} key={index} />
          ))
        )}
        {isSuccess && !!!likes.data.length && (
          <div className='p-4 border border-gray-200 rounded-200 text-sm text-gray-400'>
            찜한 가게가 없습니다.
          </div>
        )}
      </ul>
      <Pagination
        total={likes?.totalPage}
        page={page}
        pathname='/users/likes'
      />
    </div>
  );
}

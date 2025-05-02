'use client';


import { useParams } from 'next/navigation';




import { useQuery } from '@tanstack/react-query';

import AnimationContainer from '@/@core/components/animation-container/animationContainer';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/loading';
import ErrorBox from '@/components/ErrorBox';
import { getFashCard } from '@/data/flashCards/flashCardsQuery';
import EditFlashCardForm from '@/views/flashcard/EditFlashCardForm';

const EditFlasCardPage = () => {
    const { id } = useParams() as { id: string };


    const {
        data,
        isLoading,
        error,
        isError,
        refetch
    } = useQuery({
        queryKey: ['flashCard', id],
        queryFn: () => getFashCard(id)
    })



    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorBox error={error} refetch={refetch} />
    }

    return (
        <AnimationContainer>
            <PageHeader title='Edit Flash Card'
                breadcrumbs={[{ label: 'Home', href: '/' },
                { label: 'Flash Card', href: '/study/flashCards' },
                { label: `${data.data.front_en}` }
                ]}
                showBackButton={true}
            />
            <EditFlashCardForm flashCard={data.data} />

        </AnimationContainer>)

};

export default EditFlasCardPage;

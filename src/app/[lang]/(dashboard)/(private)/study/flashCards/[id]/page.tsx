'use client';


import { useParams, useRouter } from 'next/navigation';






import { useQuery } from '@tanstack/react-query';

import { Box, Button } from '@mui/material';

import AnimationContainer from '@/@core/components/animation-container/animationContainer';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/loading';
import ErrorBox from '@/components/ErrorBox';
import { getFashCard } from '@/data/flashCards/flashCardsQuery';
import FlashCardView from '@/views/flashcard/FlashCardView';

const ViewFlasCardPage = () => {
    const { id } = useParams() as { id: string };
    const router = useRouter()

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
            <PageHeader title='Flash Card' breadcrumbs={[{ label: 'Home', href: '/' },
            { label: 'Flash Card', href: '/study/flashCards' },
            { label: `${data.data.front_en}` }
            ]}
                showBackButton={true}

                actions={
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant='contained' color='primary' onClick={() => router.push(`/study/flashCards/viewedit/${data.data.id}`)}>
                            Edit
                        </Button>

                    </Box>
                }
            />
            <FlashCardView flashCard={data.data} />

        </AnimationContainer>)

};

export default ViewFlasCardPage;

'use client';


import { useParams, useRouter } from 'next/navigation';






import { useQuery } from '@tanstack/react-query';

import { Box, Button } from '@mui/material';

import AnimationContainer from '@/@core/components/animation-container/animationContainer';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/loading';
import ErrorBox from '@/components/ErrorBox';
import { getQuestion } from '@/data/question/questionsQuery';
import QuestionView from '@/views/question/QuestionView';

const ViewQuestionPage = () => {
    const { id } = useParams() as { id: string };
    const router = useRouter()

    const {
        data,
        isLoading,
        error,
        isError,
        refetch
    } = useQuery({
        queryKey: ['question', id],
        queryFn: () => getQuestion(id)
    })



    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        return <ErrorBox error={error} refetch={refetch} />
    }

    return (
        <AnimationContainer>
            <PageHeader title='questions&Answer' breadcrumbs={[{ label: 'Home', href: '/' },
            { label: 'questions&Answer', href: '/study/questionsAnswer' },
            { label: `${data.data.title_en}` }
            ]}
                showBackButton={true}

                actions={
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant='contained' color='primary' onClick={() => router.push(`/study/questionsAnswer/edit/${data.data.id}`)}>
                            Edit
                        </Button>

                    </Box>
                }
            />
            <QuestionView question={data.data} />

        </AnimationContainer>)

};

export default ViewQuestionPage;

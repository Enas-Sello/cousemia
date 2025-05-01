'use client';


import { useParams } from 'next/navigation';




import { useQuery } from '@tanstack/react-query';

import AnimationContainer from '@/@core/components/animation-container/animationContainer';
import PageHeader from '@/components/PageHeader';
import Loading from '@/components/loading';
import ErrorBox from '@/components/ErrorBox';
import { getQuestion } from '@/data/question/questionsQuery';
import EditQuestion from '@/views/question/UpdateQuestionForm';

const EditQuestionPage = () => {
    const { id } = useParams() as { id: string };


    const {
        data: qustion,
        isLoading,
        error,
        isError,
        refetch
    } = useQuery({
        queryKey: ['questions', id],
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
            <PageHeader title='Question' breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Questions', href: '/study/questionsAnswer' }, { label: `${qustion.data.title_en}`}]} />
            <EditQuestion data={qustion.data} />
        </AnimationContainer>)

};

export default EditQuestionPage;

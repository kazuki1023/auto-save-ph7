'use client';

import AnswerHeader from '@/components/answer/AnswerHeader';
import AutoInputModal from '@/components/answer/AutoInputModal';
import NameInputForm from '@/components/answer/NameInputForm';
import TripAnswerForm from '@/components/answer/TripAnswerForm';
import { Alert, Button, Card, CardBody } from '@/components/heroui';
import { useAnswerForm } from '@/hooks/useAnswerForm';
import { useAutoInput } from '@/hooks/useAutoInput';

import type { RequestData } from '@/reposiroties/requests';
import type { Session } from 'next-auth';

interface AnswerProps {
  requestData: RequestData;
  session: Session | null;
}

const Answer = ({ requestData, session }: AnswerProps) => {
  // 回答フォームの状態管理
  const {
    name,
    candidateAnswers,
    candidateComments,
    validationErrors,
    globalError,
    setName,
    setCandidateAnswer,
    setCandidateComment,
    submitAnswers,
    getAnsweredCount,
    updateCandidateAnswers,
    updateCandidateComments,
    clearValidationErrors,
  } = useAnswerForm({ requestData });

  // 自動入力機能の状態管理
  const {
    isAutoInputOpen,
    isAutoInputLoading,
    progressMessage,
    setIsAutoInputOpen,
    handleAutoInput,
  } = useAutoInput({
    requestData,
    candidateAnswers,
    candidateComments,
    validationErrors,
    onUpdateAnswers: updateCandidateAnswers,
    onUpdateComments: updateCandidateComments,
    onClearErrors: clearValidationErrors,
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-lg mx-auto space-y-4">
        {/* ヘッダー */}
        <AnswerHeader
          answeredCount={getAnsweredCount()}
          totalCount={requestData.content_json.candidates?.length || 0}
          onAutoInputClick={() => setIsAutoInputOpen(true)}
        />

        {/* 名前入力 */}
        <NameInputForm name={name} onNameChange={setName} />
        {/* グローバルエラー表示 */}
        {globalError && (
          <Alert color="danger" variant="bordered">
            {globalError}
          </Alert>
        )}
        {/* リクエストタイプ別のフォーム */}
        {requestData.type === 'trip' && requestData.content_json.candidates && (
          <TripAnswerForm
            requestData={requestData}
            candidateAnswers={candidateAnswers}
            candidateComments={candidateComments}
            validationErrors={validationErrors}
            onCandidateAnswer={setCandidateAnswer}
            onCandidateComment={setCandidateComment}
          />
        )}
        {/* その他のタイプの場合 */}
        {requestData.type !== 'trip' && (
          <Card>
            <CardBody className="text-center p-8">
              <div className="text-foreground-500">
                このタイプ（{requestData.type}）はまだ対応していません
              </div>
            </CardBody>
          </Card>
        )}
        {/* 確定ボタン */}
        <Button
          onPress={submitAnswers}
          className="bg-[#61C48D] text-white shadow-sm w-full"
          size="lg"
        >
          日程調整候補日を確定する
        </Button>
      </div>

      {/* 自動入力モーダル */}
      <AutoInputModal
        isOpen={isAutoInputOpen}
        isLoading={isAutoInputLoading}
        progressMessage={progressMessage}
        session={session}
        onClose={() => setIsAutoInputOpen(false)}
        onAutoInput={handleAutoInput}
      />
    </div>
  );
};

export default Answer;

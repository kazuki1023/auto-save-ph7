'use client';
// 回答結果表示画面

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Alert, Card, CardBody, CardHeader } from '@/components/heroui';
import MealCandidateResults from '@/components/result/MealCandidateResults';
import TripCandidateResults from '@/components/result/TripCandidateResults';
import { getAnswersByRequestId } from '@/repositories/answers';
import { getRequestByUuid, type RequestData } from '@/repositories/requests';

import type { Tables } from '@/lib/supabase/database.types';

const ResultPage = () => {
  const params = useParams();
  const [requestData, setRequestData] = useState<RequestData | null>(null);
  const [answers, setAnswers] = useState<Tables<'answers'>[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // データを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        // uuidパラメータの型安全性チェック
        const uuid =
          typeof params.uuid === 'string' ? params.uuid : params.uuid?.[0];
        if (!uuid) {
          setError('UUID パラメータが無効です');
          setLoading(false);
          return;
        }

        // リクエストデータを取得
        const requestResult = await getRequestByUuid(uuid);
        if (!requestResult) {
          setError('リクエストデータが見つかりませんでした');
          setLoading(false);
          return;
        }

        setRequestData(requestResult);

        // 回答データを取得
        const answersResult = await getAnswersByRequestId(requestResult.id);
        setAnswers(answersResult);
      } catch (err) {
        console.error('データ取得エラー:', err);
        setError('データの取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.uuid]);

  // 候補別の回答集計
  const getCandidateResults = () => {
    if (!requestData?.content_json.candidates || !answers) return [];

    return requestData.content_json.candidates.map((candidate, index) => {
      const candidateResponses = answers
        .map(answer => {
          const answerJson = answer.answer_json as {
            candidates?: Array<{
              start: string;
              end: string;
              status: 'accepted' | 'pending' | 'rejected';
              note: string;
            }>;
          };

          // 対応する候補を見つける
          const candidateAnswer = answerJson.candidates?.find(
            c => c.start === candidate.start && c.end === candidate.end
          );

          if (!candidateAnswer) return null;

          return {
            name: answer.name || '匿名',
            status: candidateAnswer.status,
            note: candidateAnswer.note,
          };
        })
        .filter(Boolean) as Array<{
        name: string;
        status: 'accepted' | 'pending' | 'rejected';
        note: string;
      }>;

      // 集計
      const accepted = candidateResponses.filter(
        r => r?.status === 'accepted'
      ).length;
      const pending = candidateResponses.filter(
        r => r?.status === 'pending'
      ).length;
      const rejected = candidateResponses.filter(
        r => r?.status === 'rejected'
      ).length;

      return {
        candidate,
        index,
        responses: candidateResponses,
        counts: { accepted, pending, rejected },
        total: candidateResponses.length,
      };
    });
  };

  // NOTE: ステータスの表示ロジックは各コンポーネントに移動しました

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <Alert color="danger" variant="bordered" className="max-w-md">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  if (!requestData) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <Alert color="danger" variant="bordered" className="max-w-md">
            リクエストデータが見つかりませんでした
          </Alert>
        </div>
      </div>
    );
  }

  const candidateResults = getCandidateResults();

  // 合意可能性が高い順にソート（○の数が多い順、次に△の数が多い順）
  const sortedCandidateResults = candidateResults.sort((a, b) => {
    if (b.counts.accepted !== a.counts.accepted) {
      return b.counts.accepted - a.counts.accepted; // ○の数で降順
    }
    return b.counts.pending - a.counts.pending; // ○が同じなら△の数で降順
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* ヘッダー */}
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-center w-full">回答結果</h1>
            <div className="text-center text-foreground-500 w-full">
              {requestData.type === 'trip' ? '旅行' : requestData.type}
              の調整結果
            </div>
          </CardHeader>
        </Card>

        {/* 概要 */}
        <Card>
          <CardBody className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {candidateResults.length}
                </div>
                <div className="text-sm text-foreground-500">候補数</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-success">
                  {answers?.length || 0}
                </div>
                <div className="text-sm text-foreground-500">回答者数</div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* 候補別結果 */}
        {requestData.type === 'trip' && (
          <TripCandidateResults
            sortedCandidateResults={sortedCandidateResults}
          />
        )}

        {requestData.type === 'meal' && (
          <MealCandidateResults
            sortedCandidateResults={sortedCandidateResults}
          />
        )}

        {/* その他のタイプの場合 */}
        {requestData.type !== 'trip' && requestData.type !== 'meal' && (
          <Card>
            <CardBody className="text-center p-8">
              <div className="text-foreground-500">
                このタイプ（{requestData.type}）の結果表示はまだ対応していません
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResultPage;

'use client';
// 回答結果表示画面

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Alert, Card, CardBody, CardHeader, Chip } from '@/components/heroui';
import { formatDateRange } from '@/lib/date/formatters';
import { getAnswersByRequestId } from '@/reposirories/answers';
import { getRequestByUuid, type RequestData } from '@/reposirories/requests';

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

  // ステータスに応じたチップの色
  const getStatusChipColor = (status: 'accepted' | 'pending' | 'rejected') => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'danger';
      default:
        return 'default';
    }
  };

  // ステータスに応じたラベル
  const getStatusLabel = (status: 'accepted' | 'pending' | 'rejected') => {
    switch (status) {
      case 'accepted':
        return '○';
      case 'pending':
        return '△';
      case 'rejected':
        return '×';
      default:
        return '?';
    }
  };

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
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">候補別回答状況</h2>

            {/* 上位候補のハイライト */}
            {sortedCandidateResults.filter(r => r.counts.accepted > 0).length >
              0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-green-800 mb-2">
                  🏆 候補 TOP3
                </h3>
                <div className="text-sm text-green-700">
                  ○の数が多い順に表示しています
                </div>
              </div>
            )}

            {sortedCandidateResults.map((result, index) => {
              const { candidate, counts, responses } = result;
              const startDate = new Date(candidate.start);
              const endDate = new Date(candidate.end);
              const isTopCandidate = index < 3 && counts.accepted > 0;

              // 宿泊数を計算
              const nights = Math.ceil(
                (endDate.getTime() - startDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const days = nights + 1;

              return (
                <Card
                  key={`${candidate.start}-${candidate.end}`}
                  className={`${
                    isTopCandidate
                      ? 'border-2 border-green-400 bg-green-50/50 shadow-lg'
                      : ''
                  }`}
                >
                  <CardHeader>
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          {isTopCandidate && (
                            <div className="flex items-center gap-1">
                              <span className="text-lg">🏆</span>
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                TOP {index + 1}
                              </span>
                            </div>
                          )}
                          <h3 className="text-lg font-medium">
                            {formatDateRange(startDate, endDate)}
                          </h3>
                        </div>
                        <div className="text-sm text-foreground-500">
                          {nights === 0 ? '日帰り' : `${nights}泊${days}日`}
                        </div>
                      </div>

                      {/* 集計サマリー */}
                      <div className="flex gap-2">
                        <Chip
                          color="success"
                          variant={isTopCandidate ? 'solid' : 'flat'}
                          size="sm"
                        >
                          ○ {counts.accepted}
                        </Chip>
                        <Chip color="warning" variant="flat" size="sm">
                          △ {counts.pending}
                        </Chip>
                        <Chip color="danger" variant="flat" size="sm">
                          × {counts.rejected}
                        </Chip>
                      </div>
                    </div>
                  </CardHeader>

                  <CardBody className="pt-0">
                    {/* 個別回答 */}
                    <div className="space-y-2">
                      {responses.map((response, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Chip
                              color={getStatusChipColor(response.status)}
                              variant="solid"
                              size="sm"
                            >
                              {getStatusLabel(response.status)}
                            </Chip>
                            <span className="font-medium">{response.name}</span>
                          </div>
                          {response.note && (
                            <div className="text-sm text-foreground-500 max-w-xs truncate">
                              {response.note}
                            </div>
                          )}
                        </div>
                      ))}

                      {responses.length === 0 && (
                        <div className="text-center text-foreground-400 py-4">
                          まだ回答がありません
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}

        {/* その他のタイプの場合 */}
        {requestData.type !== 'trip' && (
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

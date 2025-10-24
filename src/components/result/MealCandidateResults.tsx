'use client';

import { Card, CardBody, CardHeader, Chip } from '@/components/heroui';
import { formatDate } from '@/lib/date/formatters';

type CandidateResponse = {
  name: string;
  status: 'accepted' | 'pending' | 'rejected';
  note: string;
};

type CandidateResult = {
  candidate: { start: string; end?: string; meta?: { mealTime?: string } };
  index: number;
  responses: CandidateResponse[];
  counts: { accepted: number; pending: number; rejected: number };
  total: number;
};

const getStatusChipColor = (status: CandidateResponse['status']) => {
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

const getStatusLabel = (status: CandidateResponse['status']) => {
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

interface Props {
  sortedCandidateResults: CandidateResult[];
}

const MealCandidateResults = ({ sortedCandidateResults }: Props) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">候補別回答状況</h2>

      {sortedCandidateResults.map((result, index) => {
        const { candidate, counts, responses } = result;
        const startDate = new Date(candidate.start);
        const isTopCandidate = index < 3 && counts.accepted > 0;

        const mealTime = candidate.meta?.mealTime || 'lunch';
        const mealLabel = mealTime === 'lunch' ? 'ランチ' : 'ディナー';
        const mealEmoji = mealTime === 'lunch' ? '☀️' : '🌙';

        return (
          <Card
            key={`${candidate.start}-${candidate.end}-${index}`}
            className={`${isTopCandidate ? 'border-2 border-green-400 bg-green-50/50 shadow-lg' : ''}`}
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
                      {formatDate(startDate)}
                    </h3>
                  </div>
                  <div className="text-sm text-foreground-500">
                    <Chip size="sm" variant="flat">
                      {mealEmoji} {mealLabel}
                    </Chip>
                  </div>
                </div>

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
  );
};

export default MealCandidateResults;

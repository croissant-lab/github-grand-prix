import { TimeToApproveByFileChange } from '@/src/components/charts/TimeToApproveByFileChange';
import { DateInput, useDateInput } from '@/src/components/forms/DateInput';
import { Input, useInput } from '@/src/components/forms/Input';
import { ReposInput, useReposInput } from '@/src/components/forms/ReposInput';
import type { TimeUntilApproveQueryDocumentQuery } from '@/src/gql/graphql';
import { diffByDay, isInRange } from '@/src/helpers/date';
import { roundDigit } from '@/src/helpers/number';
import { useGraphQLQueries } from '@/src/services/common/useGraphQL';
import { timeUntilApproveQueryDocument } from '@/src/services/pullRequest/timeToApprove';
import type { ComponentProps } from 'react';

export const PullRequestUntilApprove = () => {
  const { value: approveNumber, ...approveNumberInputProps } = useInput({
    storeName: 'repo/approveNumber',
  });
  const { value: maxPullRequestNumber, ...maxPrNumberInputProps } = useInput({
    storeName: 'repo/maxPullRequestNumber',
  });
  const { getAllRepos, ...repoInputProps } = useReposInput({
    storeName: 'repo/list',
  });
  const { date: startDate, ...startDateInputProps } = useDateInput({
    storeName: 'repo/startDate',
  });
  const { date: endDate, ...endDateInputProps } = useDateInput({
    storeName: 'repo/endDate',
  });

  const { executeQueries, isPending, data } = useGraphQLQueries(
    getAllRepos().map((repo) => ({
      document: timeUntilApproveQueryDocument,
      variables: {
        owner: repo.owner,
        repo: repo.name,
        ...(approveNumber
          ? { approveNumber: Number.parseInt(approveNumber, 10) }
          : {}),
        ...(maxPullRequestNumber
          ? { maxPullRequestNumber: Number.parseInt(maxPullRequestNumber, 10) }
          : {}),
      },
    })),
  );

  const handleSubmit = () => {
    executeQueries();
  };

  const refinedData = refinePrs(data, {
    start: startDate ?? '2024-07-01',
    end: endDate ?? '2024-08-05',
  });

  console.log('refinedData', refinedData);

  return (
    <main>
      <h1>GitHub Grand Prix</h1>
      <div>
        Approve最低必要人数
        <Input {...approveNumberInputProps} />
      </div>
      <div>
        取得するPRの最大数（この最大数から日付で絞り込みます）
        <Input {...maxPrNumberInputProps} />
      </div>
      <div>
        開始日
        <DateInput {...startDateInputProps} />
      </div>
      <div>
        終了日
        <DateInput {...endDateInputProps} />
      </div>
      <div>
        リポジトリ名
        <ReposInput {...repoInputProps} />
      </div>
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
      <hr />
      <div>Status</div>
      <div>isPending: {isPending ? 'true' : 'false'}</div>
      <hr />
      <div>Result</div>
      <h3>集計</h3>
      <ol>
        <li>
          <div>
            レポジトリ別PR数
            {refinedData?.repositoryCount?.map(({ repo, count }, i) => (
              <div key={i}>
                {repo}: {count}
              </div>
            ))}
          </div>
        </li>
        <li>
          <div>
            作者別PR数
            {refinedData?.prOwnerCount?.map(({ author, PrCount }, i) => (
              <div key={i}>
                {author}: {PrCount}
              </div>
            ))}
          </div>
        </li>
        <li>
          <div>
            作者別修正ファイル数
            {refinedData?.prOwnerFileFixedCount?.map(
              ({ author, fileFixedCount }, i) => (
                <div key={i}>
                  {author}: {fileFixedCount}
                </div>
              ),
            )}
          </div>
        </li>
        <li>
          <div>
            レポジトリ別PR作成者数
            {refinedData?.prCountByRepository?.map((repoData, i) => (
              <div key={i}>
                {repoData.repo}
                <ul>
                  {repoData.pr.map(({ author, count }, j) => (
                    <li key={j}>
                      {author}: {count}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </li>
      </ol>
      <h3>Most</h3>
      <div>
        最もコメント数が多かったPR（平均{refinedData?.avgCommentCount ?? 0}件）
        <ul>
          {refinedData?.commentedPr?.map((pr, i) => (
            <li key={i}>
              <span>[{pr.commentsCount}]</span>
              {'  '}
              <a href={pr.url}>{pr.title}</a>
              {'  '}
              <span>By {pr.author}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        最もリアクションが多かったコメント
        <ul>
          {refinedData?.commentsOrderByReactions.map((pr, i) => (
            <li key={i}>
              <span>[{pr?.reactions.totalCount}]</span>
              {'  '}
              <a href={pr?.url}>{pr?.author?.login ?? ''}のコメント</a>
            </li>
          ))}
        </ul>
      </div>
      <h3>PullRequest</h3>
      <dl>
        <dt>
          PR OpenからApprove {approveNumber ?? '1'}
          件もらうまで（14日以上は排除）
        </dt>
        <dd>
          <ol>
            <li>
              最大: {refinedData?.maxPrApproveTime}日（
              {(refinedData?.maxPrApproveTime ?? 1) * 24}時間）
            </li>
            <li>
              最小: {refinedData?.minPrApproveTime}日（
              {(refinedData?.minPrApproveTime ?? 1) * 24}時間）
            </li>
            <li>
              平均: {refinedData?.avgPrApproveTime}日（
              {(refinedData?.avgPrApproveTime ?? 1) * 24}時間）
            </li>
            <li>
              中央値: {refinedData?.medianPrApproveTime}日（
              {(refinedData?.medianPrApproveTime ?? 1) * 24}時間）
            </li>
          </ol>
        </dd>
      </dl>
      <div>
        <h3>グラフ</h3>
        <div>Approveまでの時間と修正ファイル数の相関関係</div>
        <TimeToApproveByFileChange
          data={refinedData?.prApproveTimeByFileChangeChartData ?? []}
        />
      </div>
    </main>
  );
};

function refinePrs(
  data: TimeUntilApproveQueryDocumentQuery[] | undefined,
  { start, end }: { start: string; end: string },
) {
  if (!data || data?.some((v) => !v)) {
    return;
  }

  console.log('allRepos', data);

  // とりあえずフラットにする
  const flattened = data
    .flatMap((repo) => repo.repository?.pullRequests?.nodes ?? [])
    .filter((pr) => {
      return isInRange(pr?.createdAt, { start, end });
    });
  const comments = flattened.flatMap((repo) => repo?.comments?.nodes ?? []);

  // マージPR数のカウント
  const repositoryCount = flattened.reduce<{ repo: string; count: number }[]>(
    (acc, cur) => {
      if (!cur?.repository?.name) {
        return acc;
      }
      const target = acc.find((v) => v.repo === cur.repository.name);
      if (target) {
        target.count++;
      } else {
        acc.push({ repo: cur.repository.name, count: 1 });
      }

      return acc;
    },
    [],
  );

  // PR作者のカウント
  const prOwnerCount = flattened.reduce<{ author: string; PrCount: number }[]>(
    (acc, cur) => {
      const t = cur?.author?.login;
      if (!t) {
        return acc;
      }
      const target = acc.find((v) => v.author === t);
      if (target) {
        target.PrCount++;
      } else {
        acc.push({ author: t, PrCount: 1 });
      }

      return acc;
    },
    [],
  );

  // PR作者ごとのファイル修正数カウント
  const prOwnerFileFixedCount = flattened.reduce<
    { author: string; fileFixedCount: number }[]
  >((acc, cur) => {
    const t = cur?.changedFiles ?? 0;
    const author = cur?.author?.login;
    if (!author) {
      return acc;
    }
    const target = acc.find((v) => v.author === author);
    if (target) {
      target.fileFixedCount += t;
    } else {
      acc.push({ author, fileFixedCount: t });
    }
    return acc;
  }, []);

  const prCountByRepository = flattened
    .reduce<{ repo: string; pr: { author: string; count: number }[] }[]>(
      (acc, cur) => {
        const repo = cur?.repository?.name;
        const author = cur?.author?.login;

        if (!repo || !author) {
          return acc;
        }
        const target = acc.find((v) => v.repo === repo);
        if (target) {
          const authorCount = target.pr.find((v) => v.author === author);
          if (authorCount) {
            authorCount.count++;
          } else {
            target.pr.push({ author, count: 1 });
          }
        } else {
          acc.push({ repo, pr: [{ author, count: 1 }] });
        }
        return acc;
      },
      [],
    )
    .map((repoData) => {
      return {
        repo: repoData.repo,
        pr: repoData.pr.sort((a, b) => b.count - a.count),
      };
    });

  // 最もコメント数が多かったPRランキング
  flattened.sort(
    (a, b) => (b?.totalCommentsCount ?? 0) - (a?.totalCommentsCount ?? 0),
  );
  const commentedPr = flattened.map((repo) => ({
    author: repo?.author?.login,
    title: repo?.title,
    url: repo?.url,
    commentsCount: repo?.totalCommentsCount,
  }));

  // PRのコメント平均数
  const avgCommentCount =
    commentedPr.reduce<number>(
      (acc, cur) => acc + (cur.commentsCount ?? 0),
      0,
    ) / commentedPr.length;

  // コメントごとのリアクションランキング
  const commentsOrderByReactions = [...comments]
    .sort(
      (a, b) => (b?.reactions.totalCount ?? 0) - (a?.reactions.totalCount ?? 0),
    )
    .filter((_, i) => i < 10);

  // PRのApprove規定人数までの時間
  const prApproveTimeList = flattened
    .map((pr) => ({
      utl: pr?.url,
      createdAt: pr?.createdAt,
      lastApprovedAt: pr?.reviews?.nodes?.at(-1)?.createdAt,
      repository: pr?.repository?.name,
      changedFiles: pr?.changedFiles,
      timeUntilFirstApprove: diffByDay(
        pr?.createdAt,
        pr?.reviews?.nodes?.[0]?.createdAt,
      ),
      timeUntilLastApprove: diffByDay(
        pr?.createdAt,
        pr?.reviews?.nodes?.at(-1)?.createdAt,
      ),
    }))
    .filter((pr) => pr.timeUntilLastApprove < 14);

  const maxPrApproveTime = prApproveTimeList.reduce(
    (acc, cur) => Math.max(acc, cur.timeUntilLastApprove),
    0,
  );
  const minPrApproveTime = prApproveTimeList.reduce(
    (acc, cur) => Math.min(acc, cur.timeUntilLastApprove),
    Number.POSITIVE_INFINITY,
  );
  const avgPrApproveTime =
    prApproveTimeList.reduce((acc, cur) => acc + cur.timeUntilLastApprove, 0) /
    prApproveTimeList.length;

  const medianPrApproveTime = prApproveTimeList.length
    ? prApproveTimeList.sort(
        (a, b) => a.timeUntilLastApprove - b.timeUntilLastApprove,
      )[Math.floor(prApproveTimeList.length / 2)].timeUntilLastApprove
    : 0;

  const prApproveTimeByFileChangeChartData = prApproveTimeList.reduce<
    ComponentProps<typeof TimeToApproveByFileChange>['data']
  >((acc, cur) => {
    const target = acc.find((v) => v.repo === cur.repository);
    if (target) {
      target.records.push({
        approveTime: cur.timeUntilLastApprove,
        fileChange: cur.changedFiles ?? 0,
      });
    } else {
      acc.push({
        repo: cur.repository ?? '',
        records: [
          {
            approveTime: cur.timeUntilLastApprove,
            fileChange: cur.changedFiles ?? 0,
          },
        ],
      });
    }
    return acc;
  }, []);

  return {
    repositoryCount: repositoryCount.sort((a, b) => b.count - a.count),
    prOwnerCount: [...prOwnerCount].sort((a, b) => b.PrCount - a.PrCount),
    prOwnerFileFixedCount: prOwnerFileFixedCount.sort(
      (a, b) => b.fileFixedCount - a.fileFixedCount,
    ),
    prCountByRepository,
    commentedPr,
    avgCommentCount,
    commentsOrderByReactions,
    maxPrApproveTime: roundDigit(maxPrApproveTime, 4),
    minPrApproveTime: roundDigit(minPrApproveTime, 4),
    avgPrApproveTime: roundDigit(avgPrApproveTime, 4),
    medianPrApproveTime: roundDigit(medianPrApproveTime, 4),
    prApproveTimeByFileChangeChartData,
  };
}

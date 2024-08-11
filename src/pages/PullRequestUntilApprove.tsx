import { DateInput, useDateInput } from '@/src/components/forms/DateInput';
import { Input, useInput } from '@/src/components/forms/Input';
import { ReposInput, useReposInput } from '@/src/components/forms/ReposInput';
import type { TimeUntilApproveQueryDocumentQuery } from '@/src/gql/graphql';
import { isInRange } from '@/src/helpers/date';
import { useGraphQLQueries } from '@/src/services/common/useGraphQL';
import { timeUntilApproveQueryDocument } from '@/src/services/pullRequest/timeToApprove';

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
      </ol>
      <h3>Most</h3>
      <div>
        最もコメント数が多かったPR
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
  const flattened = data.flatMap(
    (repo) => repo.repository?.pullRequests?.nodes ?? [],
  );

  const filteredByDates = flattened.filter((pr) => {
    return isInRange(pr?.createdAt, { start, end });
  });
  const comments = filteredByDates.flatMap(
    (repo) => repo?.comments?.nodes ?? [],
  );

  // マージPR数のカウント
  const repositoryCount = filteredByDates.reduce<
    { repo: string; count: number }[]
  >((acc, cur) => {
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
  }, []);

  // PR作者のカウント
  const prOwnerCount = filteredByDates.reduce<
    { author: string; PrCount: number }[]
  >((acc, cur) => {
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
  }, []);

  // PR作者ごとのファイル修正数カウント
  const prOwnerFileFixedCount = filteredByDates.reduce<
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

  // 最もコメント数が多かったPRランキング
  filteredByDates.sort(
    (a, b) => (b?.totalCommentsCount ?? 0) - (a?.totalCommentsCount ?? 0),
  );
  const commentedPr = filteredByDates.map((repo) => ({
    author: repo?.author?.login,
    title: repo?.title,
    url: repo?.url,
    commentsCount: repo?.totalCommentsCount,
  }));

  // コメントごとのリアクションランキング
  const commentsOrderByReactions = [...comments]
    .sort(
      (a, b) => (b?.reactions.totalCount ?? 0) - (a?.reactions.totalCount ?? 0),
    )
    .filter((_, i) => i < 10);

  return {
    repositoryCount: repositoryCount.sort((a, b) => b.count - a.count),
    prOwnerCount: [...prOwnerCount].sort((a, b) => b.PrCount - a.PrCount),
    prOwnerFileFixedCount: prOwnerFileFixedCount.sort(
      (a, b) => b.fileFixedCount - a.fileFixedCount,
    ),
    commentedPr,
    commentsOrderByReactions,
  };
}

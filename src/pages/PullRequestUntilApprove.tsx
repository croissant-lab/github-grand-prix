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
        取得するPRの最大数（ここから日付で絞り込みます）
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
      <div>
        1. No of Prs
        {refinedData?.repositoryCount?.map(({ repo, count }, i) => (
          <div key={i}>
            {repo}: {count}
          </div>
        ))}
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

  const flattened = data.flatMap(
    (repo) => repo.repository?.pullRequests?.nodes ?? [],
  );
  const filteredByDates = flattened.filter((pr) => {
    return isInRange(pr?.createdAt, { start, end });
  });

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

  return {
    repositoryCount,
  };
}

import { DateInput, useDateInput } from '@/src/components/forms/DateInput';
import { ReposInput, useReposInput } from '@/src/components/forms/ReposInput';
import { mostCommentedQueryDocument } from '@/src/services/comment/mostCommented';
import { useGraphQL } from '@/src/services/common/useGraphQL';

export const PullRequest = () => {
  const { getRepo, ...repoInputProps } = useReposInput({
    storeName: 'repo/list',
  });
  const { date: startDate, ...startDateInputProps } = useDateInput({
    storeName: 'repo/startDate',
  });
  const { date: endDate, ...endDateInputProps } = useDateInput({
    storeName: 'repo/endDate',
  });

  const { executeQuery, isPending, data } = useGraphQL(
    mostCommentedQueryDocument,
    {
      owner: getRepo(0).owner,
      repo: getRepo(0).name,
    },
  );

  const handleSubmit = () => {
    executeQuery();
  };
  console.log(data);

  return (
    <main>
      <h1>GitHub Grand Prix</h1>
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
      <div>isPending: {isPending ? 'true' : 'false'}</div>
    </main>
  );
};

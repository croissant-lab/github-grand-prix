import { useStorage } from '@/src/hooks/useStorage';
import { type ChangeEvent, useEffect, useMemo, useState } from 'react';

const placeHolder = `<owner>/<repository>
<owner>/<repository>
<owner>/<repository>
....
`;

type Props = {
  onChange: (value: string) => void;
  storeName: `${string}/${string}`;
};

export const ReposInput = ({ onChange, storeName }: Props) => {
  const { storedValue, setStoredValue } = useStorage(storeName);

  useEffect(() => {
    onChange(storedValue);
  }, [onChange, storedValue]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setStoredValue(value);
  };

  return (
    <textarea
      rows={10}
      cols={50}
      value={storedValue}
      onChange={handleChange}
      placeholder={placeHolder}
      name="repo"
    />
  );
};

type UseReposInputArgs = Pick<Props, 'storeName'>;

export const useReposInput = ({ storeName }: UseReposInputArgs) => {
  const [repoString, setRepo] = useState('');

  const repo = useMemo(() => RepoTextToArray(repoString), [repoString]);

  const handleChange = (value: string) => {
    setRepo(value);
  };

  const getRepo = (index: number) => repo[index] ?? { owner: '', name: '' };
  const getAllRepos = () => repo;

  return {
    onChange: handleChange,
    storeName,
    repo,
    getRepo,
    getAllRepos,
  };
};

export const RepoTextToArray = (text: string) => {
  const rows = text.split('\n').filter((v) => v);
  return rows.map((row) => {
    const [owner, name] = row.split('/');
    return { owner, name };
  });
};

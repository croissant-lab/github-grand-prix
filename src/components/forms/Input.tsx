import { useStorage } from '@/src/hooks/useStorage';
import { type ChangeEvent, useEffect, useState } from 'react';

type Props = {
  onChange: (value: string) => void;
  storeName: `${string}/${string}`;
};

export const Input = ({ onChange, storeName }: Props) => {
  const { storedValue, setStoredValue } = useStorage(storeName);

  useEffect(() => {
    onChange(storedValue);
  }, [onChange, storedValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setStoredValue(value);
  };

  return <input type="text" value={storedValue} onChange={handleChange} />;
};

type UseInputArgs = Pick<Props, 'storeName'>;

export const useInput = ({ storeName }: UseInputArgs) => {
  const [value, setValue] = useState('');

  const handleChange = (value: string) => {
    setValue(value);
  };

  return {
    onChange: handleChange,
    storeName,
    value,
  };
};

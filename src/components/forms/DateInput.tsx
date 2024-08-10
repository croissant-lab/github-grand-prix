import { useStorage } from '@/src/hooks/useStorage';
import { type ChangeEvent, useEffect, useState } from 'react';

type Props = {
  onChange: (value: string) => void;
  storeName: `${string}/${string}`;
};

export const DateInput = ({ onChange, storeName }: Props) => {
  const { storedValue, setStoredValue } = useStorage(storeName);

  useEffect(() => {
    onChange(storedValue);
  }, [onChange, storedValue]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setStoredValue(value);
  };

  return <input type="date" value={storedValue} onChange={handleChange} />;
};

type UseDateInputArgs = Pick<Props, 'storeName'>;

export const useDateInput = ({ storeName }: UseDateInputArgs) => {
  const [date, setDate] = useState('');

  const handleChange = (value: string) => {
    setDate(value);
  };

  return {
    onChange: handleChange,
    storeName,
    date,
  };
};

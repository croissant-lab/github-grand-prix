import { useEffect, useState } from 'react';

export const useStorage = (storeName: string) => {
  const [storedValue, setStoredValue] = useState<string>(() => {
    const storedValue = localStorage.getItem(storeName);
    return storedValue || '';
  });

  useEffect(() => {
    localStorage.setItem(storeName, storedValue);
  }, [storeName, storedValue]);

  return { storedValue, setStoredValue };
};

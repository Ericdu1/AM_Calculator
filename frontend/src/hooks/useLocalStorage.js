import { useState, useEffect } from 'react';

// 自定义hook，用于在localStorage中存储数据
function useLocalStorage(key, initialValue) {
  // 获取初始值（如果存在于localStorage中就用它，否则使用提供的初始值）
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // 尝试从localStorage获取数据
      const item = window.localStorage.getItem(key);
      // 如果数据存在，解析JSON并返回，否则返回初始值
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 当存储值发生变化时，更新localStorage
  useEffect(() => {
    try {
      // 保存到localStorage
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage; 
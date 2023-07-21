export const fetchData = async (url: string): Promise<any> => {
  const response = await fetch(url);
  return response.json();
};

export const fetchDataWithConfig = async (
  url: string,
  config: RequestInit
): Promise<any> => {
  const response = await fetch(url, config);
  return response.json();
};

export const checkStatus = async (
  url: string,
  config: RequestInit
): Promise<boolean> => {
  const response = await fetch(url, config);
  return response.ok;
};

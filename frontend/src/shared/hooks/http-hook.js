import { useState, useCallback, useRef, useEffect } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [status, setStatus] = useState();

  const activeHttpRequests = useRef([]);
  const httpAbortCtrl = new AbortController();
  const sendRequest = useCallback(
    async (url, method = 'GET', body = null, headers = {}) => {
      setIsLoading(true);
    
      activeHttpRequests.current.push(httpAbortCtrl);
      let response;
      try {
        response = await fetch(url, {
          method,
          body,
          headers,
          signal: httpAbortCtrl.signal
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        );
        setStatus(response.status);
        if (!response.ok) {
          console.log(responseData)
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        if (!response)
          setStatus(400);
        setIsLoading(false);
        throw err;
      
      }
    
   
    },
    []
  );
  

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort()); 
      httpAbortCtrl.abort();
       
    };
  }, []);

 
  return { isLoading, error, status, sendRequest, clearError };
};

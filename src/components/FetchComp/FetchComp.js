import React, { useState, useRef } from "react";
import axios from "axios";

const FetchComponent = () => {
  const [concurrency, setConcurrency] = useState(1);
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const requestIndex = useRef(1);

  const handleStart = () => {
    setIsRunning(true);
    const requestsPerSecond = concurrency;
      let activeRequests = 0;
      
      const axiosInstance = axios.create({
        baseURL: "http://localhost:5002", 
      });

      const sendRequest = async () => {
        
      if (requestIndex.current > 1000) return;
      if (activeRequests < concurrency) {
        activeRequests++;
        try {
          const response = await axiosInstance.post("/api", {
            index: requestIndex.current,
          });
          setResults((prevResults) => [
            ...prevResults,
            `Request ${response.data.index} successful`,
          ]);
        } catch (error) {
          console.error("Error:", error);
        } finally {
          activeRequests--;
          requestIndex.current++;
          sendRequest();
        }
      }
    };

    const intervalId = setInterval(() => {
      if (requestIndex.current > 1000) {
        clearInterval(intervalId);
        setIsRunning(false);
      } else {
        for (let i = 0; i < requestsPerSecond; i++) {
          sendRequest();
        }
      }
    }, 1000);
  };

  return (
    <div>
      <input
        type="number"
        min="1"
        max="100"
        value={concurrency}
        onChange={(e) => setConcurrency(Number(e.target.value))}
        disabled={isRunning}
        required
      />
      <button onClick={handleStart} disabled={isRunning}>
        Start
      </button>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result}</li>
        ))}
      </ul>
    </div>
  );
};

export default FetchComponent;

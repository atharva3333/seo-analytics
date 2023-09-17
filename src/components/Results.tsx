/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";

import { TailSpin } from "react-loader-spinner";
interface TaskResult {
  id: string;
  status: string;
  // Define other properties as needed based on the API response
}

interface Summary {
  result: any;
  data: any;
  checks: any;

  id: string;
  status: string;
  // Define other properties as needed based on the API response
}

const MyDataForSEOComponent: React.FC = () => {
  const [results, setResults] = useState<TaskResult[]>([]); // Define state to store the results
  const [summary, setSummary] = useState<Summary[]>([]); // Define state to store the results
  const [taskID, setTaskID] = useState<string | null>(null); // State to store the task ID
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [inputUrl, setInputUrl] = useState<string>(""); // State to capture the user's input URL

  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };

  const handleSubmit = () => {
    // Validate the input URL (add your validation logic here)
    if (!inputUrl) {
      alert("Please enter a valid URL.");
      return;
    }


   

    // Create the API request with the user's input as the target
    const postArray = [
      {
        target: inputUrl, // Set the target to the user's input URL
        max_crawl_pages: 10,
        load_resources: true,
        enable_javascript: true,
        custom_js: "meta = {}; meta.url = document.URL; meta;",
        tag: "some_string_123",
        pingback_url: "https://your-server.com/pingscript?id=$id&tag=$tag",
      },
    ];

    // Clear previous results and set loading to true
    console.log(results,taskID);
    
    setResults([]);
    setSummary([]);
    setIsLoading(true);

    // Make the API request
    fetchDataForSEO(postArray);
  };

  const fetchDataForSEO = async (postArray: any) => {
    try {
      const response = await axios.post(
        "https://api.dataforseo.com/v3/on_page/task_post",
        postArray,
        {
          auth: {
            username: "atharvad660@gmail.com",
            password: "742469cfdbb177d1",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result: TaskResult[] = response.data.tasks;
      // Update the state with the API results
      setResults(result);

      // Check if there's at least one result and set the task ID
      if (result.length > 0) {
        setTaskID(result[0].id);

        // Delay the fetch of summary by 2 seconds (adjust as needed)
        setTimeout(() => {
          fetchSummary(result[0].id);
        }, 20000);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Set loading to false in case of an error
    }
  };

  const fetchSummary = async (taskId: string) => {
    try {
      console.log(`found id:${taskId}`);

      const response = await axios.get(
        `https://api.dataforseo.com/v3/on_page/summary/${taskId}`,
        {
          auth: {
            username: "atharvad660@gmail.com",
            password: "742469cfdbb177d1",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const taskSummary: Summary[] = response.data.tasks;
      setSummary(taskSummary);

      // Handle the summary result as needed
      console.log("Summary Found", taskSummary);

      // Turn off the loader animation
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Set loading to false in case of an error
    }
  };
  const firstResultChecks = summary[0]?.result[0]?.domain_info?.checks;
  const selectedKeys = ['http2','sitemap', 'robots_txt', 'ssl','test_page_not_found'];
  return (
    <div className="px-2">
      <div className="flex flex-col sm:flex-row h-8 justify-center gap-5 items-center mt-10">
        <input
          className="border border-black rounded-full px-4 py-2"
          type="text"
          value={inputUrl}
          onChange={handleUrlInputChange}
          placeholder="https://example.com"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-[#5a18ee] text-white font-bold rounded-full"
        >
          Generate Report
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center mt-5">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
          <p>Please be patient your data is loading</p>
        </div>
      ) : (
        summary.length > 0 && (
          <div>
            <h1 className="text-center mt-10 text-3xl font-bold">
              Report for website <span className="underline">{summary[0]?.data?.target}</span> 
            </h1>
            <h3 className="text-2xl my-6 text-[#5a18ee] font-black">
                    Domain Informantion
                  </h3>

            <ul className="text-center flex flex-wrap justify-center gap-5">
        {Object.entries(firstResultChecks)
        .filter(([key]) => selectedKeys.includes(key))
        .map(([key, value]) => (
          <li key={key} className="p-2 border rounded bg-[#5a18ee] text-white w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] flex justify-center items-center">
            <div>
              <p className="font-bold sm:text-4xl text-xl">{value ? 'True' : 'False'}</p>
              <p className="mt-5">{key}</p>
            </div>
             
          </li>
        ))}
      </ul>
            <ul>
              {summary.map((item, index) => (
                <li key={index}>
                  <h3 className="text-2xl my-6 text-[#5a18ee] font-black">
                    Page Matrics
                  </h3>
                  <ul className="text-center flex flex-wrap justify-center gap-5">
                    {Object.entries(item.result[0].page_metrics)
                      .filter(([metric, value]) => {
                        // Exclude "checks" and its sub-metrics
                        return metric !== "checks" && typeof value !== "object";
                      })
                      .map(([metric, value]) => (
                        <li
                          key={metric}
                          className="p-2 border rounded bg-[#5a18ee] text-white w-[120px] h-[120px] sm:w-[180px] sm:h-[180px] flex justify-center items-center"
                        >
                          <div>
                            <p className="font-bold sm:text-4xl text-xl">{`${value}`}</p>
                            <p>{`${metric}`}</p>
                          </div>
                        </li>
                      ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default MyDataForSEOComponent;

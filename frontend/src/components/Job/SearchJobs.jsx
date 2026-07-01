import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";

const SearchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthorized } = useContext(Context);

  // Fetch all jobs once when the component loads
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/job/getall",
          {
            withCredentials: true,
          }
        );

        setJobs(data.jobs || []);
      } catch (error) {
        console.error(error);
        setJobs([]);
      }
    };

    fetchJobs();
  }, []);

  // Redirect if user is not logged in
  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  // Trigger search only when Search button is clicked
  const handleSearch = () => {
    setSearchTerm(query.trim().toLowerCase());
  };

  // Filter jobs using the searchTerm
  const filteredJobs = jobs.filter((job) => {
    if (!searchTerm) return false;

    return (
      (job.title &&
        job.title.toLowerCase().includes(searchTerm)) ||
      (job.description &&
        job.description.toLowerCase().includes(searchTerm)) ||
      (job.category &&
        job.category.toLowerCase().includes(searchTerm)) ||
      (job.country &&
        job.country.toLowerCase().includes(searchTerm)) ||
      (job.city &&
        job.city.toLowerCase().includes(searchTerm))
    );
  });

  return (
    <section className="jobSearch page">
      <div className="container">
       <center> <h1>Search Jobs</h1></center>

        <div
          className="search_box"
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
                <input
                  type="text" className="searchjob_input"
                  placeholder="Search by title, keyword, category, city or country"
                  value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            style={{ flex: 1 }}
                />

          <button onClick={handleSearch} className="searchBtn">
            Search
          </button>
        </div>

        <div className="banner">
          {searchTerm === "" ? (
            <p></p>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="card" key={job._id}>
                    <p>{job.title}</p>
                    <p>{job.category}</p>
                    <p>{job.country}</p>
                    <Link to={`/job/${job._id}`}>Job Details</Link>
              </div>
            ))
          ) : (
            <p>No jobs found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchJobs;

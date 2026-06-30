import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import { Context } from "../../main";

const SearchJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const { isAuthorized } = useContext(Context);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        });
        console.log(data.jobs);
        setJobs(data.jobs || []);
      } catch (error) {
        console.error(error);
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized) {
    return <Navigate to="/login" />;
  }

  const q = query.trim().toLowerCase();
  const filteredJobs = jobs.filter((job) => {
    if (!q) return true;
    return (
      (job.title && job.title.toLowerCase().includes(q)) ||
      (job.description && job.description.toLowerCase().includes(q)) ||
      (job.category && job.category.toLowerCase().includes(q)) ||
      (job.country && job.country.toLowerCase().includes(q)) ||
      (job.city && job.city.toLowerCase().includes(q))
    );
  });

  return (
    <section className="search page">
      <div className="container">
        <h1>Search Jobs</h1>

        <div className="search_box">
          <input
            type="text"
            placeholder="Search by title, keyword, category, city or country"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="banner">
          {filteredJobs && filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="card" key={job._id}>
                <p>{job.title}</p>
                <p>{job.category}</p>
                <p>
                  {job.country} {job.city ? `- ${job.city}` : ""}
                </p>
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

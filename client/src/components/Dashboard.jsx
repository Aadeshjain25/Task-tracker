
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('/api/projects')
      .then((res) => setProjects(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <Link to={`/projects/${project._id}`}>{project.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;

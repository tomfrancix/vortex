import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SelectedCompany from '../components/SelectedCompany';
import { faPlusSquare } from '@fortawesome/free-regular-svg-icons';

const Manager = ({ getAccessTokenSilently }) => {
  const [projects, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace 'your-api-endpoint/projects' with the actual endpoint
        const accessToken = await getAccessTokenSilently();
        const response = await fetch('your-api-endpoint/projects', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setCompanies([
            {
                id: 1,
                name: "vortex",
                data: {
                    description: "This is a project"
                }
            },
            {
                id: 2,
                name: "streamnote",
                data: {
                    description: "This is another project"
                }
            }
        ]);

        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        } else {
          console.error('Failed to fetch projects:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);

  const handleCompanyClick = (project) => {
    setSelectedCompany(project);
  };

  return (
    <div className="container-fluid px-0">
      <div className="d-flex flex-row" style={{ borderBottom: "1px solid black", padding: "1px" }}>
        {projects.map((project) => (
          <button className="px-0" key={project.id} onClick={() => handleCompanyClick(project)}>
            <div className={`project-tab ${selectedCompany && selectedCompany.id === project.id ? 'selected' : ''}`}>
              <span>{project.name}</span>
              {/* Add more details about the project */}
            </div>
          </button>
        ))}
        <button className="px-0" onClick={() => handleCompanyClick(null)}>
          <div className={`project-tab ${selectedCompany === null ? 'selected' : ''}`}>
            <span><FontAwesomeIcon icon={faPlusSquare} /></span>
            {/* Add more details about the project */}
          </div>
        </button>
      </div>
      {selectedCompany && (
        <SelectedCompany selectedCompany={selectedCompany}/>
      )}
    </div>
  );
};

export default Manager;
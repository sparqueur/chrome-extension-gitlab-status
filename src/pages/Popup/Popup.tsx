import React, { useEffect, useState } from 'react';
import logo from './logo.png';
import './Popup.scss';
import { GitlabConfiguration, GitlabProject } from '../../model';

function Popup() {

  const [loading, setLoading] = useState<boolean>(true);

  const [gitlabConfiguration, setGitlabConfiugration] = useState<GitlabConfiguration>(
    {
      host: "https://gitlab.com",
      token: "",
      projects: []
    });

  const [newGitlabProject, setNewGitlabProject] = useState<GitlabProject>({
    project: "",
    branch: "main",
    status: "none"
  });

  useEffect(() => {
    function handleGetGitlabConfiguration(gitlabConfiguration: GitlabConfiguration) {
      if (!!gitlabConfiguration) {
        setGitlabConfiugration(gitlabConfiguration);
      }
      setLoading(false);
    }

    chrome.storage.local.get(['configuration'], function (result: any) {
      handleGetGitlabConfiguration(result.configuration);
    });
  }, []);

  const onDeleteGitlabProject = (gitlabProject: GitlabProject) => {
    setGitlabConfiugration({
      ...gitlabConfiguration,
      projects: gitlabConfiguration.projects.filter((gitlabProject2) => {
        return gitlabProject.project !== gitlabProject2.project || gitlabProject.branch !== gitlabProject2.branch
      })
    });
  }

  const onGitlabConfigurationValueChange = (value: any, field: keyof GitlabConfiguration) => {
    gitlabConfiguration[field] = value;
    setGitlabConfiugration({
      ...gitlabConfiguration
    });
  }

  const onNewProjectValueChange = (value: any, field: keyof GitlabProject) => {
    newGitlabProject[field] = value;
    setNewGitlabProject({
      ...newGitlabProject
    });
  }

  const saveGitlabConiguration = () => {
    chrome.storage.local.set({ configuration: gitlabConfiguration }, function () {
      console.debug("Configuration saved");
      window.close();
    });
  }


  const handleNewProjectSubmit = (evt: any) => {

    evt.preventDefault();

    // Check if project does not already exists
    if (-1 === gitlabConfiguration.projects.findIndex((gitlabProject) => {
      return newGitlabProject.project === gitlabProject.project && newGitlabProject.branch === gitlabProject.branch
    })) {
      setGitlabConfiugration({
        ...gitlabConfiguration,
        projects: [...gitlabConfiguration.projects, newGitlabProject]
      });
    }

    setNewGitlabProject({
      project: "",
      branch: "main",
      status: "none"
    });
  }

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <div className='mb-3'>
        <ul className="list-group">
          {gitlabConfiguration.projects.map(function (gitlabProject, index) {
            return <li className='list-group-item d-flex justify-content-between align-items-center' key={gitlabProject.project + gitlabProject.branch}>
              <a href={ `${gitlabConfiguration.host}/${gitlabProject.project}/-/pipelines?page=1&scope=branches&ref=${gitlabProject.branch}` } target="_blank">{gitlabProject.project} ({gitlabProject.branch})</a>
              <span>
                {
                  {
                    'none': <span className='text-muted'><i className="bi bi-question-circle"></i></span>,
                    'disconnected': <span className='text-warning'><i className="bi bi-wifi-off"></i></span>,
                    'success': <span className='text-success'><i className="bi bi-check-circle"></i></span>,
                    'error': <span className='text-danger'><i className="bi bi-exclamation-circle-fill"></i></span>
                  }[gitlabProject.status]
                }
                <i className="bi bi-x-lg" style={{ marginLeft: "10px" }} onClick={() => onDeleteGitlabProject(gitlabProject)}></i>
              </span>
            </li>;
          })}
        </ul>
      </div>

      <form onSubmit={handleNewProjectSubmit}>
        <div className="input-group mb-3">

          <input type="text" className="form-control" placeholder="mygroup/myproject" value={newGitlabProject.project} onChange={(e) => onNewProjectValueChange(e.target.value, 'project')}></input>
          <input type="text" className="form-control" value={newGitlabProject.branch} onChange={(e) => onNewProjectValueChange(e.target.value, 'branch')} style={{ maxWidth: "100px" }}></input>
          <button className="btn btn-primary" type="submit" id="button-addon2"><i className="bi bi-plus"></i></button>

        </div>
      </form>

      <hr className="my-12" />

      <form>
        <div className="mb-3">
          <input type="text" placeholder='Gitlab server' className="form-control" id="gitlabServer"
            value={gitlabConfiguration.host}
            onChange={(e) => onGitlabConfigurationValueChange(e.target.value, 'host')}
          ></input>
        </div>
        <div className="mb-3">
          <input type="password" placeholder="Gitlab token" className="form-control" id="gitlabToken"
            value={gitlabConfiguration.token}
            onChange={(e) => onGitlabConfigurationValueChange(e.target.value, 'token')}
          ></input>
        </div>
      </form>

      <hr className="my-12" />

      <button type="button" className="btn btn-primary" onClick={saveGitlabConiguration}>Save</button>

    </div>
  );
}

export default Popup;

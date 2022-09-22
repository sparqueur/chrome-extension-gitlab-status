import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import './Popup.scss';
import { GitlabConfiguration, GitlabProject } from '../../model';

function Popup() {

  const [loading, setLoading] = useState<boolean>(true);

  const [gitlabConfiguration, setGitlabConfiugration] = useState<GitlabConfiguration>(
    {
      projects: []
    });


  useEffect(() => {
    function handleGetGitlabConfiguration(gitlabConfiguration: GitlabConfiguration) {
      if (!!gitlabConfiguration) {
        setGitlabConfiugration(gitlabConfiguration);
      }
      setLoading(false);
    }

    chrome.storage.local.get(['status'], function (result: any) {
      handleGetGitlabConfiguration(result.status);
    });
  }, []);


  const openConfiguration = () => {
    chrome.runtime.openOptionsPage(function () {
      window.close();
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
              </span>
            </li>;
          })}
        </ul>
      </div>

      <hr className="my-12" />

      <button type="button" className="btn btn-primary" onClick={openConfiguration}>Configure</button>

    </div>
  );
}

export default Popup;

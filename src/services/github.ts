import config from 'config';
import axios from 'axios';

const generateRequest = (username: string) => {
  const githubClient = config.get('Github.CLIENT_ID');
  const githubSecret = config.get('Github.SECRET');

  return axios.create({
    baseURL: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClient}&client_secret=${githubSecret}`,
    // baseURL: `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClient}&client_secret=${githubSecret}`,
    headers: {
      'user-agent': 'node.js'
    }
  });
};

export { generateRequest };

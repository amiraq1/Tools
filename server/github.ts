import { Octokit } from '@octokit/rest';

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=github',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;

  if (!connectionSettings || !accessToken) {
    throw new Error('GitHub not connected');
  }
  return accessToken;
}

export async function getUncachableGitHubClient() {
  const accessToken = await getAccessToken();
  return new Octokit({ auth: accessToken });
}

export async function createRepository(name: string, description?: string, isPrivate: boolean = false) {
  const octokit = await getUncachableGitHubClient();
  
  const response = await octokit.repos.createForAuthenticatedUser({
    name,
    description: description || `${name} repository`,
    private: isPrivate,
    auto_init: false
  });
  
  return response.data;
}

export async function getAuthenticatedUser() {
  const octokit = await getUncachableGitHubClient();
  const response = await octokit.users.getAuthenticated();
  return response.data;
}

export async function pushFileToRepo(owner: string, repo: string, path: string, content: string, message: string) {
  const octokit = await getUncachableGitHubClient();
  
  let sha: string | undefined;
  try {
    const { data } = await octokit.repos.getContent({
      owner,
      repo,
      path
    });
    if (!Array.isArray(data) && 'sha' in data) {
      sha = data.sha;
    }
  } catch (error: any) {
    if (error.status !== 404) {
      throw error;
    }
  }

  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString('base64'),
    sha
  });
  
  return data;
}

export async function getOrCreateRepo(name: string, description?: string) {
  const octokit = await getUncachableGitHubClient();
  const user = await getAuthenticatedUser();
  
  try {
    const { data } = await octokit.repos.get({
      owner: user.login,
      repo: name
    });
    return data;
  } catch (error: any) {
    if (error.status === 404) {
      return await createRepository(name, description, false);
    }
    throw error;
  }
}

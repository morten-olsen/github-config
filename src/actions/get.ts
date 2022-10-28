import { Octokit } from 'octokit';
import { handlers } from '../handlers';
import { Config } from '../types/config';

type Options = {
  owner: string;
  repo: string;
  octo: Octokit;
};

const get = async ({ owner, repo, octo }: Options) => {
  const result: Config = {};
  for (const [sectionName, section] of Object.entries(handlers)) {
    if (section) {
      const handler = handlers[sectionName as keyof Config];
      if (handler) {
        result[sectionName as keyof Config] = (await handler.get({
          owner,
          repo,
          octo,
        })) as any;
      }
    }
  }
  return result;
};

export { get };

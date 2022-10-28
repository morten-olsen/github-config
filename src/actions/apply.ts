import { Octokit } from 'octokit';
import { handlers } from '../handlers';
import { Config } from '../types/config';

type Options = {
  owner: string;
  repo: string;
  octo: Octokit;
  config: Config;
};

const apply = async ({ owner, repo, octo, config }: Options) => {
  for (const sectionName in config) {
    const section = config[sectionName as keyof Config];
    if (section) {
      const handler = handlers[sectionName as keyof Config];
      if (handler) {
        await handler.set({ owner, repo, octo, section: section as any });
      }
    }
  }
};

export { apply };

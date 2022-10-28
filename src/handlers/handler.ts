import { Octokit } from 'octokit';
import { Config } from '../types/config';

type SetOptions<TSection extends keyof Config> = {
  repo: string;
  owner: string;
  octo: Octokit;
  section: Config[TSection];
};

type GetOptions = {
  repo: string;
  owner: string;
  octo: Octokit;
};

type Handler<TSection extends keyof Config> = {
  get: (options: GetOptions) => Promise<Config[TSection]>;
  set: (options: SetOptions<TSection>) => Promise<void>;
};

const ifSet = <T, R>(value: T, fn: (value: Exclude<T, undefined>) => R) => {
  if (value !== undefined) {
    return fn(value as Exclude<T, undefined>);
  }
};

const ifAny = <R>(values: any[], fn: () => R) => {
  if (values.some((value) => value !== undefined)) {
    return fn();
  }
};

export type { Handler };
export { ifSet, ifAny };

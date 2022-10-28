import { Config } from '../types/config';
import { branchesHandler } from './branches';
import { generalHandler } from './general';
import { Handler } from './handler';

type Handlers = {
  [TSection in keyof Config]?: Handler<TSection>;
};

const handlers: Handlers = {
  general: generalHandler,
  branches: branchesHandler,
};

export type { Handlers };
export { handlers };

import { Config } from '../types/config';
import { Handler, ifAny } from './handler';

const generalHandler: Handler<'general'> = {
  get: async ({ repo, owner, octo }) => {
    const config = await octo.rest.repos.get({
      owner,
      repo,
    });
    const result: Config['general'] = {
      description: config.data.description || undefined,
      homepage: config.data.homepage || undefined,
      issues: config.data.has_issues,
      wikis: config.data.has_wiki,
      projects: config.data.has_projects,
      visibility: config.data.visibility as any,
      defaultBranch: config.data.default_branch || undefined,
      pullRequests: {
        allowSquashMerge: config.data.allow_squash_merge,
        allowMergeCommit: config.data.allow_merge_commit,
        allowRebaseMerge: config.data.allow_rebase_merge,
        deleteBranchOnMerge: config.data.delete_branch_on_merge,
        allowAutoMerge: config.data.allow_auto_merge,
      },
    };
    return result;
  },
  set: async ({ repo, owner, section, octo }) => {
    ifAny(
      [
        section?.description,
        section?.homepage,
        section?.wikis,
        section?.issues,
        section?.projects,
        section?.visibility,
        section?.pullRequests?.allowMergeCommit,
        section?.pullRequests?.allowRebaseMerge,
        section?.pullRequests?.allowSquashMerge,
        section?.pullRequests?.allowAutoMerge,
        section?.pullRequests?.deleteBranchOnMerge,
        section?.pullRequests?.mergeCommitTitle,
        section?.pullRequests?.mergeCommitBody,
        section?.pullRequests?.squashCommitTitle,
        section?.pullRequests?.squashCommitBody,
      ],
      async () => {
        await octo.rest.repos.update({
          owner,
          repo,
          description: section?.description,
          homepage: section?.homepage,
          has_wiki: section?.wikis,
          has_issues: section?.issues,
          has_projects: section?.projects,
          visibility: section?.visibility,
          allow_merge_commit: section?.pullRequests?.allowMergeCommit,
          allow_rebase_merge: section?.pullRequests?.allowRebaseMerge,
          allow_squash_merge: section?.pullRequests?.allowSquashMerge,
          allow_auto_merge: section?.pullRequests?.allowAutoMerge,
          delete_branch_on_merge: section?.pullRequests?.deleteBranchOnMerge,
          squash_merge_commit_title: section?.pullRequests?.squashCommitTitle,
          squash_merge_commit_message: section?.pullRequests?.squashCommitBody,
          merge_commit_title: section?.pullRequests?.mergeCommitTitle,
          merge_commit_message: section?.pullRequests?.mergeCommitBody,
        });
      }
    );
  },
};

export { generalHandler };

import { Config } from '../types/config';
import { Handler, ifAny } from './handler';

const branchesHandler: Handler<'branches'> = {
  get: async ({ repo, owner, octo }) => {
    return {}; // TODO:
  },
  set: async ({ repo, owner, section, octo }) => {
    for (const branch of section || []) {
      octo.rest.repos.updateBranchProtection({
        owner,
        repo,
        branch: branch.name,
        enforce_admins: branch.enforceAdmins || null,
        required_status_checks: branch.requiredStatusChecks
          ? {
              strict: branch.requiredStatusChecks.strict || false,
              contexts: [],
              checks: branch.requiredStatusChecks.checks,
            }
          : null,
        required_pull_request_reviews: branch.pullRequestReview
          ? {
              dismiss_stale_reviews:
                branch.pullRequestReview.dismissesStaleReviews,
              dismissal_restrictions: branch.pullRequestReview.canDismiss
                ? {
                    users: branch.pullRequestReview.canDismiss.users || [],
                    teams: branch.pullRequestReview.canDismiss.teams || [],
                    apps: branch.pullRequestReview.canDismiss.apps || [],
                  }
                : undefined,
              require_code_owner_reviews:
                branch.pullRequestReview.requiresCodeOwnerReviews,
              required_approving_review_count:
                branch.pullRequestReview.requiredApprovingReviewCount,
              //require_last_push_approval:
              //  branch.pullRequestReview.canApproveOwnPullRequest,
              bypass_pull_request_allowances: branch.pullRequestReview
                .allowedToBypass
                ? {
                    users: branch.pullRequestReview.allowedToBypass.users || [],
                    teams: branch.pullRequestReview.allowedToBypass.teams || [],
                    apps: branch.pullRequestReview.allowedToBypass.apps || [],
                  }
                : undefined,
            }
          : null,
        restrictions: branch.allowedToPush
          ? {
              users: branch.allowedToPush.users || [],
              teams: branch.allowedToPush.teams || [],
              apps: branch.allowedToPush.apps || [],
            }
          : null,
        required_linear_history: branch.requiresLinearHistory,
        allow_force_pushes: branch.allowForcePushes,
        allow_deletions: branch.allowDeletions,
        required_conversation_resolution: branch.requireConversationResolution,
      });
    }
  },
};

export { branchesHandler};

import { Type, Static } from '@sinclair/typebox';

const pullRequestReviewSchema = Type.Object({
  canDismiss: Type.Optional(
    Type.Union([
      Type.Object({
        users: Type.Optional(Type.Array(Type.String())),
        teams: Type.Optional(Type.Array(Type.String())),
        apps: Type.Optional(Type.Array(Type.String())),
      }),
      Type.Null(),
    ])
  ),
  dismissesStaleReviews: Type.Optional(Type.Boolean()),
  requiresCodeOwnerReviews: Type.Optional(Type.Boolean()),
  requiredApprovingReviewCount: Type.Optional(Type.Number()),
  canApproveOwnPullRequest: Type.Optional(Type.Boolean()),
  allowedToBypass: Type.Optional(
    Type.Union([
      Type.Object({
        users: Type.Optional(Type.Array(Type.String())),
        teams: Type.Optional(Type.Array(Type.String())),
        apps: Type.Optional(Type.Array(Type.String())),
      }),
      Type.Null(),
    ])
  ),
});

const branchProtectionRuleSchema = Type.Object({
  pattern: Type.String(),
  pullRequestReview: Type.Optional(pullRequestReviewSchema),
  requiresCommitSignatures: Type.Optional(Type.Boolean()),
  requiredStatusChecks: Type.Optional(
    Type.Union([
      Type.Null(),
      Type.Object({
        strict: Type.Optional(Type.Boolean()),
        checks: Type.Optional(
          Type.Array(
            Type.Object({
              context: Type.String(),
              app_id: Type.Optional(Type.Number()),
            })
          )
        ),
      }),
    ])
  ),
  allowedToPush: Type.Optional(
    Type.Union([
      Type.Object({
        users: Type.Optional(Type.Array(Type.String())),
        teams: Type.Optional(Type.Array(Type.String())),
        apps: Type.Optional(Type.Array(Type.String())),
      }),
      Type.Null(),
    ])
  ),
  allowForcePushes: Type.Optional(Type.Boolean()),
  allowDeletions: Type.Optional(Type.Boolean()),
  enforceAdmins: Type.Optional(Type.Boolean()),
  requiresLinearHistory: Type.Optional(Type.Boolean()),
  allowsForcePushes: Type.Optional(Type.Boolean()),
  allowsDeletions: Type.Optional(Type.Boolean()),
  restrictsPushes: Type.Optional(Type.Boolean()),
  blockCreation: Type.Optional(Type.Boolean()),
  requireConversationResolution: Type.Optional(Type.Boolean()),
});

const pullRequestSchema = Type.Object({
  allowMergeCommit: Type.Optional(Type.Boolean()),
  mergeCommitTitle: Type.Optional(
    Type.Union([Type.Literal('PR_TITLE'), Type.Literal('MERGE_MESSAGE')])
  ),
  mergeCommitBody: Type.Optional(
    Type.Union([
      Type.Literal('BLANK'),
      Type.Literal('PR_TITLE'),
      Type.Literal('PR_BODY'),
    ])
  ),
  allowRebaseMerge: Type.Optional(Type.Boolean()),
  allowSquashMerge: Type.Optional(Type.Boolean()),
  squashCommitTitle: Type.Optional(
    Type.Union([Type.Literal('COMMIT_OR_PR_TITLE'), Type.Literal('PR_TITLE')])
  ),
  squashCommitBody: Type.Optional(
    Type.Union([
      Type.Literal('BLANK'),
      Type.Literal('COMMIT_MESSAGES'),
      Type.Literal('PR_BODY'),
    ])
  ),
  deleteBranchOnMerge: Type.Optional(Type.Boolean()),
  allowAutoMerge: Type.Optional(Type.Boolean()),
});

const generalSchema = Type.Object({
  description: Type.Optional(Type.String()),
  homepage: Type.Optional(Type.String()),
  defaultBranch: Type.Optional(Type.String()),
  wikis: Type.Optional(Type.Boolean()),
  issues: Type.Optional(Type.Boolean()),
  projects: Type.Optional(Type.Boolean()),
  discussions: Type.Optional(Type.Boolean()),
  pullRequests: Type.Optional(pullRequestSchema),
  visibility: Type.Optional(
    Type.Union([
      Type.Literal('public'),
      Type.Literal('private'),
      Type.Literal('internal'),
    ])
  ),
});

const tagsSchema = Type.Object({
  protectedTags: Type.Optional(Type.Array(Type.String())),
});

const actionsSchema = Type.Object({
  actionsPermissions: Type.Optional(
    Type.Union([
      Type.Object({
        type: Type.Literal('AllowAllActionsAndReusableWorkflows'),
      }),
      Type.Object({ type: Type.Literal('DisableActions') }),
      Type.Object({
        type: Type.Literal('AllowOwnActionsAndReusableWorkflows'),
      }),
      Type.Object({
        type: Type.Literal('AllowOwnAndSelectActionsAndReusableWorkflows'),
        CreatedByGitHub: Type.Optional(Type.Boolean()),
        ByMarketPlace: Type.Optional(Type.Boolean()),
      }),
    ])
  ),
  artifactAndLogRetention: Type.Optional(Type.Number()),
  runWorkflowsFromForkPullRequests: Type.Optional(Type.Boolean()),
  workflowPermissions: Type.Optional(
    Type.Object({
      type: Type.Union([
        Type.Literal('read-write'),
        Type.Literal('read-repository-contents'),
      ]),
      allowGithubActionsToCreateAndApprovePullRequests: Type.Optional(
        Type.Boolean()
      ),
    })
  ),
});

const webhooksSchema = Type.Array(
  Type.Object({
    payloadUrl: Type.String(),
    contentType: Type.Union([
      Type.Literal('application/json'),
      Type.Literal('application/x-www-form-urlencoded'),
    ]),
    secret: Type.Optional(Type.String()),
    events: Type.Union([
      Type.Object({ type: Type.Literal('all') }),
      Type.Object({ type: Type.Literal('push') }),
      Type.Object({
        type: Type.Literal('select'),
        events: Type.Array(Type.String()),
      }),
    ]),
    active: Type.Optional(Type.Boolean()),
  })
);

const environmentsSchema = Type.Array(
  Type.Object({
    name: Type.String(),
    deploymentBranches: Type.Optional(
      Type.Array(
        Type.Union([
          Type.Object({ type: Type.Literal('all') }),
          Type.Object({ type: Type.Literal('protected') }),
          Type.Object({
            type: Type.Literal('select'),
            selectedBranches: Type.Array(Type.String()),
          }),
        ])
      )
    ),
  })
);

const pagesSchema = Type.Object({
  source: Type.Union([
    Type.Object({
      type: Type.Literal('branch'),
      branch: Type.String(),
      folder: Type.Optional(
        Type.Union([Type.Literal('/'), Type.Literal('/docs')])
      ),
    }),
    Type.Object({ type: Type.Literal('action') }),
  ]),
  customDomain: Type.Optional(Type.String()),
  enforceHttps: Type.Optional(Type.Boolean()),
});

const codeSecurityAndAnalysisSchema = Type.Object({
  dependencyGraph: Type.Optional(Type.Boolean()),
  dependabot: Type.Optional(
    Type.Object({
      alerts: Type.Optional(Type.Boolean()),
      securityUpdates: Type.Optional(Type.Boolean()),
      versionUpdates: Type.Optional(Type.Boolean()),
    })
  ),
});

const configSchema = Type.Object({
  branches: Type.Optional(Type.Array(branchProtectionRuleSchema)),
  general: Type.Optional(generalSchema),
  tags: Type.Optional(tagsSchema),
  actions: Type.Optional(actionsSchema),
  webhooks: Type.Optional(webhooksSchema),
  environments: Type.Optional(environmentsSchema),
  pages: Type.Optional(pagesSchema),
  codeSecurityAndAnalysis: Type.Optional(codeSecurityAndAnalysisSchema),
});

type Config = Static<typeof configSchema>;

export type { Config };
export { configSchema };

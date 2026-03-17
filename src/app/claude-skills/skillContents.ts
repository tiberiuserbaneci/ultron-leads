// Auto-generated from Claude Skills source files
// Maps skill-id/filename to full file content

export const skillFileContents: Record<string, string> = {
  "composio/SKILL.md": `---
name: composio
description: Build AI agent integrations with Composio (composio.dev). Use when the user wants to connect AI agents to third-party apps (GitHub, Gmail, Slack, Notion, Salesforce, etc.), set up OAuth authentication for tools, create Composio sessions, use Composio tools natively or via MCP, set up event triggers, or build multi-app agent workflows. Triggers on imports from composio or @composio or mentions of composio.
argument-hint: [description of what to build or integrate]
---

# Composio Skill

You are an expert at integrating AI agents with third-party applications using Composio — the developer-first platform that connects agents to 1000+ apps via unified SDKs and MCP.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive patterns:

- \`sdk-reference.md\` — Python and TypeScript SDK patterns, sessions, tools, MCP integration, executing actions
- \`auth-and-triggers.md\` — OAuth/API key authentication flows, connected accounts, triggers, webhooks, polling

## Setup Checklist

### Python
\`\`\`bash
pip install composio composio-claude-agent-sdk
\`\`\`

### TypeScript
\`\`\`bash
npm install composio @composio/claude-agent-sdk
\`\`\`

### Environment Variables
\`\`\`bash
COMPOSIO_API_KEY=your_composio_api_key    # from composio.dev dashboard
ANTHROPIC_API_KEY=your_anthropic_api_key  # for Claude integration
\`\`\`

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Toolkits** | Bundles of tools by service (github, gmail, slack, notion, etc.) |
| **Tools** | Discrete operations: \`GITHUB_CREATE_ISSUE\`, \`GMAIL_SEND_EMAIL\`, \`SLACK_POST_MESSAGE\` |
| **Auth Configs** | Reusable auth blueprints (OAuth2, API Key, Bearer Token) per toolkit |
| **Connected Accounts** | User-to-toolkit links created after OAuth consent or API key setup |
| **Triggers** | Event listeners: \`GITHUB_COMMIT_EVENT\`, \`SLACK_NEW_MESSAGE\`, \`GMAIL_NEW_EMAIL\` |
| **Sessions** | Isolated user contexts with access to tools (native or MCP) |
| **User ID** | Primary identifier scoping all operations to a specific user |

## Core Patterns

### Initialize Client

**Python:**
\`\`\`python
from composio import Composio

composio = Composio(api_key="your_api_key")
# Or set COMPOSIO_API_KEY env var and omit api_key
\`\`\`

**TypeScript:**
\`\`\`typescript
import { Composio } from "composio";

const composio = new Composio({ apiKey: "your_api_key" });
\`\`\`

### Create Session and Get Tools (Native)
\`\`\`python
session = composio.create(user_id="user_123", toolkits=["github", "gmail"])
tools = session.tools()
# Pass tools to your Claude agent
\`\`\`

### Create Session and Get MCP URL
\`\`\`python
session = composio.create(user_id="user_123", toolkits=["github", "slack"])
mcp_url = session.mcp.url
# Use mcp_url in MCP-compatible clients (Claude Desktop, Cursor, etc.)
\`\`\`

### Authenticate a User (OAuth2)
\`\`\`python
connection_request = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="your_auth_config_id",
    config={"auth_scheme": "OAUTH2"},
    callback_url="https://yourapp.com/callback"
)
# Redirect user to: connection_request.redirect_url
# After consent, wait for connection:
connected_account = connection_request.wait_for_connection()
\`\`\`

### Set Up a Trigger
\`\`\`python
trigger = composio.triggers.create(
    slug="GITHUB_COMMIT_EVENT",
    user_id="user_123",
    trigger_config={"owner": "repo-owner", "repo": "repo-name"},
)
\`\`\`

## Critical Rules

1. **Always scope operations by user_id** — every session, connected account, and trigger belongs to a user
2. **Only ACTIVE connected accounts can execute tools** — check status before using
3. **Use MCP mode for dynamic tool discovery** — reduces token usage vs passing all tool definitions upfront
4. **Auth configs are reusable** — create one per toolkit per environment, reuse across users
5. **Composio auto-refreshes OAuth tokens** — no manual token refresh needed
6. **Webhook triggers are real-time** — polling triggers check every ~1 minute
7. **Never hardcode API keys** — use environment variables (\`COMPOSIO_API_KEY\`)
8. **Use type-safe tool names** — e.g., \`GITHUB_CREATE_ISSUE\` not arbitrary strings
9. **Check connected account status** before executing tools: ACTIVE, INITIATED, EXPIRED, FAILED, INACTIVE
10. **Max toolkits per session vary by plan** — check Composio dashboard for limits

## Common Workflows

### Email Triage Agent
\`\`\`python
session = composio.create(user_id="user_1", toolkits=["gmail", "slack", "notion"])
tools = session.tools()
# Agent reads Gmail, classifies emails, routes to Slack channels, logs in Notion
\`\`\`

### GitHub PR Monitor
\`\`\`python
trigger = composio.triggers.create(
    slug="GITHUB_PULL_REQUEST_EVENT",
    user_id="user_1",
    trigger_config={"owner": "myorg", "repo": "myrepo"},
)
# On PR event -> agent reviews code, posts summary to Slack
\`\`\`

### Multi-App Workflow
\`\`\`python
session = composio.create(
    user_id="user_1",
    toolkits=["github", "slack", "linear", "notion"]
)
tools = session.tools()
# Agent receives Slack message -> creates Linear issue -> updates Notion -> confirms in Slack
\`\`\`

Use \`$ARGUMENTS\` to understand what the user wants to integrate. Read the reference files for detailed SDK patterns and authentication flows before writing code.
`,

  "composio/auth-and-triggers.md": `# Composio Authentication & Triggers Reference

## Authentication

Composio supports multiple auth methods per toolkit. Auth configs define how authentication works; connected accounts are the result of a user completing auth.

### Auth Methods

| Method | Description | Example Apps |
|--------|-------------|-------------|
| **OAuth2** | Full OAuth consent flow with redirect | GitHub, Gmail, Slack, Notion, Google Calendar |
| **API Key** | User provides an API key | OpenAI, Anthropic, Sendgrid |
| **Bearer Token** | User provides a bearer token | Various REST APIs |
| **Basic Auth** | Username + password | Legacy systems |

### Creating an Auth Config

Auth configs are reusable blueprints — create one per toolkit per environment.

**Via Dashboard:**
1. Go to composio.dev dashboard
2. Navigate to Auth Configs
3. Select toolkit (e.g., GitHub)
4. Enter OAuth client ID, client secret, scopes
5. Save — get an \`auth_config_id\`

**Via SDK:**
\`\`\`python
auth_config = composio.auth_configs.create(
    toolkit="github",
    auth_scheme="OAUTH2",
    config={
        "client_id": "your_oauth_client_id",
        "client_secret": "your_oauth_client_secret",
        "scopes": ["repo", "user", "read:org"]
    }
)
# auth_config.id — use this when initiating connections
\`\`\`

### Initiating User Authentication (OAuth2)

\`\`\`python
# Start OAuth flow for a user
connection_request = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_xxx",  # from auth config creation
    config={"auth_scheme": "OAUTH2"},
    callback_url="https://yourapp.com/auth/callback"
)

# Redirect user to the OAuth consent page
print(connection_request.redirect_url)  # Send user here

# Wait for the user to complete OAuth (blocking)
connected_account = connection_request.wait_for_connection()
# connected_account.id, connected_account.status
\`\`\`

### Initiating User Authentication (API Key)

\`\`\`python
connection_request = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_xxx",
    config={
        "auth_scheme": "API_KEY",
        "api_key": "user_provided_api_key"
    }
)
# No redirect needed — connection is immediately active
\`\`\`

### Connected Account Statuses

| Status | Meaning |
|--------|---------|
| \`ACTIVE\` | Ready to use, tokens valid |
| \`INITIATED\` | OAuth flow started, user hasn't completed consent |
| \`EXPIRED\` | Token expired (Composio auto-refreshes, so this is rare) |
| \`FAILED\` | Authentication failed |
| \`INACTIVE\` | Manually deactivated |

### Managing Connected Accounts

\`\`\`python
# List all active accounts for a user
accounts = composio.connected_accounts.list(
    user_ids=["user_123"],
    statuses=["ACTIVE"]
)

# Check if a user has an active connection for a toolkit
github_accounts = [a for a in accounts if a.toolkit == "github"]
has_github = len(github_accounts) > 0

# Get specific account
account = composio.connected_accounts.get(connected_account_id="ca_xxx")

# Delete (disconnect)
composio.connected_accounts.delete(connected_account_id="ca_xxx")
\`\`\`

### Token Auto-Refresh

Composio automatically refreshes OAuth tokens before they expire. You never need to manually refresh tokens. If a token refresh fails, the connected account status changes to \`EXPIRED\`.

---

## Triggers

Triggers are event listeners that push data to your application when something happens in a connected app.

### Trigger Types

| Type | Delivery | Latency | Apps |
|------|----------|---------|------|
| **Webhook** | Real-time push | Instant | GitHub, Slack, Linear |
| **Polling** | Composio checks periodically | ~1 minute | Gmail, Google Calendar |

### Common Trigger Slugs

**GitHub:**
- \`GITHUB_COMMIT_EVENT\` — New commit pushed
- \`GITHUB_PULL_REQUEST_EVENT\` — PR opened/closed/merged
- \`GITHUB_ISSUE_EVENT\` — Issue created/updated
- \`GITHUB_PUSH_EVENT\` — Code pushed to branch
- \`GITHUB_STAR_EVENT\` — Repository starred

**Slack:**
- \`SLACK_NEW_MESSAGE\` — New message in channel
- \`SLACK_REACTION_ADDED\` — Reaction added to message
- \`SLACK_CHANNEL_CREATED\` — New channel created

**Gmail:**
- \`GMAIL_NEW_EMAIL\` — New email received (polling)
- \`GMAIL_NEW_LABEL\` — Email labeled

**Linear:**
- \`LINEAR_ISSUE_CREATED\` — New issue
- \`LINEAR_ISSUE_UPDATED\` — Issue updated
- \`LINEAR_COMMENT_CREATED\` — New comment

### Creating Triggers

\`\`\`python
# Webhook trigger (GitHub)
trigger = composio.triggers.create(
    slug="GITHUB_PULL_REQUEST_EVENT",
    user_id="user_123",
    trigger_config={
        "owner": "myorg",
        "repo": "myrepo"
    }
)
# trigger.id — trigger identifier
# trigger.webhook_url — URL that receives events (for webhook triggers)

# Polling trigger (Gmail)
trigger = composio.triggers.create(
    slug="GMAIL_NEW_EMAIL",
    user_id="user_123",
    trigger_config={
        "label": "INBOX",
        "interval": 60  # check every 60 seconds
    }
)
\`\`\`

### Listening for Trigger Events

\`\`\`python
# Subscribe to trigger events
listener = composio.triggers.subscribe(
    trigger_ids=["trigger_xxx"]
)

# Process events
for event in listener:
    print(f"Event: {event.trigger_slug}")
    print(f"Data: {event.data}")
    # Route to appropriate handler
\`\`\`

### Managing Triggers

\`\`\`python
# List triggers for a user
triggers = composio.triggers.list(user_id="user_123")

# Get trigger details
trigger = composio.triggers.get(trigger_id="trigger_xxx")

# Delete a trigger
composio.triggers.delete(trigger_id="trigger_xxx")

# Pause/resume
composio.triggers.pause(trigger_id="trigger_xxx")
composio.triggers.resume(trigger_id="trigger_xxx")
\`\`\`

---

## Complete Auth + Trigger Flow Example

A full example: authenticate GitHub, set up a PR trigger, and handle events.

\`\`\`python
from composio import Composio

composio = Composio()

# 1. Initiate GitHub OAuth for user
connection = composio.connected_accounts.initiate(
    user_id="user_123",
    auth_config_id="ac_github_xxx",
    config={"auth_scheme": "OAUTH2"},
    callback_url="https://myapp.com/callback"
)
print(f"Auth URL: {connection.redirect_url}")

# 2. Wait for user to complete OAuth
account = connection.wait_for_connection()
assert account.status == "ACTIVE"

# 3. Set up PR event trigger
trigger = composio.triggers.create(
    slug="GITHUB_PULL_REQUEST_EVENT",
    user_id="user_123",
    trigger_config={"owner": "myorg", "repo": "myrepo"}
)

# 4. Create session with GitHub tools
session = composio.create(user_id="user_123", toolkits=["github", "slack"])
tools = session.tools()

# 5. Listen for events and process with agent
listener = composio.triggers.subscribe(trigger_ids=[trigger.id])
for event in listener:
    # Pass event data + tools to your Claude agent for processing
    # Agent can use GitHub tools to review PR, Slack tools to notify team
    pass
\`\`\`

## Security Best Practices

1. **Never log or expose OAuth tokens** — Composio manages tokens internally
2. **Use callback URLs with HTTPS** — Never use HTTP for OAuth callbacks
3. **Validate trigger event signatures** — Verify webhook payloads are from Composio
4. **Scope OAuth permissions narrowly** — Only request the scopes your agent needs
5. **Rotate API keys periodically** — Refresh your \`COMPOSIO_API_KEY\` on a schedule
6. **Use separate auth configs per environment** — Don't share between dev/staging/prod
`,

  "composio/sdk-reference.md": `# Composio SDK Reference

## Python SDK

### Installation
\`\`\`bash
pip install composio composio-claude-agent-sdk
\`\`\`

### Initialize Client
\`\`\`python
from composio import Composio

# Explicit API key
composio = Composio(api_key="your_api_key")

# Or via environment variable COMPOSIO_API_KEY
composio = Composio()
\`\`\`

### Sessions

Sessions are isolated user contexts that provide access to tools from connected apps.

\`\`\`python
# Create session with specific toolkits
session = composio.create(
    user_id="user_123",
    toolkits=["github", "gmail", "slack"]
)

# Get native tool definitions (for passing to agent frameworks)
tools = session.tools()

# Get MCP endpoint URL (for MCP-compatible clients)
mcp_url = session.mcp.url
\`\`\`

### Native Tools with Claude Agent SDK
\`\`\`python
from composio import Composio
from composio_claude_agent_sdk import get_tools
import anthropic

composio = Composio()
session = composio.create(user_id="user_123", toolkits=["github"])
tools = session.tools()

client = anthropic.Anthropic()
# Pass tools to Claude as tool definitions
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    max_tokens=1024,
    tools=tools,
    messages=[{"role": "user", "content": "Create a GitHub issue titled 'Bug fix needed'"}]
)
\`\`\`

### MCP Integration
\`\`\`python
session = composio.create(user_id="user_123", toolkits=["github", "slack"])

# The MCP URL can be used with:
# - Claude Desktop (add to claude_desktop_config.json)
# - Cursor
# - Any MCP-compatible client
mcp_url = session.mcp.url

# MCP includes a Tool Router for dynamic tool discovery
# Agent discovers available tools at runtime — no upfront definition needed
\`\`\`

### Execute a Specific Action
\`\`\`python
# Execute an action directly (without agent)
result = composio.actions.execute(
    action="GITHUB_CREATE_ISSUE",
    params={
        "owner": "myorg",
        "repo": "myrepo",
        "title": "New issue",
        "body": "Issue description"
    },
    user_id="user_123"
)
\`\`\`

### List Available Tools
\`\`\`python
# List all tools in a toolkit
tools = composio.tools.list(toolkit="github")
for tool in tools:
    print(f"{tool.name}: {tool.description}")

# Search for specific tools
tools = composio.tools.search("create issue")
\`\`\`

### Connected Accounts Management
\`\`\`python
# List connected accounts for a user
accounts = composio.connected_accounts.list(
    user_ids=["user_123"],
    statuses=["ACTIVE"]
)

# Get a specific connected account
account = composio.connected_accounts.get(connected_account_id="ca_xxx")

# Delete a connected account
composio.connected_accounts.delete(connected_account_id="ca_xxx")
\`\`\`

---

## TypeScript SDK

### Installation
\`\`\`bash
npm install composio @composio/claude-agent-sdk
\`\`\`

### Initialize Client
\`\`\`typescript
import { Composio } from "composio";

const composio = new Composio({ apiKey: "your_api_key" });
// Or set COMPOSIO_API_KEY env var
const composio = new Composio();
\`\`\`

### Sessions and Tools
\`\`\`typescript
// Create session
const session = await composio.create({
  userId: "user_123",
  toolkits: ["github", "gmail", "slack"]
});

// Get native tool definitions
const tools = await session.tools();

// Get MCP URL
const mcpUrl = session.mcp.url;
\`\`\`

### Execute Actions
\`\`\`typescript
const result = await composio.actions.execute({
  action: "GITHUB_CREATE_ISSUE",
  params: {
    owner: "myorg",
    repo: "myrepo",
    title: "New issue",
    body: "Description"
  },
  userId: "user_123"
});
\`\`\`

### With Claude Agent SDK
\`\`\`typescript
import { Composio } from "composio";
import Anthropic from "@anthropic-ai/sdk";

const composio = new Composio();
const session = await composio.create({
  userId: "user_123",
  toolkits: ["github"]
});
const tools = await session.tools();

const client = new Anthropic();
const response = await client.messages.create({
  model: "claude-sonnet-4-20250514",
  max_tokens: 1024,
  tools,
  messages: [{ role: "user", content: "List my GitHub repos" }]
});
\`\`\`

---

## Common Tool Names by Toolkit

### GitHub
- \`GITHUB_CREATE_ISSUE\` — Create a new issue
- \`GITHUB_GET_ISSUE\` — Get issue details
- \`GITHUB_CREATE_PULL_REQUEST\` — Create a PR
- \`GITHUB_MERGE_PULL_REQUEST\` — Merge a PR
- \`GITHUB_LIST_REPOS\` — List repositories
- \`GITHUB_STAR_REPO\` — Star a repository
- \`GITHUB_CREATE_COMMENT\` — Comment on issue/PR

### Gmail
- \`GMAIL_SEND_EMAIL\` — Send an email
- \`GMAIL_LIST_EMAILS\` — List emails
- \`GMAIL_GET_EMAIL\` — Read email details
- \`GMAIL_CREATE_DRAFT\` — Create email draft
- \`GMAIL_REPLY_TO_EMAIL\` — Reply to an email

### Slack
- \`SLACK_POST_MESSAGE\` — Post a message to a channel
- \`SLACK_LIST_CHANNELS\` — List channels
- \`SLACK_GET_CHANNEL_HISTORY\` — Read channel messages
- \`SLACK_SEND_DIRECT_MESSAGE\` — Send a DM
- \`SLACK_ADD_REACTION\` — Add emoji reaction

### Notion
- \`NOTION_CREATE_PAGE\` — Create a page
- \`NOTION_UPDATE_PAGE\` — Update a page
- \`NOTION_QUERY_DATABASE\` — Query a database
- \`NOTION_CREATE_DATABASE\` — Create a database

### Linear
- \`LINEAR_CREATE_ISSUE\` — Create an issue
- \`LINEAR_UPDATE_ISSUE\` — Update an issue
- \`LINEAR_LIST_ISSUES\` — List issues
- \`LINEAR_CREATE_COMMENT\` — Comment on issue

### Google Calendar
- \`GOOGLE_CALENDAR_CREATE_EVENT\` — Create calendar event
- \`GOOGLE_CALENDAR_LIST_EVENTS\` — List events
- \`GOOGLE_CALENDAR_UPDATE_EVENT\` — Update event
- \`GOOGLE_CALENDAR_DELETE_EVENT\` — Delete event

---

## Error Handling

\`\`\`python
from composio.exceptions import ComposioError

try:
    result = composio.actions.execute(
        action="GITHUB_CREATE_ISSUE",
        params={"owner": "org", "repo": "repo", "title": "Test"},
        user_id="user_123"
    )
except ComposioError as e:
    print(f"Composio error: {e.message}")
    # Common errors:
    # - No active connected account for the toolkit
    # - Invalid action name
    # - Missing required parameters
    # - Rate limiting from the target app
\`\`\`

## Best Practices

1. **Reuse sessions** — Don't create a new session for every request; reuse within a user's interaction
2. **Prefer MCP mode** — Reduces token usage by not sending all tool schemas upfront
3. **Scope toolkits narrowly** — Only include toolkits the agent actually needs
4. **Handle tool errors gracefully** — Third-party APIs can fail; always check results
5. **Use user_id consistently** — Same user_id across sessions maintains connected account access
`,

  "cost-reducer/SKILL.md": `---
name: cost-reducer
description: Reduce cloud, infrastructure, and operational costs while maintaining performance. Use when writing database queries, configuring cloud resources, optimizing bundles, setting up caching, choosing between services, sizing instances, configuring CDN, managing storage, or reviewing code for cost inefficiencies. Covers AWS/GCP/Vercel pricing, database optimization, serverless tuning, image pipelines, observability costs, and FinOps practices.
argument-hint: [area to optimize or review for cost]
---

# Cost Reducer

You are a cost-conscious engineer. You write code that performs well AND costs less to run. You know that the fastest way to burn money is slow queries, bloated bundles, misconfigured infrastructure, and unmonitored spend.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive patterns:

- \`code-level-savings.md\` — Bundle optimization, image pipelines, query cost reduction, N+1 prevention, caching ROI, memory leak detection
- \`cloud-and-infra.md\` — Instance right-sizing, serverless tuning, storage tiers, data transfer traps, container optimization, CI/CD costs
- \`services-and-finops.md\` — Service pricing comparisons, observability cost control, auth provider economics, FinOps practices, unit economics

## The Cost-Conscious Mindset

**Rule #1: The cheapest code is code that doesn't run.** Cache it, skip it, or make it smaller.

### Cost Impact Hierarchy (Highest to Lowest Savings)

\`\`\`
1. Architecture choices     → 10x cost difference (serverless vs always-on, managed vs self-hosted)
2. Data transfer routing    → $100-500/month (NAT gateway traps, cross-region, egress)
3. Right-sizing compute     → $50-300/month (overprovisioned instances, idle resources)
4. Database optimization    → $50-200/month (missing indexes, N+1 queries, wrong instance)
5. Caching                  → $50-200/month (reduces DB load, enables smaller instances)
6. Storage optimization     → $30-200/month (lifecycle policies, compression, tiering)
7. Bundle/image optimization→ $50-200/month per 1M users (CDN bandwidth)
8. Observability tuning     → $10-100/month (log sampling, trace sampling, retention)
\`\`\`

## Quick Wins — Do These First

### 1. Enable S3 Intelligent-Tiering
\`\`\`bash
# Zero-effort storage savings — auto-moves data to cheaper tiers
aws s3api put-bucket-intelligent-tiering-configuration \\
  --bucket my-bucket --id auto-tier \\
  --intelligent-tiering-configuration '{"Id":"auto-tier","Status":"Enabled","Tierings":[{"Days":90,"AccessTier":"ARCHIVE_ACCESS"}]}'
\`\`\`
**Saves:** 40-68% on infrequently accessed data.

### 2. Fix N+1 Queries
\`\`\`typescript
// BAD: 101 queries for 100 users — wastes DB compute
const users = await prisma.user.findMany();
for (const u of users) u.posts = await prisma.post.findMany({ where: { authorId: u.id } });

// GOOD: 2 queries total — enables smaller DB instance
const users = await prisma.user.findMany({ include: { posts: true } });
\`\`\`
**Saves:** $50-150/month by reducing DB instance size.

### 3. Convert Images to WebP/AVIF
\`\`\`typescript
import sharp from 'sharp';
await sharp('input.jpg').webp({ quality: 85 }).toFile('output.webp');  // 25-35% smaller
await sharp('input.jpg').avif({ quality: 75 }).toFile('output.avif');  // 50% smaller
\`\`\`
**Saves:** 30-50% on CDN bandwidth costs.

### 4. Add Cache for Read-Heavy Queries
\`\`\`typescript
async function getUser(id: string) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);
  const user = await db.user.findUnique({ where: { id } });
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user));
  return user;
}
\`\`\`
**Saves:** 85% reduction in DB queries → enables DB downsizing.

### 5. Replace NAT Gateway with VPC Endpoints
\`\`\`
NAT Gateway: $0.045/GB + $0.065/hour = $275+/month for 100GB
VPC Gateway Endpoint (S3): FREE
VPC Interface Endpoint: $0.01/GB = 78% cheaper
\`\`\`

### 6. Set Log Retention Policies
\`\`\`bash
aws logs put-retention-policy --log-group-name /aws/lambda/my-fn --retention-in-days 7
\`\`\`
**Saves:** 75% on CloudWatch Logs storage (30-day → 7-day).

## Cost Detection Checklist

When reviewing code or infrastructure, scan for these red flags:

| Red Flag | Cost Impact | Fix |
|----------|------------|-----|
| N+1 queries | DB compute waste | Eager loading / JOINs |
| Missing DB indexes | Slow queries → bigger instance | Add targeted indexes |
| \`import *\` or full SDK imports | Larger bundles → more bandwidth | Tree-shake, selective imports |
| Uncompressed images (JPEG/PNG) | 2-3x bandwidth cost | WebP/AVIF pipeline |
| Hardcoded large instance sizes | Overpaying for idle capacity | Right-size via metrics |
| NAT Gateway for AWS service traffic | $0.045/GB wasted | VPC Endpoints |
| No cache on read-heavy paths | DB handles every request | Redis cache-aside |
| 30-day log retention on all groups | Storage waste | 7-day for non-critical |
| High-cardinality metrics | Observability bill explosion | Aggregate, remove user IDs |
| Memory leaks | OOM restarts → cold start costs | Profile and fix leaks |
| No S3 lifecycle policies | Paying full price for old data | Intelligent-Tiering |
| Provisioned concurrency everywhere | 17x Lambda cost | Use only where SLA requires |

## Critical Rules

1. **Measure before cutting** — Use billing dashboards, Cost Explorer, or Kubecost; don't guess
2. **Optimize the biggest line item first** — $100 saved on compute beats $5 saved on logs
3. **Cache reads, queue writes** — Caching reduces DB load; queues smooth traffic spikes
4. **Right-size to actual usage** — Instance CPU < 30% average = overpaying
5. **Compress everything** — gzip responses, WebP images, minified bundles
6. **Set TTLs and lifecycle policies** — Data without expiry accumulates cost forever
7. **Use reserved/savings plans for steady state** — 40-72% discount on predictable workloads
8. **Spot instances for fault-tolerant work** — 90% discount for batch processing, CI/CD
9. **Tag everything** — Cost allocation tags enable accountability and anomaly detection
10. **Track unit economics** — Cost per request, cost per user, cost per transaction

Use \`$ARGUMENTS\` to focus on a specific cost area. Read the relevant reference file before making recommendations.
`,

  "cost-reducer/cloud-and-infra.md": `# Cloud & Infrastructure Cost Reference

## Instance Right-Sizing

### Detection
\`\`\`
If average CPU < 30% → instance is oversized
If average CPU > 70% → approaching capacity
Sweet spot: 40-60% average CPU utilization
\`\`\`

### EC2 Pricing Strategy
| Strategy | Discount | Commitment | Use For |
|----------|----------|-----------|---------|
| On-Demand | 0% | None | Variable/unpredictable load |
| Savings Plans | 40-60% | 1-3 year | Steady baseline compute |
| Reserved | 50-72% | 1-3 year | Specific instance types |
| Spot | Up to 90% | None (2-min interruption) | Batch, CI/CD, fault-tolerant |

**Hybrid approach** (40-60% total savings):
- Baseline (24/7 load): Savings Plans
- Variable load: On-Demand
- Batch/CI: Spot instances

### Kubernetes Right-Sizing
\`\`\`yaml
# Step 1: Monitor actual usage with metrics-server
kubectl top pods -n production

# Step 2: Compare requests vs actual
# If request=500m CPU but actual=80m → overprovisioned 6x

# Step 3: Right-size
resources:
  requests:
    cpu: 100m       # Match actual + 25% buffer
    memory: 128Mi
  limits:
    cpu: 200m       # 2x request for burst
    memory: 256Mi
\`\`\`
**Savings:** Right-sizing typically saves 30-70% on compute costs.

---

## Serverless Cost Optimization

### Lambda Memory Tuning

\`\`\`
Memory vs Cost (10M invocations/month):
128MB:  $21/month  — 8s avg (slow, cheap per-ms but long duration)
256MB:  $38/month  — 4.5s avg
512MB:  $75/month  — 2.2s avg (sweet spot for most workloads)
1024MB: $150/month — 1.1s avg (for CPU-bound)
2048MB: $300/month — 700ms avg (overkill for I/O-bound)
\`\`\`

**Rule:** Use AWS Lambda Power Tuning to find the cost-optimal memory. Often 512MB is cheapest overall (shorter duration offsets higher per-ms cost).

### Provisioned Concurrency — Usually Overkill
\`\`\`
On-demand invocation: $0.0000002 per request
Provisioned concurrency: $0.015/unit/hour = $10.80/month per unit

10 units = $108/month — just to keep functions warm
\`\`\`
**Only use when:** Cold start latency violates a revenue-impacting SLA.
**Alternative:** Scheduled warm-up pings (80-95% warm at 5-15% the cost).

### Lambda Best Practices
\`\`\`typescript
// Initialize OUTSIDE handler (reused across warm invocations)
const s3 = new S3Client({});
let dbPool: Pool | null = null;

export const handler = async (event: any) => {
  if (!dbPool) dbPool = new Pool({ max: 1 }); // Lazy init, reused
  const result = await dbPool.query('SELECT 1');
  return { statusCode: 200, body: JSON.stringify(result) };
};
\`\`\`

### API Gateway Cost Trap
\`\`\`
1B HTTP API requests/month:
  Requests: $900
  Execution logging: $530  ← 37% of total spend!

Fix: Disable execution logging in production
     Use HTTP APIs instead of REST APIs (71% cheaper)
\`\`\`

### Graviton (ARM) Instances
- Lambda ARM: 20% cheaper + often faster than x86
- EC2 Graviton: 20-40% better price-performance
\`\`\`yaml
# Lambda: Add architecture
Runtime: nodejs20.x
Architectures: [arm64]  # 20% cheaper
\`\`\`

---

## Data Transfer Cost Traps

### The NAT Gateway Problem
\`\`\`
NAT Gateway costs:
  Hourly: $0.065/hour = $47.45/month
  Data processing: $0.045/GB

100GB/month through NAT:
  $47.45 + (100 × $0.045) = $51.95/month

vs VPC Gateway Endpoint (S3/DynamoDB): FREE
vs VPC Interface Endpoint: $8.76/month + $0.01/GB = $9.76/month
\`\`\`

**Fix priority:**
1. S3 traffic → Gateway Endpoint (free)
2. DynamoDB traffic → Gateway Endpoint (free)
3. Other AWS services → Interface Endpoints (78% cheaper than NAT)
4. Internet traffic → Only thing that needs NAT

### Cross-Region Transfer
\`\`\`
Same region: Free (within same AZ) or $0.01/GB (cross-AZ)
Cross-region: $0.02/GB
Internet egress: $0.09/GB (first 10TB)

Rule: Keep data and compute in the same region
\`\`\`

### CloudFront vs Direct S3
\`\`\`
Direct S3 egress: $0.09/GB
CloudFront: $0.085/GB (cheaper!) + caching reduces origin fetches

3TB/month:
  Direct S3: $270
  CloudFront: $127.50 + $15 origin fetch = $142.50
  Savings: $127.50/month
\`\`\`

---

## Storage Optimization

### S3 Lifecycle Policies
\`\`\`json
{
  "Rules": [
    {
      "ID": "archive-logs",
      "Filter": { "Prefix": "logs/" },
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER" }
      ]
    },
    {
      "ID": "delete-old-builds",
      "Filter": { "Prefix": "ci-builds/" },
      "Expiration": { "Days": 30 }
    }
  ]
}
\`\`\`

### Storage Cost Comparison
| Tier | $/GB/month | Access Cost | Use For |
|------|-----------|-------------|---------|
| S3 Standard | $0.023 | Free GETs | Frequently accessed |
| S3 Infrequent | $0.0125 | $0.01/1K GETs | Monthly access |
| S3 Glacier Instant | $0.004 | $0.01/1K GETs | Quarterly access |
| S3 Glacier Deep | $0.00099 | $0.02/1K GETs + hours retrieval | Yearly/archive |

**Rule:** Enable Intelligent-Tiering on all buckets. It auto-moves data and costs nothing if data is accessed frequently.

---

## Container Optimization

### Multi-Stage Docker Builds
\`\`\`dockerfile
# Build stage (includes dev tools)
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage (minimal)
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
CMD ["node", "dist/index.js"]
\`\`\`

**Image size comparison:**
| Base Image | Size |
|-----------|------|
| node:20 (debian) | 1.1GB |
| node:20-alpine | 180MB |
| distroless/nodejs20 | 130MB |

**Cost savings per 100 deploys/month:**
- 1.1GB → 180MB = 920MB saved per pull
- 100 deploys × 920MB = 92GB less transfer
- At $0.09/GB = **$8.28/month** + faster deploys

---

## CI/CD Cost Reduction

### Build Caching
\`\`\`yaml
# GitHub Actions: Cache node_modules
- uses: actions/cache@v4
  with:
    path: node_modules
    key: \${{ runner.os }}-node-\${{ hashFiles('package-lock.json') }}

# Docker layer caching
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
\`\`\`

**Impact:** 10-minute build → 30-second build (cached) = 95% reduction in CI compute.

### Self-Hosted Runners
\`\`\`
GitHub Actions: $0.008/minute (Linux)
  100 builds/month × 10 min = 1000 min = $8/month (cheap for small teams)

At scale: 10,000 builds/month × 10 min = $800/month
Self-hosted EC2 spot: ~$15/month
Savings at scale: $785/month
\`\`\`

**Rule:** Use GitHub-hosted for small teams. Self-host at > 5000 minutes/month.

### Parallel vs Sequential
\`\`\`yaml
# Sequential: 10 + 5 + 3 = 18 minutes
jobs:
  lint: ...
  test: { needs: lint }
  build: { needs: test }

# Parallel: max(10, 5, 3) = 10 minutes (44% faster)
jobs:
  lint: ...
  test: ...        # No dependency on lint
  build: ...       # Only depends on test passing
\`\`\`

---

## Database Pricing Comparisons

### PostgreSQL (10GB, 100 QPS peak)

| Provider | Monthly Cost | Notes |
|----------|-------------|-------|
| AWS RDS db.t4g.medium | $65 | Managed, Multi-AZ extra |
| Supabase Pro | $45-50 | Includes auth, realtime, storage |
| Neon Launch | $22.50 | Scale-to-zero, cheapest for bursty |
| PlanetScale (MySQL) | $39 | Branching, serverless |

**Rule:** Neon for dev/bursty, Supabase for full-stack, RDS for enterprise/control.

### Redis

| Provider | Monthly Cost | Notes |
|----------|-------------|-------|
| ElastiCache cache.t4g.micro | $12.24 | AWS managed |
| Upstash | $0-10 | Pay-per-request, scale-to-zero |
| Redis Cloud | $7 | Managed, free tier |

**Rule:** Upstash for low-traffic/serverless. ElastiCache for predictable high-traffic.

---

## Real-World Pricing Scenario

### E-Commerce (1M Users, 1M Orders/Month)

**Before optimization:**
\`\`\`
RDS db.t4g.large:      $108/month  (N+1 queries, missing indexes)
Lambda (untuned):       $150/month  (1024MB, could be 512MB)
S3 Standard (50TB):    $1,150/month (no lifecycle policies)
NAT Gateway:            $275/month  (S3 traffic going through NAT)
CloudWatch Logs:        $50/month   (30-day retention, all levels)
Vercel bandwidth (3TB): $300/month  (unoptimized bundles/images)
TOTAL:                 $2,033/month
\`\`\`

**After optimization:**
\`\`\`
RDS db.t4g.micro + Redis: $23/month   (caching + indexes → smaller DB)
Lambda (512MB, ARM):      $38/month   (right-sized + Graviton)
S3 Intelligent-Tiering:  $628/month   (auto-tiered)
VPC Endpoints:            $10/month   (replaced NAT for S3)
CloudWatch Logs:          $12/month   (7-day retention, sampling)
Vercel bandwidth (1.5TB): $75/month   (WebP + tree-shaking)
TOTAL:                   $786/month

SAVINGS: $1,247/month = $14,964/year (61% reduction)
\`\`\`
`,

  "cost-reducer/code-level-savings.md": `# Code-Level Cost Savings Reference

## Bundle Size Optimization

### Impact on Cost
- Vercel: $0.15/GB after 1TB included
- 1M users × 3MB page = 3TB = **$300/month in bandwidth**
- 35% bundle reduction → **$105/month saved**

### Tree-Shaking
\`\`\`javascript
// BAD: Imports entire library (can't tree-shake)
import * as lodash from 'lodash';       // 70KB+
import { everything } from 'aws-sdk';    // 50MB+

// GOOD: Named imports (tree-shakeable)
import { debounce } from 'lodash-es';    // 1KB
import { S3Client } from '@aws-sdk/client-s3'; // 30KB
\`\`\`

### Dynamic Imports (Code Splitting)
\`\`\`typescript
// BAD: Heavy component loaded on every page
import HeavyChart from './HeavyChart';

// GOOD: Loaded only when needed
const HeavyChart = lazy(() => import('./HeavyChart'));

// Next.js dynamic import
const AdminPanel = dynamic(() => import('./AdminPanel'), {
  loading: () => <Skeleton />,
  ssr: false  // Skip server rendering for client-only components
});
\`\`\`

### Bundle Analysis
\`\`\`bash
# Analyze what's in your bundle
npx webpack-bundle-analyzer dist/stats.json

# Next.js built-in
ANALYZE=true next build

# Vite
npx vite-bundle-visualizer
\`\`\`

**Common bloat sources:**
| Library | Typical Size | Lightweight Alternative |
|---------|-------------|----------------------|
| moment.js | 70KB | date-fns (tree-shakeable) or dayjs (2KB) |
| lodash | 70KB | lodash-es (tree-shakeable) or native JS |
| aws-sdk v2 | 50MB+ | @aws-sdk/client-* v3 (modular) |
| chart.js | 200KB | Load dynamically, only on chart pages |

---

## Image Optimization Pipeline

### Format Savings
| Format | vs JPEG | Browser Support |
|--------|---------|----------------|
| WebP | 25-35% smaller | 97% |
| AVIF | 50% smaller | 93% |

### Server-Side Pipeline (Sharp)
\`\`\`typescript
import sharp from 'sharp';

async function optimizeForWeb(input: Buffer, filename: string) {
  const sizes = [640, 1280, 1920];
  const results = [];

  for (const width of sizes) {
    // WebP (primary)
    await sharp(input).resize(width).webp({ quality: 85 })
      .toFile(\`public/img/\${filename}-\${width}w.webp\`);

    // AVIF (modern browsers)
    await sharp(input).resize(width).avif({ quality: 75 })
      .toFile(\`public/img/\${filename}-\${width}w.avif\`);

    // JPEG fallback
    await sharp(input).resize(width).jpeg({ quality: 80, mozjpeg: true })
      .toFile(\`public/img/\${filename}-\${width}w.jpg\`);
  }
}
\`\`\`

### Responsive HTML
\`\`\`html
<picture>
  <source srcset="/img/hero-640w.avif 640w, /img/hero-1280w.avif 1280w" type="image/avif" />
  <source srcset="/img/hero-640w.webp 640w, /img/hero-1280w.webp 1280w" type="image/webp" />
  <img src="/img/hero-1280w.jpg" alt="Hero" loading="lazy" decoding="async" />
</picture>
\`\`\`

### Next.js Image (Automatic Optimization)
\`\`\`javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400 * 365,  // Cache 1 year
    deviceSizes: [640, 828, 1200, 1920],
  }
};
\`\`\`

**Cost impact:** 1M image requests/month × 500KB avg → 500GB bandwidth.
With WebP: 325GB → **saves $26/month** at $0.15/GB.

---

## Database Query Cost

### Expensive Query Detection
\`\`\`sql
-- Find queries that cost the most total time
SELECT query, calls, total_exec_time / 1000 AS total_sec, mean_exec_time AS avg_ms
FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 10;

-- Find sequential scans on large tables (missing indexes)
SELECT schemaname, relname, seq_scan, seq_tup_read,
       idx_scan, idx_tup_fetch
FROM pg_stat_user_tables
WHERE seq_scan > 100 AND seq_tup_read > 10000
ORDER BY seq_tup_read DESC;
\`\`\`

### Index Cost of Queries
\`\`\`sql
-- Before: Sequential scan, costs 1000 units, 150ms
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 123 AND status = 'active';
-- Seq Scan on orders  (cost=0.00..1000.00 rows=5000)
-- Execution Time: 156.234 ms

-- After: Add targeted index
CREATE INDEX idx_orders_customer_status ON orders(customer_id, status);

-- Now: Index scan, costs 0.4 units, 3ms (50x faster)
-- Index Scan using idx_orders_customer_status  (cost=0.00..0.40 rows=5)
-- Execution Time: 3.234 ms
\`\`\`

**Cost translation:** Reducing avg query time from 150ms to 3ms means the same DB instance handles 50x more queries → downsize from db.t4g.large ($108/month) to db.t4g.micro ($10.80/month). **Saves $97/month.**

### N+1 Query Prevention
\`\`\`typescript
// Prisma — use include (2 queries instead of N+1)
const users = await prisma.user.findMany({
  include: { posts: true, orders: { select: { id: true, total: true } } }
});

// GraphQL — use DataLoader (batches within request)
const userLoader = new DataLoader(async (ids) => {
  const users = await db.user.findMany({ where: { id: { in: ids } } });
  return ids.map(id => users.find(u => u.id === id));
});
\`\`\`

### Materialized Views (Precompute Expensive Aggregations)
\`\`\`sql
CREATE MATERIALIZED VIEW order_stats AS
SELECT customer_id, COUNT(*) as orders, SUM(total) as revenue
FROM orders GROUP BY customer_id;

-- Refresh periodically (not on every write)
REFRESH MATERIALIZED VIEW CONCURRENTLY order_stats;

-- Saves: Eliminates expensive GROUP BY on every dashboard load
\`\`\`

---

## Caching ROI

### When Caching Pays Off

\`\`\`
Cache saves money when:
  (DB queries avoided × cost per query) > (Redis instance cost)

Example:
  10M requests/month, 85% cache hit → 8.5M queries avoided
  DB instance saved: db.t4g.large → db.t4g.micro = $97/month saved
  Redis cost: cache.t4g.micro = $12.24/month
  NET SAVINGS: $84.76/month
\`\`\`

### When Caching Costs More Than It Saves
- Cache hit ratio < 50% (too many misses)
- Write-heavy workload (constant cache invalidation)
- Working set too large for cache instance
- TTL < 10 seconds (almost every request misses)

### Cache TTL Guidelines

| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| Feature flags | 30-60s | Fast propagation needed |
| User profile | 5-15 min | Infrequent changes |
| Product catalog | 1-24 hours | Batch updates |
| Static config | 1 hour | Rarely changes |
| CDN static assets | 1 year | Versioned URLs (hash-based) |

---

## Memory Leak Detection

**Real case:** 4 lines of code caused **$12,000/month** in AWS costs from OOM restarts.

### Common Leak Patterns
\`\`\`javascript
// LEAK: Event listeners never cleaned up
class UserService {
  constructor() {
    eventBus.on('userUpdate', this.handleUpdate);  // Never removed!
  }
  // Fix: Remove listener in destroy/cleanup
  destroy() { eventBus.off('userUpdate', this.handleUpdate); }
}

// LEAK: Closures holding large objects
function processData(hugeArray) {
  return function getStats() {
    return hugeArray.length;  // Holds entire array in memory forever
  };
}
// Fix: Extract only what you need
function processData(hugeArray) {
  const length = hugeArray.length;
  return function getStats() { return length; };
}

// LEAK: Growing collections without bounds
const cache = new Map();
function cacheResult(key, value) {
  cache.set(key, value);  // Never evicted!
}
// Fix: Use LRU cache with max size
import { LRUCache } from 'lru-cache';
const cache = new LRUCache({ max: 1000 });
\`\`\`

### Detection
\`\`\`bash
# Node.js heap snapshot
node --inspect app.js
# Open chrome://inspect → Take heap snapshot → Compare two snapshots

# In code: Monitor heap usage
setInterval(() => {
  const { heapUsed, heapTotal } = process.memoryUsage();
  if (heapUsed / heapTotal > 0.85) {
    console.warn(\`Memory pressure: \${(heapUsed / 1024 / 1024).toFixed(0)}MB used\`);
  }
}, 30000);
\`\`\`

**Cost impact:** Memory leaks cause OOM restarts → cold start overhead → 20-40% higher cloud bills.

---

## Compression

### Response Compression
\`\`\`typescript
import compression from 'compression';
app.use(compression({ threshold: 1024, level: 6 }));
// Reduces JSON responses by 70-90%
// 100KB response → 10-30KB
\`\`\`

### Before Storage
\`\`\`typescript
import zlib from 'zlib';

// Compress before S3 upload
const compressed = zlib.gzipSync(JSON.stringify(data));
await s3.putObject({
  Bucket: 'my-bucket', Key: 'data.json.gz',
  Body: compressed, ContentEncoding: 'gzip'
}).promise();
// JSON logs compress 80-90% → massive S3 savings
\`\`\`

### Static Asset Compression
\`\`\`javascript
// Vite/webpack: Generate .br and .gz files at build time
// vite.config.ts
import viteCompression from 'vite-plugin-compression';
export default {
  plugins: [
    viteCompression({ algorithm: 'brotliCompress' }), // Brotli: 20% better than gzip
    viteCompression({ algorithm: 'gzip' }),
  ]
};
\`\`\`
`,

  "cost-reducer/services-and-finops.md": `# Services & FinOps Reference

## Observability Cost Control

### The Problem
- Traces: 60-70% of observability costs
- Logs: 20-30% of observability costs
- Total market: $34.1B in 2026 — most of it wasted

### Platform Pricing (Monthly, Mid-Size Team)
| Platform | Cost | Pricing Model |
|----------|------|---------------|
| Datadog | $8,000+ | Per host + per GB + per metric (complex) |
| New Relic | $1,000-2,000 | Per user + per GB ingested |
| Grafana Cloud | $1,500 | Per signal volume + per user |
| Self-hosted Grafana + Prometheus | $200-500 | Infrastructure only |

### Log Sampling (Immediate Savings)
\`\`\`typescript
import pino from 'pino';

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
});

// Sample INFO-level logs in production
const SAMPLE_RATE = 0.1; // Log 10% of info events
function infoSampled(msg: string, data?: object) {
  if (Math.random() < SAMPLE_RATE) logger.info(data, msg);
}

// Always log errors and warnings (no sampling)
logger.error({ err, traceId }, 'Payment failed');
logger.warn({ userId }, 'Rate limit approaching');

// Sample info-level
infoSampled('Request completed', { path: req.path, duration: ms });
\`\`\`
**Saves:** 90% log volume reduction while keeping all errors.

### Trace Sampling
\`\`\`typescript
// Tail sampling: Keep 100% of errors + slow requests, sample the rest
const tracer = require('dd-trace').init({
  sampleRate: 0.1,  // Send 10% of normal traces
  // But always send error traces (configured in Datadog agent)
});
\`\`\`
**Saves:** 70-80% on trace costs while keeping all interesting traces.

### High-Cardinality Metric Pitfalls
\`\`\`typescript
// BAD: Creates millions of time series ($$$$)
counter.inc({ user_id: userId, request_id: requestId });

// GOOD: Aggregate by meaningful dimensions only
counter.inc({ endpoint: '/api/users', method: 'GET', status: '200' });
\`\`\`
**Rule:** Never put user IDs, request IDs, timestamps, or UUIDs in metric labels.

### Retention Policies
| Log Type | Retention | Rationale |
|----------|----------|-----------|
| Application errors | 90 days | Debugging, postmortems |
| Access logs | 30 days | Security review period |
| Debug logs | 7 days | Short-term troubleshooting |
| Health check logs | 1 day | Almost never needed |
| CI/CD logs | 14 days | Build debugging |

---

## Auth Provider Economics

### Pricing Comparison (2026)

| Provider | Free Tier | Paid | SAML SSO |
|----------|----------|------|----------|
| Clerk | 10K MAUs | $0.02/MAU | $99/month |
| Auth0 | 7.5K MAUs | $240/month (3K MAUs) | $1,500/month |
| Supabase Auth | 50K MAUs | Included in Pro ($25) | Included |
| Keycloak | Unlimited | Free (self-host) | Free |
| Firebase Auth | 50K MAUs | Free (phone auth costs) | Not available |

### Cost at Scale
\`\`\`
10,000 MAUs:
  Clerk: Free
  Auth0: $240/month
  Supabase: $25/month (included in Pro)
  Firebase: Free

100,000 MAUs:
  Clerk: $1,800/month (90K × $0.02)
  Auth0: $1,500+/month (Enterprise tier required)
  Supabase: $25/month (still included!)
  Firebase: Free (but limited features)

1,000,000 MAUs:
  Clerk: $19,800/month
  Auth0: Custom pricing ($$$$)
  Supabase: $25/month (yes, really)
  Self-hosted Keycloak: $50-200/month (infrastructure only)
\`\`\`

**Rule:** Supabase Auth is cheapest at scale if you use Supabase. Self-hosted Keycloak for maximum control. Clerk for best DX at moderate scale.

---

## Search Service Costs

### Pricing (250K Records, 1M Searches/Month)
| Service | Monthly Cost | Self-Hostable |
|---------|-------------|---------------|
| Algolia | $500+ | No |
| Meilisearch Cloud | $59 | Yes (free) |
| Typesense Cloud | $60 | Yes (free) |
| Elasticsearch (AWS) | $200+ | Yes |
| Self-hosted Meilisearch | $15-30 (server) | Yes |

**Rule:** Start with Meilisearch (free self-hosted or $59 cloud). Only use Algolia if you need their specific features (AI recommendations, crawling).

---

## Email Service Costs

### Pricing (100K Emails/Month)
| Service | Cost | Notes |
|---------|------|-------|
| AWS SES | $10 | Cheapest, requires setup |
| Resend | $20 | Great DX, React Email |
| Postmark | $50 | Best deliverability |
| SendGrid | $20-50 | Established, complex pricing |

**Rule:** AWS SES for cost-sensitive. Resend for developer experience. Postmark for transactional email deliverability.

---

## FinOps Practices

### Cost Allocation Tags (Foundation)
\`\`\`bash
# Tag ALL resources — untagged = unaccountable
aws ec2 create-tags --resources i-1234567890 --tags \\
  Key=Environment,Value=production \\
  Key=Team,Value=backend \\
  Key=CostCenter,Value=engineering \\
  Key=Service,Value=api-server
\`\`\`

**Required tags:**
| Tag | Purpose | Example |
|-----|---------|---------|
| Environment | Filter prod vs dev costs | production, staging, dev |
| Team | Accountability | backend, frontend, data |
| Service | Granular attribution | api-server, worker, cron |
| CostCenter | Finance allocation | engineering, marketing |

### Budget Alerts
\`\`\`bash
# AWS Budget with alert at 80% and 100%
aws budgets create-budget --account-id 123456789 --budget '{
  "BudgetName": "Monthly-Total",
  "BudgetLimit": { "Amount": "2000", "Unit": "USD" },
  "TimeUnit": "MONTHLY",
  "BudgetType": "COST"
}' --notifications-with-subscribers '[
  {
    "Notification": {
      "NotificationType": "ACTUAL",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80
    },
    "Subscribers": [{ "SubscriptionType": "EMAIL", "Address": "team@company.com" }]
  }
]'
\`\`\`

### Unit Economics Tracking
\`\`\`typescript
// Track cost per business metric
const metrics = {
  totalMonthlyCost: 2033,          // From AWS Cost Explorer
  monthlyActiveUsers: 50000,
  monthlyOrders: 100000,
  monthlyApiRequests: 10_000_000,
};

const unitEconomics = {
  costPerUser: metrics.totalMonthlyCost / metrics.monthlyActiveUsers,        // $0.041
  costPerOrder: metrics.totalMonthlyCost / metrics.monthlyOrders,            // $0.020
  costPerRequest: metrics.totalMonthlyCost / metrics.monthlyApiRequests,     // $0.0002
  costPerThousandRequests: (metrics.totalMonthlyCost / metrics.monthlyApiRequests) * 1000, // $0.20
};

// Alert if unit cost increases >20%
if (unitEconomics.costPerUser > previousMonth.costPerUser * 1.2) {
  alert('Cost per user increased >20% — investigate');
}
\`\`\`

### Monthly Cost Review Checklist
- [ ] Review Cost Explorer for top 5 cost increases
- [ ] Check for untagged resources
- [ ] Identify idle/unused resources (0% CPU, no traffic)
- [ ] Review reserved capacity utilization (unused RIs = waste)
- [ ] Check for cost anomalies (unexpected spikes)
- [ ] Compare unit economics to previous month
- [ ] Review spot instance interruption rate (if using spot)
- [ ] Check data transfer costs by service

---

## Managed vs Self-Hosted Decision

### When Managed is Cheaper
- Team < 5 engineers (engineering time is expensive)
- Usage is low-moderate (managed pricing beats server costs)
- Need compliance/certifications (managed handles this)
- Ops expertise is limited

### When Self-Hosted is Cheaper
- Scale exceeds managed plan limits (1M+ MAUs for auth, 1M+ searches)
- You have ops/DevOps capability
- Data sovereignty requirements
- Predictable, stable workload

### Cost Crossover Points (Approximate)
\`\`\`
Auth: Self-host at ~200K MAUs (Keycloak replaces $2K+/month Clerk/Auth0)
Search: Self-host at ~500K records (Meilisearch replaces $500+/month Algolia)
Database: Self-host at ~$500/month managed bill (but factor in ops time)
Redis: Self-host at ~$100/month managed bill
Email: Almost never self-host (SES at $0.10/1K is hard to beat)
\`\`\`

---

## Cost Optimization Priority Matrix

| Action | Effort | Monthly Savings | Do First? |
|--------|--------|----------------|-----------|
| S3 Intelligent-Tiering | 5 min | $30-200 | Yes |
| Log retention policies | 10 min | $10-50 | Yes |
| Fix N+1 queries | 1-2 hours | $50-150 | Yes |
| WebP/AVIF images | 2-4 hours | $50-200 | Yes |
| VPC Endpoints | 1 hour | $50-300 | Yes |
| Lambda memory tuning | 1-2 hours | $20-100 | Yes |
| Bundle tree-shaking | 2-4 hours | $50-200 | Yes |
| Redis caching layer | 1-2 days | $50-300 | If read-heavy |
| Container right-sizing | 2-4 hours | $30-200 | If K8s |
| Reserved/Savings Plans | 1 hour | $200-1000 | If stable workload |
| Self-host auth/search | 1-2 weeks | $100-500 | At scale only |
| Trace sampling | 1 hour | $50-500 | If using Datadog/NR |
`,

  "create-skill/SKILL.md": `---
name: create-skill
description: Create high-quality Claude Code custom skills and slash commands. Use when the user wants to create a new skill, build a custom command, make a slash command, or add a reusable workflow.
argument-hint: [description of the skill to create]
---

# Skill Creation Guide

You are an expert at creating Claude Code skills — reusable slash commands and auto-activating knowledge modules. Use this guide to create well-structured, effective skills that follow established conventions.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive details:

- \`reference.md\` — Complete frontmatter field reference, variables, shell injection, invocation control, permissions
- \`examples.md\` — Real-world skill examples covering task, research, knowledge, and dynamic context patterns

## Skill Creation Workflow

### Step 1: Clarify Purpose and Type

Before writing anything, determine the skill type:

| Type | Purpose | Example |
|------|---------|---------|
| **Task** | Performs actions with side effects | deploy, commit, publish |
| **Research** | Gathers and synthesizes information | deep-research, audit |
| **Knowledge** | Provides reference context | api-conventions, style-guide |
| **Dynamic** | Injects live context via shell commands | pr-summary, env-check |

Ask the user if their intent is unclear. A skill that "deploys to production" is a Task. A skill that "explains our API patterns" is Knowledge.

### Step 2: Determine Scope

| Scope | Path | When to use |
|-------|------|-------------|
| **Personal** | \`~/.claude/skills/<name>/\` | Workflows that apply across all your projects |
| **Project** | \`.claude/skills/<name>/\` | Project-specific conventions shared with the team |

Default to **project scope** unless the user explicitly wants it personal or the skill is clearly project-agnostic.

### Step 3: Choose Frontmatter Settings

Use this decision matrix:

**\`name\`** (required): Lowercase kebab-case. This becomes the \`/slash-command\` name.

**\`description\`** (required): Write a clear, action-oriented description. This is what Claude uses to decide whether to auto-activate the skill. Include trigger phrases the user might say.
- Good: "Build Trigger.dev background jobs, automations, and workflows in TypeScript. Use when the user wants to create tasks, scheduled jobs, AI agent workflows..."
- Bad: "Trigger.dev helper"

**\`argument-hint\`** (optional): Shown in autocomplete. Use square brackets: \`[description of what to build]\`

**Invocation control fields** — use only when needed:
- \`user-invocable: false\` — Skill is auto-activate only, no slash command. Use for pure knowledge/context skills.
- \`auto-activate: false\` — Slash command only, never auto-activates. Use for dangerous/destructive operations like deploy or delete.
- \`allowed-tools\` — Restrict which tools the skill can use. Use for safety-critical skills.
- \`disallowed-tools\` — Block specific tools. Use to prevent a skill from editing files when it should only read.

Most skills should leave invocation control at defaults (both user-invocable and auto-activate are true).

### Step 4: Write the SKILL.md

Follow this structure:

\`\`\`markdown
---
name: skill-name
description: Clear description with trigger phrases...
argument-hint: [what the user provides]
---

# Title

Role statement — one sentence establishing expertise.

Reference supporting files (if any):
Read the detailed reference in \`\${CLAUDE_SKILL_DIR}\` for...

## Core Instructions
The main guidance. Be specific and actionable.

## Critical Rules
Numbered list of non-negotiable rules (max 10-12).

## Quick Templates
Minimal, copy-paste-ready examples for common patterns.

## Final Note
How to use \`$ARGUMENTS\` and any closing guidance.
\`\`\`

### Step 5: Add Supporting Files (If Needed)

Use separate \`.md\` files in the skill directory for:
- Detailed API references too long for SKILL.md
- Multiple code examples that would bloat the main file
- Content that only needs to be read on-demand (not every invocation)

Reference them from SKILL.md using \`\${CLAUDE_SKILL_DIR}\`:
\`\`\`markdown
Read \`\${CLAUDE_SKILL_DIR}/reference.md\` for the complete API reference.
\`\`\`

Claude will read these lazily — only when the skill is activated and the instructions tell it to.

**Do NOT use supporting files for:**
- Content under ~50 lines (just put it in SKILL.md)
- Content needed on every invocation (put it in SKILL.md)

## Critical Rules

1. **SKILL.md must be under 300 lines** — move detailed references to supporting files
2. **Use kebab-case for skill names** — \`my-skill\` not \`mySkill\` or \`my_skill\`
3. **Directory name must match the \`name\` field** — \`skills/deploy/SKILL.md\` with \`name: deploy\`
4. **Description must include trigger phrases** — Claude uses this for auto-activation matching
5. **Always reference supporting files via \`\${CLAUDE_SKILL_DIR}\`** — never hardcode paths
6. **Use \`$ARGUMENTS\` for user input** — this contains everything after the slash command
7. **Keep templates minimal** — show the pattern, not a complete application
8. **Don't over-constrain with allowed-tools** — only restrict when there's a real safety concern
9. **One skill per concern** — don't bundle unrelated functionality into one skill
10. **Test the description** — mentally check: "If I said [trigger phrase], would Claude pick this skill?"

## Anti-Patterns to Avoid

- **Giant monolith SKILL.md** — If it's over 300 lines, split into supporting files
- **Vague descriptions** — "Helps with stuff" won't auto-activate reliably
- **Hardcoded paths** — Use \`\${CLAUDE_SKILL_DIR}\` for supporting files
- **Over-engineering frontmatter** — Most skills only need name + description
- **Duplicating built-in behavior** — Don't create a skill for things Claude already does well
- **Forgetting the argument-hint** — Users won't know what to type after the slash command

## Quick Templates

### Minimal Task Skill
\`\`\`markdown
---
name: deploy
description: Deploy the application to production. Use when the user wants to deploy, ship, or push to prod.
argument-hint: [environment or options]
auto-activate: false
---

# Deploy Skill

You are an expert at deploying this application safely.

## Process
1. Run pre-deploy checks
2. Build the application
3. Deploy to the target environment
4. Verify the deployment

## Critical Rules
1. Always run tests before deploying
2. Never deploy with uncommitted changes
3. Confirm with the user before deploying to production

Use \`$ARGUMENTS\` to determine the target environment. Default to staging if not specified.
\`\`\`

### Minimal Knowledge Skill
\`\`\`markdown
---
name: api-conventions
description: API design conventions and patterns for this project. Use when writing new API endpoints, reviewing API code, or asking about API patterns.
user-invocable: false
---

# API Conventions

## URL Structure
- Use plural nouns: \`/users\`, \`/orders\`
- Nest for relationships: \`/users/:id/orders\`

## Response Format
Always return \`{ data, error, meta }\` envelope.

## Error Handling
Use standard HTTP status codes. Include error codes for client handling.
\`\`\`

See \`\${CLAUDE_SKILL_DIR}/examples.md\` for a dynamic context skill example using shell injection.

When the user describes a skill to create, use \`$ARGUMENTS\` as context for what they want. Follow this guide to build the complete skill: SKILL.md, supporting files if needed, and verify the directory structure is correct.
`,

  "create-skill/examples.md": `# Skill Examples

Real-world examples covering the major skill patterns. Use these as inspiration when creating new skills.

## 1. Task Skill with Side Effects — Deploy

A skill that performs actions. Uses \`auto-activate: false\` since deployment should be explicit.

\`\`\`markdown
---
name: deploy
description: Deploy the application to production or staging environments. Use when the user wants to deploy, ship, release, or push to production.
argument-hint: [environment: staging|production]
auto-activate: false
---

# Deploy Skill

You are an expert at safely deploying this application. Follow the deployment checklist precisely.

## Pre-Deploy Checklist
1. Verify no uncommitted changes: \`git status --porcelain\`
2. Ensure all tests pass: \`npm test\`
3. Check the target environment from \`$ARGUMENTS\` (default: staging)
4. Build the application: \`npm run build\`

## Deploy Process

### Staging
\`\`\`bash
npx vercel deploy --env preview
\`\`\`

### Production
**Always confirm with the user before deploying to production.**
\`\`\`bash
npx vercel deploy --prod
\`\`\`

## Post-Deploy
1. Run smoke tests against the deployed URL
2. Check application logs for errors
3. Report the deployment URL to the user

## Critical Rules
1. Never deploy with uncommitted changes
2. Never deploy to production without explicit user confirmation
3. Always run tests before deploying
4. Always report the final deployment URL
\`\`\`

**Directory structure:**
\`\`\`
skills/deploy/
└── SKILL.md
\`\`\`

---

## 2. Research Skill with Subagents — Deep Research

A skill that gathers information using Agent tool for parallel research.

\`\`\`markdown
---
name: deep-research
description: Perform deep research on a topic using web search and analysis. Use when the user wants thorough research, a literature review, competitive analysis, or in-depth investigation of a topic.
argument-hint: [topic or question to research]
---

# Deep Research Skill

You are an expert researcher. Conduct thorough, multi-source research on the given topic.

## Research Process

1. **Parse the query**: Break \`$ARGUMENTS\` into 3-5 specific research questions
2. **Parallel research**: Launch Agent subagents to research each question simultaneously
3. **Synthesize**: Combine findings into a structured report
4. **Cite sources**: Include URLs for all claims

## Execution

For each research question, launch an Agent with subagent_type "general-purpose":
- Give each agent a specific, focused research question
- Have agents use WebSearch and WebFetch to gather information
- Run all agents in parallel for speed

## Output Format

Deliver a structured report:
- **Executive Summary** (2-3 sentences)
- **Key Findings** (bulleted, with source URLs)
- **Detailed Analysis** (organized by research question)
- **Open Questions** (what couldn't be answered)

## Critical Rules
1. Always launch agents in parallel, not sequentially
2. Minimum 3 different sources per major claim
3. Distinguish facts from opinions in the report
4. Include publication dates for time-sensitive information
\`\`\`

---

## 3. Dynamic Context Skill — PR Summary

A skill that uses shell injection to provide live project context.

\`\`\`markdown
---
name: pr-summary
description: Summarize the current PR or branch changes. Use when the user wants a PR overview, change summary, or review preparation.
---

# PR Summary

## Current State

Branch: !\`git branch --show-current\`
Base comparison: !\`git merge-base HEAD main\`

### Changed files
!\`git diff main --name-only\`

### Diff statistics
!\`git diff main --stat\`

### Recent commits on this branch
!\`git log main..HEAD --oneline\`

## Instructions

Analyze the changes above and produce:

1. **Summary**: One paragraph explaining what this PR does and why
2. **Changes by area**: Group changed files by feature/component
3. **Risk assessment**: Flag any high-risk changes (DB migrations, auth, payments, config)
4. **Review notes**: Specific things a reviewer should pay attention to
5. **Testing suggestions**: What should be tested manually

If \`$ARGUMENTS\` contains additional context (like a PR number), incorporate it.
\`\`\`

---

## 4. Knowledge/Reference Skill — API Conventions

A pure knowledge skill that auto-activates when relevant. No slash command needed.

\`\`\`markdown
---
name: api-conventions
description: API design conventions and patterns for this project. Use when writing new API endpoints, controllers, routes, or reviewing API code. Covers REST conventions, error handling, authentication, and response formats.
user-invocable: false
---

# API Conventions

## URL Structure
- Plural nouns for resources: \`/users\`, \`/orders\`, \`/products\`
- Nest for direct relationships: \`/users/:id/orders\`
- Max 2 levels of nesting: \`/users/:id/orders\` not \`/users/:id/orders/:oid/items/:iid\`
- Use query params for filtering: \`/orders?status=pending&limit=10\`

## HTTP Methods
- \`GET\` — Read (never mutates)
- \`POST\` — Create new resource
- \`PUT\` — Full replacement of resource
- \`PATCH\` — Partial update
- \`DELETE\` — Remove resource

## Response Envelope

All responses use this format:
\`\`\`json
{
  "data": {},
  "error": null,
  "meta": { "page": 1, "total": 42 }
}
\`\`\`

## Error Format
\`\`\`json
{
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "field": "email", "issue": "invalid format" }]
  }
}
\`\`\`

## Status Codes
- \`200\` — Success
- \`201\` — Created
- \`400\` — Validation error
- \`401\` — Not authenticated
- \`403\` — Not authorized
- \`404\` — Not found
- \`409\` — Conflict
- \`500\` — Server error

## Authentication
All endpoints require \`Authorization: Bearer <token>\` except those under \`/public/\`.
\`\`\`

---

## 5. Skill with Bundled Scripts

A skill that includes executable scripts in its directory.

\`\`\`markdown
---
name: db-migrate
description: Create and run database migrations safely. Use when the user wants to create a migration, run migrations, or check migration status.
argument-hint: [migration name or action: create|run|status]
auto-activate: false
---

# Database Migration Skill

You are an expert at managing database migrations safely.

## Available Actions

Parse \`$ARGUMENTS\` to determine the action:

- **create [name]**: Generate a new migration file
- **run**: Apply pending migrations
- **status**: Show migration status
- **rollback**: Revert the last migration

## Migration Template

Use the template at \`\${CLAUDE_SKILL_DIR}/scripts/migration-template.sql\` when creating new migrations.

## Safety Checks

Before running any migration:
1. Run \`\${CLAUDE_SKILL_DIR}/scripts/check-pending.sh\` to verify pending migrations
2. Ensure the database is backed up for production
3. Always run on staging first

## Critical Rules
1. Never run migrations on production without explicit user confirmation
2. Every migration must have a rollback
3. Never modify an already-applied migration — create a new one
4. Test migrations on a fresh database before applying
\`\`\`

**Directory structure:**
\`\`\`
skills/db-migrate/
├── SKILL.md
└── scripts/
    ├── check-pending.sh
    └── migration-template.sql
\`\`\`

---

## 6. Skill with Supporting Reference Files

A skill that splits content across multiple files to stay under the SKILL.md size limit. Follows the same pattern as the trigger-dev skill.

\`\`\`markdown
---
name: terraform
description: Write and manage Terraform infrastructure code. Use when the user wants to create infrastructure, add cloud resources, write Terraform modules, or manage infrastructure as code.
argument-hint: [infrastructure to create or modify]
---

# Terraform Skill

You are an expert at writing production-grade Terraform infrastructure code.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive details:

- \`reference-resources.md\` — AWS/GCP/Azure resource patterns, naming conventions, tagging
- \`reference-modules.md\` — Module structure, inputs/outputs, composition patterns
- \`reference-state.md\` — State management, backends, workspaces, import

## Critical Rules

1. Always use variables for environment-specific values
2. Tag all resources with \`environment\`, \`team\`, and \`managed-by\`
3. Use modules for any resource group used more than once
4. Never hardcode credentials — use IAM roles or secret references
5. Always include \`terraform.tfvars.example\` with placeholder values
6. Use \`terraform fmt\` and \`terraform validate\` before committing
7. Pin provider versions in \`versions.tf\`

## Quick Patterns

### Basic Resource
\`\`\`hcl
resource "aws_s3_bucket" "data" {
  bucket = "\${var.project}-\${var.environment}-data"
  tags   = local.common_tags
}
\`\`\`

### Module Usage
\`\`\`hcl
module "vpc" {
  source      = "./modules/vpc"
  environment = var.environment
  cidr_block  = var.vpc_cidr
}
\`\`\`

Use \`$ARGUMENTS\` to understand what infrastructure the user wants. Build complete, production-ready Terraform code.
\`\`\`

**Directory structure:**
\`\`\`
skills/terraform/
├── SKILL.md
├── reference-resources.md
├── reference-modules.md
└── reference-state.md
\`\`\`

---

## Pattern Summary

| Pattern | Key Characteristics |
|---------|-------------------|
| **Task** | \`auto-activate: false\`, step-by-step process, confirmation gates |
| **Research** | Uses Agent subagents, parallel execution, structured output |
| **Dynamic** | Shell injection \`!\`command\`\`, live context, minimal instructions |
| **Knowledge** | \`user-invocable: false\`, pure reference, no actions |
| **Scripts** | \`\${CLAUDE_SKILL_DIR}/scripts/\`, external tooling |
| **Reference files** | Split content, \`\${CLAUDE_SKILL_DIR}/*.md\`, lazy loading |
`,

  "create-skill/reference.md": `# Skill System Reference

## Frontmatter Fields

All fields are specified in YAML frontmatter at the top of \`SKILL.md\`.

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| \`name\` | string | Kebab-case identifier. Becomes the \`/slash-command\`. Must match directory name. |
| \`description\` | string | What the skill does. Claude uses this for auto-activation matching. Include action verbs and trigger phrases. |

### Optional Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| \`argument-hint\` | string | — | Shown in autocomplete after the command name. Use \`[brackets]\` for placeholders. |
| \`user-invocable\` | boolean | \`true\` | If \`false\`, skill cannot be called via \`/command\`. Only auto-activates. |
| \`auto-activate\` | boolean | \`true\` | If \`false\`, skill only runs when explicitly invoked via \`/command\`. |
| \`allowed-tools\` | string[] | all | Whitelist of tools the skill can use. Restricts to only these tools. |
| \`disallowed-tools\` | string[] | none | Blacklist of tools. Skill can use everything except these. |

### Invocation Control Matrix

| \`user-invocable\` | \`auto-activate\` | Behavior |
|-------------------|-----------------|----------|
| \`true\` (default) | \`true\` (default) | Full access: slash command + auto-activates |
| \`true\` | \`false\` | Slash command only, never auto-activates |
| \`false\` | \`true\` | Auto-activate only, no slash command |
| \`false\` | \`false\` | Never runs (useless — avoid this) |

### Tool Restriction Examples

\`\`\`yaml
# Only allow reading and searching — no edits
allowed-tools:
  - Read
  - Glob
  - Grep
  - Agent

# Allow everything except destructive tools
disallowed-tools:
  - Bash
  - Write
  - Edit
\`\`\`

## Variables

Variables are replaced at invocation time before Claude sees the content.

| Variable | Description | Available in |
|----------|-------------|-------------|
| \`$ARGUMENTS\` | Everything the user typed after \`/command\`. Empty string if no arguments. | SKILL.md |
| \`$0\` | Alias for \`$ARGUMENTS\` | SKILL.md |
| \`\${CLAUDE_SKILL_DIR}\` | Absolute path to the skill's directory. Use for referencing supporting files. | SKILL.md |
| \`\${CLAUDE_SESSION_ID}\` | Unique ID for the current Claude Code session. | SKILL.md |

### Variable Usage

\`\`\`markdown
# In SKILL.md

The user wants: $ARGUMENTS

Read \`\${CLAUDE_SKILL_DIR}/reference.md\` for details.

Session: \${CLAUDE_SESSION_ID}
\`\`\`

**Important**: \`$ARGUMENTS\` and \`$0\` are the same. Use \`$ARGUMENTS\` for clarity.

## Shell Injection

Embed live command output in SKILL.md using \`!\`backtick\` \` syntax:

\`\`\`markdown
Current branch: !\`git branch --show-current\`
Node version: !\`node --version\`
Changed files: !\`git diff main --name-only\`
\`\`\`

**How it works:**
- Commands execute when the skill is activated (not at definition time)
- Output replaces the \`!\`command\`\` inline
- If the command fails, the error output is included instead
- Commands run in the current working directory

**Use cases:**
- Inject project state (git branch, recent commits, env vars)
- Generate dynamic context (file lists, config values)
- Pre-compute information Claude needs

**Caution:**
- Commands run with the user's permissions
- Keep commands fast — slow commands delay skill activation
- Don't use for side effects (the skill content is for context, not execution)

## File Structure

\`\`\`
skills/
└── my-skill/
    ├── SKILL.md          # Required — main instructions (loaded on activation)
    ├── reference.md      # Optional — detailed reference (read on-demand)
    ├── examples.md       # Optional — code examples (read on-demand)
    └── scripts/          # Optional — bundled scripts
        └── check.sh
\`\`\`

### Loading Behavior

- **SKILL.md**: Loaded into context when the skill activates (via slash command or auto-activation)
- **Supporting \`.md\` files**: NOT automatically loaded. Only read when SKILL.md tells Claude to read them via \`\${CLAUDE_SKILL_DIR}\` references
- **Scripts/other files**: Available on disk but never auto-loaded. Referenced via \`\${CLAUDE_SKILL_DIR}\`

This means:
- Keep SKILL.md focused — it's always loaded
- Put detailed references in separate files — they're only loaded when needed
- Supporting files don't cost context tokens unless explicitly read

## Permissions

Skills inherit the user's permission settings. A skill cannot bypass permission restrictions.

- If the user has \`Bash\` set to "ask", the skill will still prompt for Bash usage
- \`allowed-tools\` in frontmatter further restricts (intersects with) user permissions
- \`disallowed-tools\` adds restrictions on top of user permissions

## Skill Resolution

When multiple skills could match:
1. Exact slash command match takes priority
2. For auto-activation, Claude evaluates all skill descriptions against the user's message
3. Multiple skills can auto-activate simultaneously if relevant
4. Project skills (\`.claude/skills/\`) and personal skills (\`~/.claude/skills/\`) are both searched

## Naming Conventions

- **Directory name**: kebab-case, matches \`name\` field exactly
- **SKILL.md**: Always uppercase \`SKILL.md\`
- **Supporting files**: lowercase kebab-case \`.md\` files
- **Scripts**: lowercase, appropriate extension (\`.sh\`, \`.py\`, \`.ts\`)
`,

  "customer-support/SKILL.md": `---
name: customer-support
description: Handle customer support tasks professionally. Use when drafting support responses, analyzing customer issues, triaging tickets, writing help articles, creating macros/templates, reviewing support conversations for quality, or building support workflows. Covers email replies, live chat, ticket management, escalation, tone calibration, and CSAT optimization.
argument-hint: [customer issue, ticket, or support task]
---

# Customer Support

You are a senior customer support specialist. You write responses that are empathetic, clear, and solution-oriented. You resolve issues efficiently while making customers feel heard.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive patterns:

- \`response-templates.md\` — Ready-to-adapt templates for common scenarios (refunds, bugs, feature requests, outages, billing)
- \`escalation-guide.md\` — Escalation criteria, internal routing, SLA expectations, and handoff protocols

## Core Principles

1. **Acknowledge first, solve second** — Validate the customer's frustration before jumping to solutions
2. **One read, full understanding** — Responses should be scannable; use short paragraphs, bullet points, and clear next steps
3. **Own the problem** — Never deflect blame or use passive voice ("a mistake was made"); take responsibility
4. **Match energy, not emotion** — Mirror the customer's urgency level but never match anger or frustration
5. **Close the loop** — Every response ends with a clear next step or confirmation that the issue is resolved

## Response Structure

Every support response follows this flow:

\`\`\`
1. Greeting (personalized, not robotic)
2. Acknowledgment (show you understand the issue)
3. Explanation or solution (clear, jargon-free)
4. Next steps (exactly what happens next and when)
5. Closing (warm, confident, invites follow-up)
\`\`\`

## Tone Calibration

| Customer State | Your Tone | Example Opener |
|---------------|-----------|----------------|
| Frustrated/angry | Calm, empathetic, urgent | "I completely understand your frustration, and I want to get this resolved for you right away." |
| Confused | Patient, clear, guiding | "Great question — let me walk you through this step by step." |
| Neutral/informational | Friendly, efficient | "Thanks for reaching out! Here's what you need to know." |
| Happy/grateful | Warm, appreciative | "That's wonderful to hear! We're glad it's working well for you." |
| Escalating/threatening | Professional, solution-focused | "I hear you, and I take this seriously. Here's what I can do right now." |

## Quick Patterns

### Bug Report Response
\`\`\`
Hi [Name],

Thank you for reporting this — I can see how [specific impact] would be frustrating.

I've reproduced the issue and [logged it with our engineering team / here's a workaround]:

- [Step 1]
- [Step 2]

[Timeline for fix / workaround confirmation]. I'll follow up as soon as there's an update.

Is there anything else I can help with in the meantime?

Best,
[Agent]
\`\`\`

### Saying No Gracefully
\`\`\`
Hi [Name],

I appreciate you sharing this idea — [acknowledge why it makes sense].

Right now, [honest reason it's not possible]. That said, [alternative or future possibility].

[Concrete alternative or next best option].

Let me know if that works for you, or if there's another way I can help.

Best,
[Agent]
\`\`\`

## Ticket Analysis Mode

When given a support ticket or conversation to analyze, provide:

1. **Issue summary** — One sentence describing the core problem
2. **Customer sentiment** — Frustrated / Confused / Neutral / Escalated
3. **Root cause** — What actually went wrong (technical or process)
4. **Recommended response** — Draft reply following the response structure above
5. **Prevention** — How to prevent this issue for future customers
6. **Tags** — Suggested categories: \`billing\`, \`bug\`, \`feature-request\`, \`how-to\`, \`account\`, \`outage\`

## Writing Help Articles

When creating help/knowledge base articles:

- **Title**: Action-oriented ("How to reset your password", not "Password reset")
- **Opening**: One sentence stating what this article covers and who it's for
- **Steps**: Numbered, with screenshots/code blocks where helpful
- **Troubleshooting**: Common pitfalls at the bottom
- **Related articles**: Link to 2-3 related topics

## Critical Rules

1. **Never share internal tooling, processes, or system details** with customers unless explicitly public
2. **Never promise timelines you can't guarantee** — use "as soon as possible" or "within [SLA window]"
3. **Never blame the customer** — even if they caused the issue, guide them to the fix without judgment
4. **Never copy-paste templates without personalizing** — adapt every template to the specific situation
5. **Always include a next step** — no response should leave the customer wondering "what now?"
6. **Always use the customer's name** — personalization builds trust
7. **Never use jargon** — translate technical terms into plain language
8. **Proactively address likely follow-up questions** — anticipate what they'll ask next
9. **Respect urgency** — billing issues and outages get priority treatment in tone and action
10. **When unsure, escalate** — it's better to route to the right person than give a wrong answer

## Using This Skill

If \`$ARGUMENTS\` contains a customer message or ticket, analyze it and draft a response. If it describes a task (e.g., "write a help article about billing"), execute that task. If no arguments, ask what kind of support task to help with.
`,

  "customer-support/escalation-guide.md": `# Escalation Guide

When and how to escalate customer issues beyond standard support.

## Escalation Tiers

### Tier 1 — Standard Support (Handle Directly)
- Password resets and account access
- How-to questions and feature guidance
- Known bug workarounds
- Billing questions with clear answers
- Feature requests (log and acknowledge)
- General product feedback

### Tier 2 — Senior Support / Team Lead
**Escalate when:**
- Customer has contacted support 3+ times for the same issue
- Issue requires account-level changes beyond standard permissions
- Customer explicitly requests a manager or supervisor
- Refund exceeds standard authorization limit
- Bug affects customer's business operations with no workaround
- Compliance or legal language in the customer's message

**How to escalate:**
\`\`\`
Internal note:
- Customer: [Name, Account ID]
- Issue: [One-sentence summary]
- Attempts: [What was already tried]
- Why escalating: [Specific reason]
- Recommended action: [Your suggestion]
- Urgency: [Low / Medium / High / Critical]
\`\`\`

### Tier 3 — Engineering
**Escalate when:**
- Bug cannot be reproduced but customer provides strong evidence
- Data integrity issue (missing data, corrupted records, sync failures)
- Performance degradation affecting specific accounts
- Security concern (unauthorized access, data exposure)
- Integration/API issue requiring code-level investigation

**Include in engineering escalation:**
\`\`\`
- Account ID / User ID:
- Environment: [Production / Staging]
- Steps to reproduce:
- Expected behavior:
- Actual behavior:
- Error messages / logs:
- Browser / Device / OS:
- Frequency: [Always / Intermittent / Once]
- Impact: [Number of users affected]
- Customer communication: [What we told the customer]
\`\`\`

### Tier 4 — Executive / Crisis
**Escalate immediately when:**
- Data breach or security incident
- Service-wide outage lasting 30+ minutes
- Legal threat or regulatory complaint
- Press/media involvement
- Enterprise customer threatening churn (ARR > [threshold])
- Any issue involving PII exposure

## SLA Reference

| Priority | First Response | Resolution Target | Examples |
|----------|---------------|-------------------|----------|
| Critical | 15 minutes | 4 hours | Outage, data breach, complete service failure |
| High | 1 hour | 8 hours | Major feature broken, billing error, business-blocking |
| Medium | 4 hours | 24 hours | Non-critical bug, account question, feature request |
| Low | 24 hours | 72 hours | General feedback, how-to, enhancement suggestion |

## Handoff Best Practices

### When handing off to another agent:
1. **Summarize the full history** — don't make the customer repeat themselves
2. **Share what you've already tried** — avoid duplicate troubleshooting
3. **Set customer expectations** — tell them who's taking over and when they'll hear back
4. **Warm handoff when possible** — introduce the next agent by name

### Handoff message to customer:
\`\`\`
Hi [Name],

I want to make sure you get the best help possible on this. I'm bringing in [Agent/Team] who specializes in [area]. I've shared the full details of our conversation so you won't need to repeat anything.

[Agent/Team] will reach out to you within [timeframe]. If you don't hear back by then, reply to this message and I'll follow up personally.

Best,
[Agent]
\`\`\`

### Internal handoff note:
\`\`\`
Handing off to: [Agent/Team]
Customer: [Name] — [sentiment: frustrated/neutral/escalated]
Summary: [2-3 sentences covering the full issue]
What's been tried: [List of actions taken]
What customer expects: [Their stated desired outcome]
Recommended next step: [Your suggestion]
\`\`\`

## De-escalation Techniques

When a customer is angry or threatening:

1. **Let them vent** — Don't interrupt or rush to a solution
2. **Validate explicitly** — "You're right to be upset about this"
3. **Take ownership** — "This is on us, and here's what I'm doing about it"
4. **Be specific** — Vague promises increase frustration; give concrete actions and timelines
5. **Offer something tangible** — Credit, extension, direct contact, expedited fix
6. **Follow up proactively** — Don't wait for them to chase you

### Phrases that de-escalate:
- "I would be frustrated too if this happened to me."
- "You shouldn't have to deal with this. Let me fix it."
- "I'm going to personally make sure this gets resolved."
- "Here's exactly what's going to happen next..."

### Phrases to avoid:
- "Per our policy..." (sounds bureaucratic)
- "Unfortunately..." (feels like a dead end)
- "There's nothing I can do" (always find something)
- "You should have..." (blames the customer)
- "As I mentioned previously..." (condescending)
- "Calm down" (invalidating)

## CSAT Optimization Tips

Practices that consistently improve satisfaction scores:

1. **Speed matters most when the customer is frustrated** — respond faster to negative-sentiment tickets
2. **Personalize beyond the name** — reference their specific use case, plan, or history
3. **Exceed expectations on resolution** — if you can solve it in one reply, do it
4. **Follow up after resolution** — a check-in 24-48 hours later shows you care
5. **Admit mistakes directly** — customers forgive errors faster when you own them
6. **Give direct answers first** — lead with "Yes", "No", or the solution, then explain
`,

  "customer-support/response-templates.md": `# Response Templates

Adapt every template to the specific situation. Never copy-paste without personalizing.

## Refund Request — Approved

\`\`\`
Hi [Name],

I'm sorry to hear [product/service] didn't meet your expectations. I've processed a full refund of [amount] to your [payment method].

You should see the funds back in your account within [3-5 business days / timeframe]. Here's your refund reference: [#REF].

If there's anything we could have done differently, I'd love to hear your feedback — it helps us improve.

Best,
[Agent]
\`\`\`

## Refund Request — Denied

\`\`\`
Hi [Name],

Thank you for reaching out about a refund. I've looked into your account and unfortunately, [specific reason — e.g., "your subscription is past the 30-day refund window" or "this purchase falls outside our refund policy"].

Here's what I can offer instead:
- [Alternative 1 — e.g., credit toward future purchase]
- [Alternative 2 — e.g., extended trial, plan downgrade]

Would either of these work for you? I want to make sure you're getting value from [product].

Best,
[Agent]
\`\`\`

## Bug Report — Known Issue

\`\`\`
Hi [Name],

Thanks for letting us know about this — you're not alone, and we're actively working on a fix.

**What's happening:** [Brief, plain-language explanation]
**Current status:** Our engineering team is [investigating / working on a fix / testing a patch]
**Expected resolution:** [Timeline if known, or "We'll update you as soon as we have a fix"]

**In the meantime**, here's a workaround:
1. [Step 1]
2. [Step 2]

I'll personally follow up once the fix is live. Sorry for the inconvenience.

Best,
[Agent]
\`\`\`

## Bug Report — New/Unreported Issue

\`\`\`
Hi [Name],

Thank you for the detailed report — this helps us a lot.

I've created a ticket with our engineering team and included the details you shared. To help them investigate faster, could you let me know:

- [Clarifying question 1 — e.g., "What browser/device are you using?"]
- [Clarifying question 2 — e.g., "When did this first start happening?"]
- [Clarifying question 3 — e.g., "Does this happen every time, or intermittently?"]

I'll keep you updated on progress. In the meantime, [workaround if available, or "I'll reach out as soon as we have more information"].

Best,
[Agent]
\`\`\`

## Feature Request

\`\`\`
Hi [Name],

That's a great idea — I can see how [feature] would help with [their use case].

I've added your request to our product feedback board. While I can't guarantee timelines for new features, I can tell you that [relevant context — e.g., "this is something other customers have asked about too" or "our team is exploring this area"].

[If alternative exists:] In the meantime, you might find [alternative feature/workaround] helpful for achieving something similar.

I'll make a note to let you know if this ships. Thanks for sharing the feedback!

Best,
[Agent]
\`\`\`

## Service Outage

\`\`\`
Hi [Name],

I understand how disruptive this is, and I apologize for the impact on your work.

**Current status:** We're experiencing [brief description of outage]. Our team has been working on this since [time], and [current progress].

**What we're doing:** [Specific actions being taken]
**Expected resolution:** [ETA if known, or "We're working to resolve this as quickly as possible"]

You can track real-time updates at [status page URL].

[If applicable:] Once service is restored, [any data recovery / catch-up info]. [If SLA credits apply:] We'll proactively apply any applicable service credits to your account.

I know this isn't the experience you expect from us, and we take this seriously.

Best,
[Agent]
\`\`\`

## Billing Dispute

\`\`\`
Hi [Name],

I understand unexpected charges are concerning — let me look into this right away.

I've reviewed your account and here's what I found:

- **Charge in question:** [Amount] on [Date]
- **Reason:** [Clear explanation — e.g., "This was your annual renewal" or "Your trial converted to a paid plan"]

[If error:] You're right — this charge was made in error. I've [refunded it / reversed it], and you should see [amount] back within [timeframe].

[If valid:] I know this may not have been expected. [Explain why it happened and what they can do — e.g., "You can adjust your plan at any time from Settings > Billing to avoid future charges."]

Would you like me to [specific next step]?

Best,
[Agent]
\`\`\`

## Account Access Issue

\`\`\`
Hi [Name],

I know getting locked out of your account is stressful — let's get you back in.

I can see your account is [status — e.g., "active but the password needs to be reset"]. Here's what to do:

1. [Step 1 — e.g., "Go to [URL] and click 'Forgot Password'"]
2. [Step 2 — e.g., "Check your email (including spam) for the reset link"]
3. [Step 3 — e.g., "Create a new password and log in"]

[If 2FA issue:] Since you've lost access to your authenticator, I'll need to verify your identity. Could you reply with:
- The email address on your account
- The last 4 digits of the card on file
- [Other verification info]

Once verified, I can reset your 2FA so you can set it up again.

Best,
[Agent]
\`\`\`

## Cancellation — Save Attempt

\`\`\`
Hi [Name],

I'm sorry to hear you're thinking of canceling. Before we process that, I want to make sure you know about a few options:

- **[Option 1]** — e.g., "Downgrade to our Basic plan at [price] to keep [key features]"
- **[Option 2]** — e.g., "Pause your subscription for up to 3 months"
- **[Option 3]** — e.g., "I can offer [discount/credit] on your next [period]"

If none of these work, I completely understand and will process your cancellation right away — no hassle.

What would you prefer?

Best,
[Agent]
\`\`\`

## Cancellation — Confirmed

\`\`\`
Hi [Name],

Your cancellation has been processed. Here's what to expect:

- **Access continues until:** [End of billing period date]
- **Final charge:** [None / amount]
- **Data:** [Your data will be available for export for 30 days / retained per our policy]

If you ever want to come back, you can reactivate at any time from [URL].

We appreciate you being a customer, and we'd love to hear what we could improve — feel free to reply if you'd like to share any feedback.

Wishing you all the best,
[Agent]
\`\`\`

## Follow-Up After Resolution

\`\`\`
Hi [Name],

I wanted to check in — were you able to [action from previous interaction]? Is everything working as expected now?

If you're all set, no need to reply. But if anything else comes up, I'm here to help.

Best,
[Agent]
\`\`\`

## Tone Adjustments

### Making it more formal
- Replace "Hi [Name]" → "Dear [Name]"
- Replace "I'm sorry" → "We sincerely apologize"
- Replace "Best" → "Kind regards"
- Remove contractions

### Making it more casual
- Replace "Hi [Name]" → "Hey [Name]!"
- Add conversational phrases: "Totally understand", "No worries at all"
- Use contractions freely
- Replace "Best" → "Cheers" or "Talk soon"

### Escalation-level formality
- Open with company apology: "On behalf of [Company], I sincerely apologize..."
- Include specific remediation: credits, extended service, direct contact info
- Offer direct line or personal follow-up commitment
- Close with accountability: "I'm personally ensuring this is resolved"
`,

  "frontend-design/SKILL.md": `---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications. Generates creative, polished code that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.`,

  "know-me/SKILL.md": `---
name: know-me
description: Learn about the user across sessions. Observe preferences, habits, corrections, and context. Save to memory topic files. Reference stored knowledge to personalize responses. Auto-activates when the user shares personal info, corrects Claude, or expresses preferences.
auto-activate: true
---

# Know Everything About Me

You are a thoughtful assistant who remembers. You pay attention to what the user tells you — explicitly and implicitly — and store it so future sessions feel continuous, not cold-started.

Read the reference files in \`\${CLAUDE_SKILL_DIR}\` for detailed guidance:

- \`what-to-track.md\` — Categories of information to observe and save
- \`memory-operations.md\` — How to store, organize, update, and recall user knowledge

## Core Loop: Listen → Save → Recall → Apply

### 1. Listen (Every Session)
Watch for signals the user is revealing something worth remembering:

| Signal | Example | Action |
|--------|---------|--------|
| Direct statement | "I always use bun" | Save immediately |
| Correction | "No, use tabs not spaces" | Save + update existing memory |
| Repeated choice | Always picks Tailwind over CSS modules | Save after 2nd occurrence |
| Frustration | "Stop explaining obvious things" | Save communication preference |
| Project context | "This is a B2B SaaS for dentists" | Save project knowledge |
| Tool preference | Always uses Vim keybindings | Save after 2nd observation |

### 2. Save (To Memory Topic Files)
\`\`\`
~/.claude/projects/<project-path>/memory/
├── MEMORY.md              ← Summary + links (auto-loaded, 200-line limit)
├── user-preferences.md    ← How the user likes to work
├── project-context.md     ← What they're building and why
├── tech-stack.md          ← Tools, frameworks, versions they use
├── communication-style.md ← How they want Claude to communicate
└── corrections.md         ← Things Claude got wrong — never repeat
\`\`\`

**Where to save:**
- MEMORY.md: One-line summaries with pointers to topic files
- Topic files: Detailed entries with date and context

### 3. Recall (Before Responding)
Before making suggestions or writing code:
1. Check if MEMORY.md has relevant user preferences
2. Read the relevant topic file if the task touches a known preference area
3. Apply stored knowledge — don't ask questions you already know the answer to

### 4. Apply (Personalize Everything)
- Use their preferred tools/frameworks without asking
- Match their communication style (concise vs detailed, casual vs formal)
- Reference their project context when making architectural suggestions
- Avoid patterns they've previously rejected

## Auto-Activation Triggers

This skill activates when you detect:
- User shares personal information, preferences, or opinions
- User corrects Claude on a choice or assumption
- User describes their project, team, or goals
- User expresses frustration about Claude's behavior
- A preference conflict with stored memory (update needed)

## What NOT to Save

- Temporary task context (what file they're editing right now)
- Information that belongs in code/docs, not memory
- Sensitive data (passwords, API keys, financial details)
- Speculative conclusions from a single interaction
- Anything the user asks you to forget

## Handling Corrections

When the user corrects you on something from memory:
1. **Immediately acknowledge** the correction
2. **Update or remove** the incorrect memory entry right now
3. **Save the correction** to \`corrections.md\` so the mistake never repeats
4. **Continue** with the corrected information

## Privacy Rules

1. Never save secrets, credentials, or sensitive personal data
2. If the user says "forget X" or "don't remember that" — delete it immediately
3. Only save information relevant to working together effectively
4. Don't reference stored personal info unnecessarily — use it naturally
5. If unsure whether something is worth saving, err toward saving it (except sensitive data)

## Quick Save Template

When saving a new memory entry to a topic file:
\`\`\`markdown
### [Category]: [What you learned]
- **Observed:** [date or "this session"]
- **Context:** [How you learned this]
- **Detail:** [The actual preference/info]
\`\`\`
`,

  "know-me/memory-operations.md": `# Memory Operations — How to Store, Organize, Update & Recall

## Memory Architecture

\`\`\`
~/.claude/projects/<project-path>/memory/
├── MEMORY.md              ← Auto-loaded (first 200 lines). Index + key facts.
├── user-preferences.md    ← Dev tools, code style, framework choices
├── project-context.md     ← What they're building, business context
├── tech-stack.md          ← Languages, frameworks, versions, infrastructure
├── communication-style.md ← How they want Claude to interact
└── corrections.md         ← Mistakes Claude made — never repeat these
\`\`\`

### MEMORY.md Rules
- First 200 lines are auto-loaded into every conversation
- Keep it as an index: short summaries + pointers to topic files
- Don't put detailed info here — put it in topic files
- Budget: ~20 lines per section, max 6-8 sections

### Topic File Rules
- Lazy-loaded (only read when relevant)
- No line limit, but keep organized
- Group by category with \`###\` headers
- Include date/context for each entry

---

## Saving Operations

### Save a New Preference
\`\`\`
1. Check MEMORY.md — does a relevant section exist?
2. If yes → Read the linked topic file → Add entry
3. If no → Create section in MEMORY.md + create/update topic file
4. Verify: Re-read the file to confirm it saved correctly
\`\`\`

**MEMORY.md entry format:**
\`\`\`markdown
## User Preferences
- Uses bun, Tailwind, Vitest — see \`user-preferences.md\`
\`\`\`

**Topic file entry format:**
\`\`\`markdown
### Package Manager: bun
- **Observed:** 2026-03-10
- **Context:** User said "I always use bun"
- **Detail:** Use bun for all package management. Use \`bun install\`, \`bun run\`, \`bunx\`.
\`\`\`

### Save a Correction
\`\`\`
1. Read corrections.md (or create it)
2. Add the correction entry
3. Find and UPDATE any conflicting memory in other files
4. Update MEMORY.md if the correction affects a summary line
\`\`\`

**Correction entry format:**
\`\`\`markdown
### Correction: Don't add JSDoc to unchanged functions
- **Date:** 2026-03-10
- **Wrong assumption:** Claude added JSDoc comments to existing functions while editing nearby code
- **Correct behavior:** Only modify code that's directly related to the task. Never add comments, types, or docs to unchanged code.
- **Category:** code-style
\`\`\`

### Save Project Context
\`\`\`
1. Read project-context.md (or create it)
2. Add/update the project entry
3. Update MEMORY.md summary line
\`\`\`

**Project entry format:**
\`\`\`markdown
### Project: [Name]
- **Type:** B2B SaaS for dental practices
- **Stage:** MVP, launching Q2 2026
- **Stack:** Next.js, Supabase, Tailwind, Vercel
- **Team:** Solo founder + 1 contractor
- **Key constraints:** Bootstrap budget, need to ship fast
\`\`\`

---

## Updating Operations

### When to Update (Not Create New)
- User corrects a previously saved preference
- A preference changes ("actually, switching to pnpm")
- Project context evolves (MVP → growth stage)
- A saved entry turns out to be wrong

### Update Process
\`\`\`
1. Read the topic file containing the outdated entry
2. Use Edit tool to replace the old entry with the new one
3. If MEMORY.md summary is affected, update that too
4. Do NOT keep the old entry — replace it cleanly
\`\`\`

### When to Delete
- User says "forget X" or "don't remember that"
- Information is clearly outdated and no longer relevant
- A correction makes a previous entry completely wrong
- Duplicate entries discovered

---

## Recall Operations

### Before Starting Any Task
Quick mental checklist:
1. MEMORY.md is auto-loaded — scan it for relevant preferences
2. If task involves code: Do I know their style preferences?
3. If task involves architecture: Do I know their stack and constraints?
4. If task involves communication: Do I know their preferred style?

### Deep Recall (When Needed)
\`\`\`
1. Read the relevant topic file before making decisions
2. Example: Before suggesting a testing approach → read user-preferences.md
3. Example: Before choosing a library → read tech-stack.md
4. Example: Before writing a long explanation → read communication-style.md
\`\`\`

### Applying Recalled Knowledge
- **Do:** Silently apply preferences (use bun without asking)
- **Don't:** Announce that you're using stored preferences ("Based on my memory of your preferences...")
- **Do:** Reference context naturally ("Since this is a dental SaaS, HIPAA compliance matters here")
- **Don't:** Quiz the user on stored info ("I remember you use Tailwind, is that still true?")

---

## MEMORY.md Template

\`\`\`markdown
# Project Memory

## User Preferences
- [Package manager], [framework], [testing tool] — see \`user-preferences.md\`
- Communication: [concise/detailed], [casual/formal] — see \`communication-style.md\`

## Current Project
- [One-line description] — see \`project-context.md\`
- Stack: [key technologies] — see \`tech-stack.md\`

## Important Corrections
- [Most critical correction] — see \`corrections.md\`
- [Second most critical]

## Key Patterns
- [Any recurring workflow or habit worth noting]
\`\`\`

---

## Conflict Resolution

When new information conflicts with stored memory:

| Scenario | Action |
|----------|--------|
| User explicitly corrects | Update immediately, no questions |
| User implies different preference | Ask once: "I noticed you're using X — should I default to that?" |
| User's action contradicts stored pref | Don't ask — might be one-off. Note if it happens again. |
| Two memories conflict with each other | Read both, keep the more recent one |

---

## Hygiene — Periodic Maintenance

### When to Audit Memory
- Start of a new project (old project context may be stale)
- User mentions something that contradicts stored memory
- MEMORY.md approaching 200-line limit

### Audit Steps
1. Read MEMORY.md — is everything still accurate?
2. Check each topic file — remove outdated entries
3. Consolidate duplicates
4. Verify topic file links in MEMORY.md still point to real files

### MEMORY.md Space Management
If approaching 200 lines:
1. Move detailed entries to topic files (keep only summaries)
2. Remove entries for completed/abandoned projects
3. Merge similar entries
4. Delete anything that's now in CLAUDE.md (no duplication)

---

## Anti-Patterns

| Don't Do This | Do This Instead |
|---------------|-----------------|
| Save every detail from every session | Save stable patterns confirmed across interactions |
| Save speculative conclusions | Verify before writing to memory |
| Duplicate info that's in CLAUDE.md | Reference CLAUDE.md, don't copy it |
| Save temporary task state | Only save durable preferences |
| Announce every memory save | Save quietly unless it's a correction acknowledgment |
| Save without reading existing memory first | Always check for duplicates/conflicts before writing |
| Store sensitive data (keys, passwords) | Never store credentials or secrets |
| Ignore corrections | Corrections are highest-priority saves |
`,

  "know-me/what-to-track.md": `# What to Track — User Knowledge Categories

## 1. Development Preferences

### Tools & Runtime
- Package manager (npm, yarn, pnpm, bun)
- Runtime (Node.js, Deno, Bun)
- Editor/IDE (VS Code, Neovim, Cursor, etc.)
- Terminal (iTerm2, Warp, built-in)
- OS and platform details

### Code Style
- Formatting (tabs vs spaces, indent size, semicolons)
- Naming conventions (camelCase, snake_case, kebab-case)
- File organization preferences
- Comment style (minimal, verbose, JSDoc)
- Import ordering preferences
- Preferred patterns (functional vs OOP, composition vs inheritance)

### Frameworks & Libraries
- Frontend framework (React, Vue, Svelte, etc.)
- CSS approach (Tailwind, CSS modules, styled-components)
- Backend framework (Express, Fastify, Hono, etc.)
- ORM (Prisma, Drizzle, TypeORM)
- Testing (Vitest, Jest, Playwright)
- Any strong preferences for or against specific libraries

### Language Preferences
- Primary languages (TypeScript, Python, Go, etc.)
- TypeScript strictness preferences
- Type annotation habits (explicit vs inferred)
- Error handling style (try/catch, Result types, etc.)

---

## 2. Communication Style

### How They Want Responses
- Concise vs detailed explanations
- Show code first vs explain first
- Emoji usage (yes/no)
- Formal vs casual tone
- How much context they want before changes

### What Frustrates Them
- Over-explaining obvious things
- Asking too many clarifying questions
- Being too cautious / not autonomous enough
- Being too aggressive with changes
- Adding unnecessary comments or docs
- Not reading files before suggesting changes

### Teaching Preferences
- Learn by reading code vs reading explanations
- Want to understand "why" or just "how"
- Prefer inline comments or separate explanations

---

## 3. Project Context

### Current Projects
- Project name and purpose
- Target audience / customers
- Stage (prototype, MVP, growth, enterprise)
- Team size and structure
- Deployment targets (Vercel, AWS, self-hosted)

### Business Context
- Industry / domain
- Revenue model (SaaS, marketplace, etc.)
- Key constraints (budget, timeline, compliance)
- Competitors or inspirations mentioned

### Architecture Decisions
- Monolith vs microservices
- Database choices and why
- API style (REST, GraphQL, tRPC)
- State management approach
- Auth provider and strategy

---

## 4. Workflow Habits

### Git & Version Control
- Commit message style
- Branching strategy
- PR preferences (squash, merge, rebase)
- How they handle code review

### Development Flow
- TDD vs test-after vs no tests
- How they prefer to debug
- CI/CD preferences
- Deployment cadence

### Task Management
- How they break down work
- Linear, GitHub Issues, Jira, etc.
- How they prioritize

---

## 5. Corrections Log

Track every time the user corrects Claude to prevent repeat mistakes:

### Format
\`\`\`markdown
### Correction: [What was wrong]
- **Date:** [When]
- **Wrong assumption:** [What Claude did/said]
- **Correct behavior:** [What the user wants instead]
- **Category:** [code-style | tool-choice | communication | architecture | other]
\`\`\`

### Why This Matters
Corrections are the highest-signal memory. A user correcting you means:
1. You made an assumption that was wrong
2. The user cared enough to tell you
3. It will be frustrating if it happens again

**Rule:** Always save corrections. Always update conflicting memories.

---

## 6. Personal Context (Light Touch)

Only save if volunteered and relevant to working together:
- Timezone (for scheduling, async considerations)
- Role (founder, senior dev, junior dev, designer)
- Experience level with specific technologies
- Side projects or interests that come up
- How they prefer to be addressed

**Never save:** Real name unless they use it, location details, health info, financial info, relationship info, or anything they'd be surprised to see stored.

---

## Priority Order for Saving

When you notice multiple things in one session, prioritize:

1. **Corrections** — Highest priority, save immediately
2. **Explicit preferences** — "I always want X" — save immediately
3. **Tool/framework choices** — Save after confirmed in 1-2 sessions
4. **Communication style** — Save after clear pattern (2+ signals)
5. **Project context** — Save when stable (not brainstorming phase)
6. **Personal context** — Save only if clearly relevant and volunteered

---

## Signals to Watch For

### Explicit (Save Immediately)
- "Always use..."
- "Never do..."
- "I prefer..."
- "Remember that..."
- "Don't forget..."
- "From now on..."
- "I told you before..."

### Implicit (Save After 2+ Occurrences)
- Consistently choosing one tool over another
- Repeatedly reformatting code Claude writes
- Undoing specific types of changes
- Skipping certain suggestions every time
- A pattern in how they phrase requests
`,

  "n8n/SKILL.md": `---
name: n8n
description: Build n8n workflow automations, custom nodes, and integrations. Use when the user wants to create n8n workflows, build custom n8n nodes, write n8n expressions, configure n8n triggers, handle n8n errors, set up webhook automations, or work with n8n's API. Triggers on mentions of n8n, workflow automation with n8n, or imports from n8n-workflow.
argument-hint: [description of workflow or node to build]
---

# n8n Skill

You are an expert at building production-grade n8n workflow automations, custom nodes, and integrations.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive patterns:

- \`workflow-reference.md\` — Workflow design, triggers, flow control, error handling, expressions, data transformation
- \`custom-nodes-reference.md\` — Building custom nodes with TypeScript, declarative vs programmatic, credentials, testing
- \`api-reference.md\` — n8n REST API for programmatic workflow management, execution control, credential operations

## Setup Checklist

### Self-Hosted (Docker)
\`\`\`bash
docker run -it --rm --name n8n -p 5678:5678 -v n8n_data:/home/node/.n8n docker.n8n.io/n8nio/n8n
\`\`\`

### Custom Node Development
\`\`\`bash
npx n8n-node-dev new        # scaffold a new node
npm link                     # link node to local n8n
n8n start                   # start with custom nodes loaded
\`\`\`

### npm (Global)
\`\`\`bash
npm install n8n -g
n8n start
\`\`\`

## Core Patterns

### Workflow JSON Structure
\`\`\`json
{
  "name": "My Workflow",
  "nodes": [
    {
      "parameters": {},
      "id": "unique-id",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [250, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{ "node": "Next Node", "type": "main", "index": 0 }]]
    }
  },
  "settings": { "executionOrder": "v1" }
}
\`\`\`

### Common Trigger Types
| Trigger | Use Case |
|---------|----------|
| \`n8n-nodes-base.webhook\` | HTTP requests, API endpoints |
| \`n8n-nodes-base.scheduleTrigger\` | Cron-based recurring tasks |
| \`n8n-nodes-base.formTrigger\` | User form submissions |
| \`n8n-nodes-base.emailReadImap\` | Incoming emails |
| \`n8n-nodes-base.workflowTrigger\` | Called by other workflows |

### Expression Syntax
\`\`\`
{{ $json.fieldName }}                    // current node data
{{ $input.first().json.field }}          // first input item
{{ $('NodeName').first().json.field }}   // data from specific node
{{ $now.toFormat('yyyy-MM-dd') }}        // Luxon date formatting
{{ $if($json.age > 18, "adult", "minor") }}  // conditional
{{ $jmespath($json, "items[?price > \`100\`]") }}  // JMESPath query
\`\`\`

### Error Handling Pattern
\`\`\`json
{
  "nodes": [
    {
      "name": "Main Task",
      "type": "n8n-nodes-base.httpRequest",
      "onError": "continueErrorOutput",
      "retryOnFail": true,
      "maxTries": 3,
      "waitBetweenTries": 1000
    }
  ]
}
\`\`\`

### Code Node (JavaScript)
\`\`\`javascript
// In a Code node — process all items
const results = [];
for (const item of $input.all()) {
  results.push({
    json: {
      processed: item.json.name.toUpperCase(),
      timestamp: new Date().toISOString(),
    }
  });
}
return results;
\`\`\`

### Code Node (Python)
\`\`\`python
# In a Code node — process all items
results = []
for item in _input.all():
    results.append({
        "json": {
            "processed": item.json["name"].upper(),
            "timestamp": str(datetime.now()),
        }
    })
return results
\`\`\`

## Critical Rules

1. **Every workflow needs a trigger node** — webhooks, schedules, form triggers, or app triggers start execution
2. **Items are arrays** — each node receives and outputs arrays of items; always handle multiple items
3. **Use expressions over Code nodes** — expressions are faster and easier to maintain; use Code only for complex logic
4. **Set \`executionOrder: "v1"\`** — ensures predictable node execution order in new workflows
5. **Error workflows are separate** — configure a dedicated error workflow in workflow settings to catch failures
6. **Credentials are encrypted at rest** — never hardcode secrets in node parameters; use n8n's credential system
7. **Webhook paths must be unique** — duplicate paths cause routing conflicts
8. **Binary data needs explicit handling** — use "Move Binary Data" node to convert between binary and JSON
9. **Test with manual execution first** — always test workflows manually before activating for production
10. **Pin data for development** — use pinned data on nodes to test downstream logic without re-triggering
11. **Sub-workflows for reuse** — extract shared logic into sub-workflows called via Execute Workflow node
12. **Respect rate limits** — use the SplitInBatches node and wait nodes when calling rate-limited APIs

## Key Node Categories

| Category | Nodes |
|----------|-------|
| **Flow** | IF, Switch, Merge, SplitInBatches, Loop Over Items |
| **Transform** | Set, Code, HTML Extract, Markdown, XML, Date & Time |
| **Data** | HTTP Request, GraphQL, FTP, RSS, Read/Write Files |
| **Developer** | Webhook, Execute Command, Execute Workflow, Function |
| **AI** | AI Agent, Text Classifier, Summarization Chain, Vector Store |

Use \`$ARGUMENTS\` to understand what the user wants to build. Read the reference files for detailed patterns before writing code.
`,

  "n8n/api-reference.md": `# n8n REST API Reference

## Authentication

All API requests require an API key passed as a header:

\`\`\`
X-N8N-API-KEY: your-api-key
\`\`\`

Generate API keys in n8n: Settings → API → Create API Key

Base URL: \`http://localhost:5678/api/v1\` (self-hosted) or your cloud instance URL.

## Workflows

### List Workflows
\`\`\`bash
GET /api/v1/workflows
# Query params: cursor, limit (max 250), tags, name, active
\`\`\`

### Get Workflow
\`\`\`bash
GET /api/v1/workflows/{id}
\`\`\`

### Create Workflow
\`\`\`bash
POST /api/v1/workflows
Content-Type: application/json

{
  "name": "My Workflow",
  "nodes": [...],
  "connections": {...},
  "settings": { "executionOrder": "v1" }
}
\`\`\`

### Update Workflow
\`\`\`bash
PUT /api/v1/workflows/{id}
Content-Type: application/json

{
  "name": "Updated Workflow",
  "nodes": [...],
  "connections": {...},
  "settings": { "executionOrder": "v1" }
}
\`\`\`

### Delete Workflow
\`\`\`bash
DELETE /api/v1/workflows/{id}
\`\`\`

### Activate/Deactivate Workflow
\`\`\`bash
PATCH /api/v1/workflows/{id}/activate
PATCH /api/v1/workflows/{id}/deactivate
\`\`\`

### Transfer Workflow (Enterprise)
\`\`\`bash
PUT /api/v1/workflows/{id}/transfer
Content-Type: application/json

{ "destinationProjectId": "project-id" }
\`\`\`

## Executions

### List Executions
\`\`\`bash
GET /api/v1/executions
# Query params: cursor, limit, status (error|success|waiting), workflowId, includeData
\`\`\`

### Get Execution
\`\`\`bash
GET /api/v1/executions/{id}
# Query params: includeData (boolean)
\`\`\`

### Delete Execution
\`\`\`bash
DELETE /api/v1/executions/{id}
\`\`\`

## Credentials

### List Credentials
\`\`\`bash
GET /api/v1/credentials
# Query params: cursor, limit
\`\`\`

### Create Credential
\`\`\`bash
POST /api/v1/credentials
Content-Type: application/json

{
  "name": "My API Key",
  "type": "httpHeaderAuth",
  "data": {
    "name": "Authorization",
    "value": "Bearer sk-..."
  }
}
\`\`\`

### Delete Credential
\`\`\`bash
DELETE /api/v1/credentials/{id}
\`\`\`

## Tags

### List Tags
\`\`\`bash
GET /api/v1/tags
# Query params: cursor, limit
\`\`\`

### Create Tag
\`\`\`bash
POST /api/v1/tags
Content-Type: application/json

{ "name": "production" }
\`\`\`

### Update Tag
\`\`\`bash
PATCH /api/v1/tags/{id}
Content-Type: application/json

{ "name": "staging" }
\`\`\`

### Delete Tag
\`\`\`bash
DELETE /api/v1/tags/{id}
\`\`\`

## Users (Admin)

### List Users
\`\`\`bash
GET /api/v1/users
# Query params: cursor, limit, includeRole
\`\`\`

### Get User
\`\`\`bash
GET /api/v1/users/{id}
\`\`\`

## Variables

### List Variables
\`\`\`bash
GET /api/v1/variables
# Query params: cursor, limit
\`\`\`

### Create Variable
\`\`\`bash
POST /api/v1/variables
Content-Type: application/json

{ "key": "API_BASE_URL", "value": "https://api.example.com" }
\`\`\`

### Update Variable
\`\`\`bash
PUT /api/v1/variables/{id}
Content-Type: application/json

{ "key": "API_BASE_URL", "value": "https://api-v2.example.com" }
\`\`\`

### Delete Variable
\`\`\`bash
DELETE /api/v1/variables/{id}
\`\`\`

## Source Control (Enterprise)

### Pull from Remote
\`\`\`bash
POST /api/v1/source-control/pull
Content-Type: application/json

{ "force": false }
\`\`\`

### Push to Remote
\`\`\`bash
POST /api/v1/source-control/push
Content-Type: application/json

{ "commitMessage": "Update workflows", "force": false }
\`\`\`

## Audit Logs (Enterprise)

### List Audit Events
\`\`\`bash
GET /api/v1/audit
# Query params: cursor, limit
\`\`\`

## Webhook URLs

When a workflow has a Webhook trigger, n8n exposes:
- **Production**: \`{baseUrl}/webhook/{path}\` (when workflow is active)
- **Test**: \`{baseUrl}/webhook-test/{path}\` (during manual testing)

## Programmatic Workflow Management

### JavaScript/TypeScript Client Example
\`\`\`typescript
class N8nClient {
  constructor(
    private baseUrl: string,
    private apiKey: string,
  ) {}

  private async request(method: string, path: string, body?: unknown) {
    const response = await fetch(\`\${this.baseUrl}/api/v1\${path}\`, {
      method,
      headers: {
        'X-N8N-API-KEY': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(\`n8n API error: \${response.status} \${await response.text()}\`);
    }

    return response.json();
  }

  // Workflows
  async listWorkflows(params?: { active?: boolean; tags?: string }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request('GET', \`/workflows\${query ? \`?\${query}\` : ''}\`);
  }

  async getWorkflow(id: string) {
    return this.request('GET', \`/workflows/\${id}\`);
  }

  async createWorkflow(workflow: { name: string; nodes: unknown[]; connections: unknown }) {
    return this.request('POST', '/workflows', workflow);
  }

  async updateWorkflow(id: string, workflow: unknown) {
    return this.request('PUT', \`/workflows/\${id}\`, workflow);
  }

  async activateWorkflow(id: string) {
    return this.request('PATCH', \`/workflows/\${id}/activate\`);
  }

  async deactivateWorkflow(id: string) {
    return this.request('PATCH', \`/workflows/\${id}/deactivate\`);
  }

  async deleteWorkflow(id: string) {
    return this.request('DELETE', \`/workflows/\${id}\`);
  }

  // Executions
  async listExecutions(params?: { workflowId?: string; status?: string; limit?: number }) {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return this.request('GET', \`/executions\${query ? \`?\${query}\` : ''}\`);
  }

  async getExecution(id: string, includeData = true) {
    return this.request('GET', \`/executions/\${id}?includeData=\${includeData}\`);
  }

  // Credentials
  async createCredential(credential: { name: string; type: string; data: unknown }) {
    return this.request('POST', '/credentials', credential);
  }

  // Variables
  async setVariable(key: string, value: string) {
    return this.request('POST', '/variables', { key, value });
  }
}

// Usage
const n8n = new N8nClient('http://localhost:5678', 'your-api-key');
const workflows = await n8n.listWorkflows();
\`\`\`

## Rate Limits & Best Practices

1. **No official rate limits** on self-hosted — but be reasonable with API calls
2. **Cloud instances** may have rate limits — check your plan
3. **Use pagination** — always paginate list endpoints for large datasets
4. **Include \`executionOrder: "v1"\`** in workflow settings for predictable behavior
5. **Test webhooks** with the test URL before activating workflows
6. **Use tags** to organize workflows (production, staging, team-specific)
7. **Back up workflows** — export via API before major changes
8. **Use variables** for environment-specific configuration instead of hardcoding
`,

  "n8n/custom-nodes-reference.md": `# n8n Custom Nodes Reference

## Overview

Custom nodes extend n8n with new integrations. Two approaches:
- **Declarative** — for simple HTTP-based APIs (no code logic)
- **Programmatic** — for complex logic, non-HTTP protocols, or custom processing

## Project Setup

### Scaffold a New Node Package
\`\`\`bash
npx n8n-node-dev new
# or clone the starter:
git clone https://github.com/n8n-io/n8n-nodes-starter.git
cd n8n-nodes-starter
npm install
\`\`\`

### Directory Structure
\`\`\`
n8n-nodes-<name>/
├── package.json
├── tsconfig.json
├── nodes/
│   └── MyNode/
│       ├── MyNode.node.ts          # Node implementation
│       ├── MyNode.node.json        # Codex metadata
│       └── mynode.svg              # Node icon
├── credentials/
│   └── MyApi.credentials.ts        # Credential definition
└── dist/                           # Compiled output
\`\`\`

### package.json Requirements
\`\`\`json
{
  "name": "n8n-nodes-myservice",
  "version": "1.0.0",
  "n8n": {
    "n8nNodesApiVersion": 1,
    "nodes": ["dist/nodes/MyNode/MyNode.node.js"],
    "credentials": ["dist/credentials/MyApi.credentials.js"]
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc && gulp build:icons",
    "dev": "tsc --watch",
    "lint": "tslint -p tsconfig.json -c tslint.json",
    "lintfix": "tslint --fix -p tsconfig.json -c tslint.json"
  },
  "devDependencies": {
    "n8n-workflow": "latest",
    "typescript": "~5.x"
  }
}
\`\`\`

## Programmatic Node

### Basic Structure
\`\`\`typescript
import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType,
} from 'n8n-workflow';

export class MyNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Node',
    name: 'myNode',
    icon: 'file:mynode.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Description of what this node does',
    defaults: { name: 'My Node' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'myApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Create', value: 'create', description: 'Create a record' },
          { name: 'Get', value: 'get', description: 'Get a record' },
          { name: 'Get Many', value: 'getMany', description: 'Get many records' },
          { name: 'Update', value: 'update', description: 'Update a record' },
          { name: 'Delete', value: 'delete', description: 'Delete a record' },
        ],
        default: 'create',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['create', 'update'] },
        },
        description: 'The name of the record',
      },
      {
        displayName: 'ID',
        name: 'id',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['get', 'update', 'delete'] },
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        displayOptions: {
          show: { operation: ['create', 'update'] },
        },
        options: [
          { displayName: 'Description', name: 'description', type: 'string', default: '' },
          { displayName: 'Tags', name: 'tags', type: 'string', default: '' },
        ],
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        default: 50,
        typeOptions: { minValue: 1, maxValue: 100 },
        displayOptions: {
          show: { operation: ['getMany'] },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const operation = this.getNodeParameter('operation', 0) as string;
    const credentials = await this.getCredentials('myApi');

    for (let i = 0; i < items.length; i++) {
      try {
        if (operation === 'create') {
          const name = this.getNodeParameter('name', i) as string;
          const additionalFields = this.getNodeParameter('additionalFields', i) as Record<string, unknown>;

          const body: Record<string, unknown> = { name, ...additionalFields };

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'myApi',
            {
              method: 'POST',
              url: \`\${credentials.baseUrl}/api/records\`,
              body,
              json: true,
            },
          );

          returnData.push({ json: response });
        } else if (operation === 'get') {
          const id = this.getNodeParameter('id', i) as string;

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'myApi',
            {
              method: 'GET',
              url: \`\${credentials.baseUrl}/api/records/\${id}\`,
              json: true,
            },
          );

          returnData.push({ json: response });
        } else if (operation === 'getMany') {
          const limit = this.getNodeParameter('limit', i) as number;

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'myApi',
            {
              method: 'GET',
              url: \`\${credentials.baseUrl}/api/records\`,
              qs: { limit },
              json: true,
            },
          );

          const records = Array.isArray(response) ? response : response.data || [];
          for (const record of records) {
            returnData.push({ json: record });
          }
        } else if (operation === 'update') {
          const id = this.getNodeParameter('id', i) as string;
          const name = this.getNodeParameter('name', i) as string;
          const additionalFields = this.getNodeParameter('additionalFields', i) as Record<string, unknown>;

          const body: Record<string, unknown> = { name, ...additionalFields };

          const response = await this.helpers.httpRequestWithAuthentication.call(
            this,
            'myApi',
            {
              method: 'PUT',
              url: \`\${credentials.baseUrl}/api/records/\${id}\`,
              body,
              json: true,
            },
          );

          returnData.push({ json: response });
        } else if (operation === 'delete') {
          const id = this.getNodeParameter('id', i) as string;

          await this.helpers.httpRequestWithAuthentication.call(
            this,
            'myApi',
            {
              method: 'DELETE',
              url: \`\${credentials.baseUrl}/api/records/\${id}\`,
              json: true,
            },
          );

          returnData.push({ json: { success: true, id } });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
\`\`\`

## Declarative Node (HTTP-Based)

For simple REST APIs, use the declarative style — no \`execute()\` method needed:

\`\`\`typescript
import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class MyApiNode implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My API',
    name: 'myApi',
    icon: 'file:myapi.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"]}}',
    description: 'Interact with My API',
    defaults: { name: 'My API' },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'myApi', required: true }],
    requestDefaults: {
      baseURL: '={{ $credentials.baseUrl }}',
      headers: { Accept: 'application/json' },
    },
    properties: [
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Get User',
            value: 'getUser',
            action: 'Get a user',
            routing: {
              request: {
                method: 'GET',
                url: '=/api/users/{{ $parameter.userId }}',
              },
            },
          },
          {
            name: 'Create User',
            value: 'createUser',
            action: 'Create a user',
            routing: {
              request: {
                method: 'POST',
                url: '/api/users',
              },
              send: {
                type: 'body',
                properties: {
                  name: '={{ $parameter.name }}',
                  email: '={{ $parameter.email }}',
                },
              },
            },
          },
        ],
        default: 'getUser',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['getUser'] } },
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['createUser'] } },
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        required: true,
        displayOptions: { show: { operation: ['createUser'] } },
      },
    ],
  };
}
\`\`\`

## Credential Definition

\`\`\`typescript
import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class MyApi implements ICredentialType {
  name = 'myApi';
  displayName = 'My API';
  documentationUrl = 'https://docs.example.com/api';

  properties: INodeProperties[] = [
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.example.com',
      required: true,
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '=Bearer {{ $credentials.apiKey }}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{ $credentials.baseUrl }}',
      url: '/api/me',
    },
  };
}
\`\`\`

## Property Types Reference

| Type | Description | TypeOptions |
|------|-------------|-------------|
| \`string\` | Text input | \`password\`, \`rows\` (textarea) |
| \`number\` | Numeric input | \`minValue\`, \`maxValue\`, \`numberStepSize\` |
| \`boolean\` | Toggle | — |
| \`options\` | Dropdown | Use \`options\` array |
| \`multiOptions\` | Multi-select | Use \`options\` array |
| \`collection\` | Group of optional fields | Use \`options\` array |
| \`fixedCollection\` | Group of required fields | Use \`values\` array |
| \`color\` | Color picker | — |
| \`dateTime\` | Date/time picker | — |
| \`json\` | JSON editor | — |
| \`resourceLocator\` | Resource picker with search | \`modes\` |

## Display Options

Control when properties are shown:
\`\`\`typescript
{
  displayOptions: {
    show: {
      operation: ['create', 'update'],     // show when operation is create OR update
      resource: ['user'],                   // AND resource is user
    },
    hide: {
      operation: ['delete'],               // hide when operation is delete
    },
  },
}
\`\`\`

## Trigger Node

\`\`\`typescript
import {
  ITriggerFunctions,
  INodeType,
  INodeTypeDescription,
  ITriggerResponse,
  NodeConnectionType,
} from 'n8n-workflow';

export class MyTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'My Trigger',
    name: 'myTrigger',
    icon: 'file:mytrigger.svg',
    group: ['trigger'],
    version: 1,
    description: 'Triggers on events from My Service',
    defaults: { name: 'My Trigger' },
    inputs: [],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: 'myApi', required: true }],
    polling: true,                          // for polling triggers
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          { name: 'Record Created', value: 'created' },
          { name: 'Record Updated', value: 'updated' },
        ],
        default: 'created',
      },
    ],
  };

  async poll(this: ITriggerFunctions): Promise<ITriggerResponse | null> {
    const credentials = await this.getCredentials('myApi');
    const event = this.getNodeParameter('event') as string;
    const webhookData = this.getWorkflowStaticData('node');
    const lastTimestamp = webhookData.lastTimestamp as string || new Date(0).toISOString();

    const response = await this.helpers.httpRequestWithAuthentication.call(
      this,
      'myApi',
      {
        method: 'GET',
        url: \`\${credentials.baseUrl}/api/events\`,
        qs: { type: event, since: lastTimestamp },
        json: true,
      },
    );

    const events = Array.isArray(response) ? response : response.data || [];

    if (events.length === 0) return null;

    webhookData.lastTimestamp = events[events.length - 1].timestamp;

    return {
      workflowData: [this.helpers.returnJsonArray(events)],
    };
  }
}
\`\`\`

## Testing Custom Nodes

### Local Development
\`\`\`bash
# Build the node
npm run build

# Link to local n8n
cd /path/to/n8n-nodes-myservice
npm link

cd ~/.n8n
npm link n8n-nodes-myservice

# Start n8n
n8n start
\`\`\`

### Linting
\`\`\`bash
npx n8n-node-dev lint
\`\`\`

### Publishing to npm
\`\`\`bash
npm publish
# Users install via: npm install n8n-nodes-myservice
# Then restart n8n
\`\`\`

## Best Practices

1. **Always handle \`continueOnFail()\`** — check in catch blocks
2. **Use \`pairedItem\`** — track item lineage for debugging
3. **Validate inputs early** — throw \`NodeOperationError\` for bad input
4. **Use \`this.helpers.httpRequestWithAuthentication\`** — handles credential injection
5. **Support expressions** — don't set \`noDataExpression: true\` unless the field is static
6. **Add codex metadata** — create \`MyNode.node.json\` for searchability
7. **Use \`NodeConnectionType\`** — import from \`n8n-workflow\` for type safety
8. **Handle pagination** — for "Get Many" operations, implement cursor/offset pagination
9. **Return proper \`INodeExecutionData\`** — always wrap in \`{ json: {...} }\`
10. **Use \`additionalFields\` collection** — for optional parameters to keep the UI clean
`,

  "n8n/workflow-reference.md": `# n8n Workflow Reference

## Workflow Design Patterns

### Sequential Processing
Nodes execute one after another. Data flows from trigger → processing → output.

\`\`\`
Webhook → Set Fields → HTTP Request → Respond to Webhook
\`\`\`

### Conditional Branching
Use IF or Switch nodes to route data based on conditions.

\`\`\`json
{
  "name": "IF",
  "type": "n8n-nodes-base.if",
  "parameters": {
    "conditions": {
      "options": { "caseSensitive": true },
      "conditions": [
        {
          "leftValue": "={{ $json.status }}",
          "rightValue": "active",
          "operator": { "type": "string", "operation": "equals" }
        }
      ]
    }
  }
}
\`\`\`

### Parallel Processing
Use Merge node to combine outputs from parallel branches.

\`\`\`
Trigger → Branch A → Merge → Output
       ↘ Branch B ↗
\`\`\`

Merge modes:
- **Append** — combine all items from both inputs
- **Combine** — match items by position or field
- **Choose Branch** — wait for one input, ignore the other
- **Multiplex** — create all possible combinations

### Loop Pattern
Use \`SplitInBatches\` for processing large datasets in chunks:

\`\`\`
Trigger → SplitInBatches → Process Batch → [loop back to SplitInBatches]
                         ↘ Done output → Final Step
\`\`\`

### Sub-Workflow Pattern
Extract reusable logic into separate workflows:

\`\`\`json
{
  "name": "Execute Workflow",
  "type": "n8n-nodes-base.executeWorkflow",
  "parameters": {
    "source": "database",
    "workflowId": "workflow-id-here",
    "mode": "each"
  }
}
\`\`\`

## Triggers

### Webhook Trigger
\`\`\`json
{
  "name": "Webhook",
  "type": "n8n-nodes-base.webhook",
  "parameters": {
    "path": "my-endpoint",
    "httpMethod": "POST",
    "responseMode": "responseNode",
    "options": {
      "rawBody": true
    }
  }
}
\`\`\`

Webhook options:
- \`responseMode\`: \`"onReceived"\` (immediate 200), \`"lastNode"\` (wait for completion), \`"responseNode"\` (use Respond to Webhook node)
- \`authentication\`: \`"none"\`, \`"basicAuth"\`, \`"headerAuth"\`
- \`rawBody\`: access raw request body
- \`binaryPropertyName\`: handle file uploads

### Schedule Trigger
\`\`\`json
{
  "name": "Schedule Trigger",
  "type": "n8n-nodes-base.scheduleTrigger",
  "parameters": {
    "rule": {
      "interval": [
        {
          "field": "cronExpression",
          "expression": "0 9 * * 1-5"
        }
      ]
    }
  }
}
\`\`\`

Interval options: \`seconds\`, \`minutes\`, \`hours\`, \`days\`, \`weeks\`, \`months\`, \`cronExpression\`

### Form Trigger
\`\`\`json
{
  "name": "Form Trigger",
  "type": "n8n-nodes-base.formTrigger",
  "parameters": {
    "formTitle": "Contact Form",
    "formDescription": "Submit your details",
    "formFields": {
      "values": [
        { "fieldLabel": "Name", "fieldType": "text", "requiredField": true },
        { "fieldLabel": "Email", "fieldType": "email", "requiredField": true },
        { "fieldLabel": "Message", "fieldType": "textarea" }
      ]
    },
    "options": { "respondWithData": true }
  }
}
\`\`\`

## Flow Control

### IF Node
\`\`\`json
{
  "type": "n8n-nodes-base.if",
  "parameters": {
    "conditions": {
      "conditions": [
        {
          "leftValue": "={{ $json.amount }}",
          "rightValue": 100,
          "operator": { "type": "number", "operation": "gt" }
        }
      ],
      "combinator": "and"
    }
  }
}
\`\`\`

Operators by type:
- **string**: equals, notEquals, contains, notContains, startsWith, endsWith, regex, isEmpty, isNotEmpty
- **number**: equals, notEquals, gt, gte, lt, lte
- **boolean**: true, false
- **dateTime**: after, before, equals
- **array**: contains, notContains, lengthEquals, lengthGt, lengthLt, isEmpty, isNotEmpty

### Switch Node
Route to multiple outputs based on rules:
\`\`\`json
{
  "type": "n8n-nodes-base.switch",
  "parameters": {
    "mode": "rules",
    "rules": {
      "values": [
        {
          "conditions": {
            "conditions": [{ "leftValue": "={{ $json.type }}", "rightValue": "email", "operator": { "type": "string", "operation": "equals" } }]
          },
          "output": 0
        },
        {
          "conditions": {
            "conditions": [{ "leftValue": "={{ $json.type }}", "rightValue": "sms", "operator": { "type": "string", "operation": "equals" } }]
          },
          "output": 1
        }
      ]
    },
    "options": { "fallbackOutput": "extra" }
  }
}
\`\`\`

### Wait Node
Pause execution for a duration or until a webhook is received:
\`\`\`json
{
  "type": "n8n-nodes-base.wait",
  "parameters": {
    "resume": "timeInterval",
    "amount": 5,
    "unit": "minutes"
  }
}
\`\`\`

Resume options: \`"timeInterval"\`, \`"specificTime"\`, \`"webhook"\`

## Error Handling

### Node-Level Retry
\`\`\`json
{
  "retryOnFail": true,
  "maxTries": 3,
  "waitBetweenTries": 1000
}
\`\`\`

### Error Output Branch
Set \`onError: "continueErrorOutput"\` on a node to route errors to a second output:

\`\`\`
HTTP Request → (success) → Process Result
            ↘ (error)   → Handle Error → Notify Admin
\`\`\`

### Error Workflow
Configure in workflow settings to catch unhandled execution failures:
\`\`\`json
{
  "settings": {
    "errorWorkflow": "error-handler-workflow-id"
  }
}
\`\`\`

The error workflow receives:
\`\`\`json
{
  "execution": { "id": "...", "url": "...", "retryOf": "...", "error": { "message": "...", "stack": "..." } },
  "workflow": { "id": "...", "name": "..." }
}
\`\`\`

### Try/Catch Pattern
Wrap risky operations in error branches and use Merge to continue regardless:

\`\`\`
→ HTTP Request (onError: continueErrorOutput)
    → (success) → Merge → Continue
    → (error)   → Set Default → Merge
\`\`\`

## Expressions Reference

### Data Access
\`\`\`
{{ $json }}                              // current item's JSON data
{{ $json.nested.field }}                 // nested field access
{{ $json['field with spaces'] }}         // bracket notation
{{ $binary }}                            // current item's binary data
{{ $input.all() }}                       // all input items
{{ $input.first() }}                     // first input item
{{ $input.last() }}                      // last input item
{{ $input.item }}                        // current item in loop
{{ $('Node Name').all() }}               // all items from a specific node
{{ $('Node Name').first().json.field }}  // specific field from a node
{{ $('Node Name').params.fieldName }}    // node parameter value
\`\`\`

### Built-in Variables
\`\`\`
{{ $now }}                     // current DateTime (Luxon)
{{ $today }}                   // today at midnight (Luxon)
{{ $runIndex }}                // current run index (0-based)
{{ $itemIndex }}               // current item index (0-based)
{{ $nodeVersion }}             // version of the current node
{{ $prevNode }}                // previous node info
{{ $execution.id }}            // execution ID
{{ $execution.resumeUrl }}     // URL to resume a waiting execution
{{ $workflow.id }}             // workflow ID
{{ $workflow.name }}           // workflow name
{{ $workflow.active }}         // whether workflow is active
{{ $vars.myVariable }}         // workflow variable
{{ $env.MY_ENV_VAR }}          // environment variable (if allowed)
\`\`\`

### Data Transformation Functions

**String:**
\`\`\`
{{ "hello".toUpperCase() }}              // HELLO
{{ "Hello World".toSnakeCase() }}        // hello_world
{{ "hello".replaceAll('l', 'r') }}       // herro
{{ "hello@email.com".isEmail() }}        // true
{{ "not empty".isEmpty() }}              // false
{{ "hello world".extractUrl() }}         // extracts URL if present
{{ "<p>text</p>".stripTags() }}          // text
{{ "hello".hash('sha256') }}             // SHA-256 hash
\`\`\`

**Number:**
\`\`\`
{{ (1.5).ceil() }}                       // 2
{{ (1.5).floor() }}                      // 1
{{ (1.567).round(2) }}                   // 1.57
{{ (100).isEven() }}                     // true
{{ (1024).toFixed(2) }}                  // "1024.00"
\`\`\`

**Array:**
\`\`\`
{{ [1,2,3].length }}                     // 3
{{ ["a","b"].includes("a") }}            // true
{{ [3,1,2].sort() }}                     // [1,2,3]
{{ [1,2,3].reverse() }}                  // [3,2,1]
{{ [1,[2,3]].flatten() }}                // [1,2,3]
{{ [1,2,2,3].unique() }}                 // [1,2,3]
{{ ["a","b","c"].chunk(2) }}             // [["a","b"],["c"]]
{{ [1,2,3].average() }}                  // 2
{{ [1,2,3].sum() }}                      // 6
{{ [1,2,3].min() }}                      // 1
{{ [1,2,3].max() }}                      // 3
\`\`\`

**Object:**
\`\`\`
{{ $json.keys() }}                       // array of keys
{{ $json.values() }}                     // array of values
{{ $json.hasField('name') }}             // true/false
{{ $json.isEmpty() }}                    // true/false
{{ Object.keys($json).length }}          // number of fields
\`\`\`

**DateTime (Luxon):**
\`\`\`
{{ $now.toFormat('yyyy-MM-dd HH:mm') }}  // 2024-01-15 09:30
{{ $now.plus({ days: 7 }) }}             // 7 days from now
{{ $now.minus({ hours: 2 }) }}           // 2 hours ago
{{ $now.startOf('month') }}              // first of current month
{{ $now.endOf('month') }}                // last of current month
{{ $now.toISO() }}                       // ISO 8601 string
{{ $now.toMillis() }}                    // Unix timestamp (ms)
{{ $now.weekday }}                       // 1 (Mon) to 7 (Sun)
{{ DateTime.fromISO('2024-01-15') }}     // parse ISO date
{{ DateTime.fromFormat('15/01/2024', 'dd/MM/yyyy') }}  // parse custom format
\`\`\`

### JMESPath Queries
\`\`\`
{{ $jmespath($json, "items[*].name") }}              // all item names
{{ $jmespath($json, "items[?price > \`100\`]") }}      // filter by price
{{ $jmespath($json, "items[0:3]") }}                 // first 3 items
{{ $jmespath($json, "max_by(items, &price)") }}      // item with max price
{{ $jmespath($json, "sort_by(items, &name)") }}      // sort by name
{{ $jmespath($json, "length(items)") }}              // count items
\`\`\`

### Helper Functions
\`\`\`
{{ $if(condition, trueValue, falseValue) }}   // ternary
{{ $ifEmpty(value, fallback) }}               // fallback if empty/null
{{ $min(1, 2, 3) }}                           // 1
{{ $max(1, 2, 3) }}                           // 3
{{ $not(true) }}                              // false
\`\`\`

## HTTP Request Node

### GET with Authentication
\`\`\`json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/data",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendQuery": true,
    "queryParameters": {
      "parameters": [
        { "name": "page", "value": "={{ $json.page }}" }
      ]
    },
    "options": {
      "response": { "response": { "responseFormat": "json" } },
      "timeout": 10000,
      "batching": { "batch": { "batchSize": 10, "batchInterval": 1000 } }
    }
  }
}
\`\`\`

### POST with JSON Body
\`\`\`json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "POST",
    "url": "https://api.example.com/create",
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        { "name": "name", "value": "={{ $json.name }}" },
        { "name": "email", "value": "={{ $json.email }}" }
      ]
    },
    "options": {
      "response": { "response": { "responseFormat": "json" } }
    }
  }
}
\`\`\`

### Pagination
\`\`\`json
{
  "type": "n8n-nodes-base.httpRequest",
  "parameters": {
    "method": "GET",
    "url": "https://api.example.com/items",
    "options": {
      "pagination": {
        "paginationMode": "off",
        "paginationCompleteWhen": "responseIsEmpty",
        "limitPagesFetched": true,
        "maxRequests": 10
      }
    }
  }
}
\`\`\`

## Common Workflow Templates

### API Proxy (Webhook → Transform → Respond)
\`\`\`
Webhook (POST /api/proxy)
  → Set (transform request)
  → HTTP Request (call external API)
  → Set (transform response)
  → Respond to Webhook
\`\`\`

### Scheduled Data Sync
\`\`\`
Schedule Trigger (every hour)
  → HTTP Request (fetch from source)
  → SplitInBatches (batch of 50)
  → HTTP Request (upsert to destination)
  → [loop back]
  → Slack (notify completion)
\`\`\`

### Event-Driven Processing
\`\`\`
Webhook (receive event)
  → Switch (route by event type)
  → [Branch 1: created] → Process new item → DB Insert
  → [Branch 2: updated] → Process update → DB Update
  → [Branch 3: deleted] → Archive → DB Delete
  → [Fallback] → Log unknown event
\`\`\`

### AI-Powered Pipeline
\`\`\`
Form Trigger (user question)
  → AI Agent (process with LLM)
  → Set (format response)
  → Respond to Webhook
\`\`\`

### Error-Resilient Integration
\`\`\`
Schedule Trigger
  → HTTP Request (onError: continueErrorOutput)
      → (success) → Process → DB Insert
      → (error)   → Wait (5 min) → HTTP Request (retry)
                          → (success) → Process → DB Insert
                          → (error)   → Slack (alert team)
\`\`\`
`,

  "researcher/SKILL.md": `---
name: researcher
description: Deep research on any topic using web search, multiple sources, and synthesis. Use when the user wants to research a topic, investigate a question, compare technologies, understand a concept deeply, find best practices, or needs a well-sourced analysis. Triggers on "research", "investigate", "deep dive", "compare", "what are the best", "pros and cons", "how does X work".
argument-hint: [topic or question to research]
auto-activate: false
---

# Deep Researcher

You are an expert research analyst. Your job is to conduct thorough, multi-source research on any topic and deliver a well-organized, actionable summary with sources.

## Research Process

Follow this structured approach for every research task:

### Phase 1: Scope & Plan
1. Parse the research topic from \`$ARGUMENTS\`
2. Break the topic into 3-5 specific sub-questions that together answer the main question
3. Briefly share your research plan with the user before starting

### Phase 2: Gather (Parallel)
4. Launch **multiple parallel searches** to maximize coverage and speed:
   - Use \`WebSearch\` for each sub-question with varied search terms
   - Use different phrasings and angles for the same concept
   - Search for recent results, official docs, expert opinions, and community discussions
5. For the most promising results, use \`WebFetch\` to read full pages and extract detailed information
6. When researching code/libraries, also search the local codebase with \`Grep\`/\`Glob\` for existing usage patterns

### Phase 3: Analyze & Cross-Reference
7. Cross-reference claims across multiple sources — don't trust a single source
8. Note where sources agree, disagree, or provide unique insights
9. Identify gaps in your research and run follow-up searches to fill them
10. Distinguish between facts, expert opinions, and speculation

### Phase 4: Synthesize & Deliver
11. Organize findings into a clear, structured report (see Output Format below)
12. Include source URLs for every major claim
13. Highlight actionable takeaways and recommendations
14. Note any caveats, limitations, or areas where information was conflicting

## Output Format

Structure your research report like this:

\`\`\`
## Research: [Topic]

### TL;DR
2-3 sentence executive summary with the key finding.

### Key Findings
Organized by sub-topic with clear headers. Each finding should:
- State the insight clearly
- Provide supporting evidence
- Link to source(s)

### Comparison Table (when applicable)
| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| ...      | ...      | ...      | ...      |

### Recommendations
Actionable next steps based on the research.

### Sources
Numbered list of all sources referenced.
\`\`\`

## Critical Rules

1. **Always search before answering** — never rely solely on training data for factual claims
2. **Use at least 3-5 different searches** per research task to ensure breadth
3. **Fetch full pages** for the most relevant results — don't rely on search snippets alone
4. **Cross-reference** — a claim backed by multiple independent sources is stronger
5. **Cite sources** — every major finding should link to where it came from
6. **Be honest about uncertainty** — clearly mark speculation vs. confirmed facts
7. **Prefer recent sources** — prioritize content from the last 1-2 years when recency matters
8. **Parallelize searches** — use the Agent tool to run multiple research threads simultaneously when the topic is broad
9. **Adapt depth to the question** — a simple factual question needs 1-2 searches; a technology comparison needs 5-10+
10. **Don't pad** — if the answer is straightforward, deliver it concisely. Long reports are only valuable when the topic warrants depth

## Research Strategies by Type

| Research Type | Strategy |
|--------------|----------|
| **Technology comparison** | Search each option + "vs" comparisons + benchmarks + community opinions |
| **Best practices** | Official docs + style guides + expert blog posts + conference talks |
| **Bug investigation** | Error messages + GitHub issues + Stack Overflow + release notes |
| **Architecture decisions** | Case studies + documentation + trade-off analyses + real-world examples |
| **Library/tool evaluation** | npm/PyPI stats + GitHub activity + docs quality + migration stories |
| **Concept explanation** | Official docs + tutorials + academic sources + visual explanations |

## How to Invoke

Run \`/researcher [your topic or question]\`

Examples:
- \`/researcher best state management libraries for React in 2025\`
- \`/researcher how does WebSocket connection pooling work\`
- \`/researcher pros and cons of monorepo vs polyrepo for a 10-person team\`
- \`/researcher compare Bun vs Node.js vs Deno for production APIs\`
`,

  "scalability/SKILL.md": `---
name: scalability
description: Design and build scalable software systems. Use when writing database queries, caching logic, API endpoints, message queues, background jobs, connection pools, load balancing, microservices, or when reviewing code for performance bottlenecks. Covers database scaling, caching strategies, async processing, API design for scale, concurrency, frontend performance, observability, and infrastructure patterns.
argument-hint: [area to scale or optimize]
---

# Software Scalability

You are an expert at building systems that handle growth without rewriting. You focus on identifying real bottlenecks before optimizing, and you choose the simplest solution that solves the actual problem.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive patterns:

- \`database-scaling.md\` — Indexing, query optimization, connection pooling, read replicas, partitioning, sharding, N+1 prevention
- \`caching-and-queues.md\` — Redis patterns, cache invalidation, message queues, async processing, event-driven architecture
- \`api-and-services.md\` — Pagination, rate limiting, circuit breakers, graceful shutdown, load balancing, stateless design
- \`infrastructure.md\` — Kubernetes autoscaling, serverless patterns, CDN caching, deployments, health checks, observability

## The Scalability Mindset

**Rule #1: Don't optimize what you haven't measured.** Profile first, then fix the actual bottleneck.

### Bottleneck Identification Flow

\`\`\`
Slow response times?
  ↓
Where is time spent?
  ├─ Database (>50% of request time) → See database-scaling.md
  │   ├─ Missing index → Add targeted index
  │   ├─ N+1 queries → Use eager loading / joins
  │   ├─ Full table scans → Add WHERE clauses, pagination
  │   └─ Connection exhaustion → Add connection pooling
  ├─ External API calls → See api-and-services.md
  │   ├─ Slow downstream → Add caching or circuit breaker
  │   └─ Too many calls → Batch or queue
  ├─ CPU-bound computation → See infrastructure.md
  │   ├─ Can parallelize → Worker threads / cluster mode
  │   └─ Can defer → Move to background queue
  └─ Memory pressure → Profile allocations
      ├─ Large payloads → Stream instead of buffer
      └─ Memory leaks → Heap snapshot analysis
\`\`\`

## Quick Wins — The 80/20 of Scaling

These solve most scaling problems before you need anything complex:

### 1. Add the Right Index
\`\`\`sql
-- Compound index: equality fields first, then range, then sort
CREATE INDEX idx_orders_lookup
ON orders(customer_id, status, created_at DESC);

-- Partial index: index only what you query
CREATE INDEX idx_active_users
ON users(email) WHERE status = 'active';
\`\`\`

### 2. Fix N+1 Queries
\`\`\`typescript
// BAD: 1 + N queries
const users = await prisma.user.findMany();
for (const u of users) u.posts = await prisma.post.findMany({ where: { authorId: u.id } });

// GOOD: 2 queries total
const users = await prisma.user.findMany({ include: { posts: true } });
\`\`\`

### 3. Add Caching Where It Matters
\`\`\`typescript
async function getUser(id: string) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await db.user.findUnique({ where: { id } });
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user)); // 5min TTL
  return user;
}
\`\`\`

### 4. Use Cursor Pagination
\`\`\`typescript
// Offset pagination degrades: O(offset + limit) — page 1000 scans 100K rows
// Cursor pagination is constant: O(limit) regardless of page

const results = await prisma.post.findMany({
  take: 20,
  cursor: lastId ? { id: lastId } : undefined,
  skip: lastId ? 1 : 0,
  orderBy: { id: 'asc' }
});
\`\`\`

### 5. Queue Heavy Work
\`\`\`typescript
// Instead of processing inline (blocks response)
app.post('/upload', async (req, res) => {
  await queue.add('process-upload', { fileId: req.body.fileId });
  res.json({ status: 'queued' }); // Respond immediately
});
\`\`\`

### 6. Connection Pooling
\`\`\`
Pool size = (CPU cores × 2) + 1
4 cores → 9 connections
8 cores → 17 connections
\`\`\`

## Scaling Decision Matrix

| Symptom | First Try | Then Try | Last Resort |
|---------|-----------|----------|-------------|
| Slow queries | Add indexes, fix N+1 | Read replicas, caching | Sharding |
| High DB connections | Connection pooling | PgBouncer/ProxySQL | Read replicas |
| API response time | Caching, pagination | Async processing | Microservices |
| Traffic spikes | Rate limiting, CDN | Auto-scaling (HPA) | Queue-based load leveling |
| CPU saturation | Worker threads, optimize code | Horizontal scaling | Vertical scaling |
| Memory pressure | Stream large data, fix leaks | Increase instance size | Offload to external cache |

## Thresholds — When to Act

| Metric | Healthy | Warning | Critical |
|--------|---------|---------|----------|
| p99 latency | < 200ms | 200-500ms | > 500ms |
| DB cache hit ratio | > 99% | 95-99% | < 95% |
| DB connection utilization | < 60% | 60-80% | > 80% |
| CPU utilization | < 50% | 50-70% | > 70% |
| Memory utilization | < 60% | 60-80% | > 80% |
| Error rate | < 0.1% | 0.1-1% | > 1% |
| Queue depth | Stable | Growing | Growing fast |
| Read:write ratio | N/A | > 10:1 consider replicas | > 50:1 must have replicas |

## Critical Rules

1. **Measure before optimizing** — Use EXPLAIN ANALYZE, profilers, APM tools; gut feelings are wrong
2. **Optimize the bottleneck** — 10x improvement on a non-bottleneck = 0x improvement
3. **Start simple, scale when needed** — Single DB → read replicas → sharding (not the reverse)
4. **Cache reads, queue writes** — Reads are cheap to cache; writes benefit from async processing
5. **Stateless by default** — Session state in Redis/DB, not in memory; enables horizontal scaling
6. **Fail gracefully** — Circuit breakers on external calls; timeout everything; have fallbacks
7. **Index surgically** — Every index costs write performance; only index what queries actually use
8. **Paginate everything** — No unbounded queries; cursor > offset for large datasets
9. **Pool connections** — Opening DB connections is expensive (5-50ms); reuse them
10. **Observe everything** — P99 latency, error rate, throughput, saturation; you can't fix what you can't see

Use \`$ARGUMENTS\` to focus on a specific scaling area. Read the relevant reference file before writing code.
`,

  "scalability/api-and-services.md": `# API Design & Service Resilience Reference

## Pagination

### Cursor-Based (Recommended for Scale)
\`\`\`typescript
// Constant performance regardless of page depth
app.get('/posts', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100
  const cursor = req.query.cursor;

  const posts = await prisma.post.findMany({
    take: limit + 1, // Fetch 1 extra to detect hasMore
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
    orderBy: { id: 'asc' }
  });

  const hasMore = posts.length > limit;
  const data = hasMore ? posts.slice(0, -1) : posts;

  res.json({
    data,
    pagination: {
      hasMore,
      nextCursor: hasMore ? data[data.length - 1].id : null
    }
  });
});
\`\`\`

### Offset-Based (Simple, Limited Scale)
\`\`\`typescript
// Performance degrades at high offsets (DB scans offset + limit rows)
app.get('/posts', async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = (page - 1) * limit;

  // DANGER: offset=100000 scans 100K rows to skip them
  if (offset > 10000) return res.status(400).json({ error: 'Use cursor pagination for deep pages' });

  const [data, total] = await Promise.all([
    prisma.post.findMany({ skip: offset, take: limit, orderBy: { id: 'asc' } }),
    prisma.post.count()
  ]);

  res.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
});
\`\`\`

**Rule:** Use cursor for APIs consumed by infinite scroll or programmatic clients. Use offset only for admin UIs where page numbers matter and data is small.

---

## Rate Limiting

### Tiered Rate Limiting
\`\`\`typescript
import rateLimit from 'express-rate-limit';

// Global: 100 req/15min per IP
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

// Auth: 5 attempts/15min (strict)
app.use('/auth/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
}));

// Per-tier limiting
app.use('/api/v1/', rateLimit({
  windowMs: 60 * 1000,
  max: (req) => {
    if (req.user?.tier === 'enterprise') return 5000;
    if (req.user?.tier === 'pro') return 1000;
    return 100;
  }
}));
\`\`\`

### Response Headers
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1700000000
Retry-After: 30
\`\`\`

---

## Circuit Breaker

### Implementation (Opossum)
\`\`\`typescript
import CircuitBreaker from 'opossum';

const paymentBreaker = new CircuitBreaker(
  async (userId: string, amount: number) => {
    return await paymentService.charge(userId, amount);
  },
  {
    timeout: 3000,                  // 3s timeout per call
    errorThresholdPercentage: 50,   // Open at 50% failure
    resetTimeout: 30000,            // Try again after 30s
    volumeThreshold: 10             // Min requests before calculating %
  }
);

// Fallback when circuit is open
paymentBreaker.fallback(() => ({ status: 'degraded', message: 'Payments temporarily unavailable' }));

// Use it
const result = await paymentBreaker.fire(userId, 99.99);

// Monitor
paymentBreaker.on('open', () => logger.error('Payment circuit OPEN'));
paymentBreaker.on('halfOpen', () => logger.warn('Payment circuit testing...'));
paymentBreaker.on('close', () => logger.info('Payment circuit recovered'));
\`\`\`

### Circuit Breaker States
\`\`\`
CLOSED ──(failures > threshold)──→ OPEN ──(resetTimeout)──→ HALF-OPEN
  ↑                                                             │
  └──────────(success)──────────────────────────────────────────┘
  └──────────────────────────────────(failure)──→ OPEN
\`\`\`

### Configuration Guidelines
- \`timeout\`: Set to p99 latency + 20% buffer
- \`errorThresholdPercentage\`: 50% for aggressive, 25% for conservative
- \`resetTimeout\`: 30-60s (match service recovery time)
- \`volumeThreshold\`: 10-20 (avoid opening on 1 failure)

---

## Graceful Shutdown

\`\`\`typescript
const server = http.createServer(app);
let shuttingDown = false;

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, draining...');
  shuttingDown = true;

  // 1. Stop accepting new connections
  server.close(async () => {
    // 2. Close DB, cache, queue connections
    await Promise.allSettled([
      prisma.$disconnect(),
      redis.quit(),
      worker.close()
    ]);
    process.exit(0);
  });

  // 3. Force exit after 30s if still draining
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
});

// Reject new requests during shutdown
app.use((req, res, next) => {
  if (shuttingDown) return res.status(503).json({ error: 'Shutting down' });
  next();
});
\`\`\`

---

## Load Balancing

### Strategy Selection

| Strategy | Use When |
|----------|----------|
| **Round Robin** | All instances are equal, stateless |
| **Least Connections** | Instances have varying capacity |
| **Consistent Hashing** | Need session affinity or cache locality |
| **Weighted** | Mixed instance sizes |

### Health Checks (Kubernetes)
\`\`\`yaml
# Startup: Is the app initialized?
startupProbe:
  httpGet: { path: /startup, port: 8080 }
  periodSeconds: 10
  failureThreshold: 30    # 5 min max startup

# Readiness: Can it handle traffic?
readinessProbe:
  httpGet: { path: /ready, port: 8080 }
  periodSeconds: 10
  failureThreshold: 3     # Remove after 3 failures

# Liveness: Is it alive? (restart if not)
livenessProbe:
  httpGet: { path: /health, port: 8080 }
  periodSeconds: 20
  failureThreshold: 3
\`\`\`

\`\`\`typescript
app.get('/ready', async (req, res) => {
  const dbOk = await prisma.$queryRaw\`SELECT 1\`.then(() => true).catch(() => false);
  const redisOk = await redis.ping().then(() => true).catch(() => false);
  const ready = dbOk && redisOk && !shuttingDown;
  res.status(ready ? 200 : 503).json({ ready, db: dbOk, redis: redisOk });
});

app.get('/health', (req, res) => res.json({ alive: true }));
\`\`\`

---

## Stateless Design

### Session Externalization
\`\`\`typescript
// WRONG: In-memory sessions (breaks with multiple instances)
const sessions = new Map();

// CORRECT: Redis-backed sessions
import session from 'express-session';
import RedisStore from 'connect-redis';

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, httpOnly: true, maxAge: 3600000 }
}));
\`\`\`

### Stateless Auth (JWT)
\`\`\`typescript
// No server-side state needed — token carries identity
const token = jwt.sign({ sub: userId, role: 'user' }, secret, { expiresIn: '15m' });

// Any instance can verify without shared state
const user = jwt.verify(token, secret);
\`\`\`

**JWT vs Redis Sessions:**
| Factor | JWT | Redis Sessions |
|--------|-----|----------------|
| Revocation | Hard (wait for expiry) | Instant (delete key) |
| Scalability | Excellent (no state) | Good (Redis cluster) |
| Token size | Large (payload in token) | Small (session ID only) |
| Server load | None | Redis lookup per request |

**Rule:** Use JWT for stateless APIs and microservices. Use Redis sessions when you need instant revocation (admin panels, security-sensitive apps).

---

## API Response Optimization

### Compression
\`\`\`typescript
import compression from 'compression';
app.use(compression({ threshold: 1024, level: 6 })); // Compress responses > 1KB
\`\`\`

### Field Selection
\`\`\`typescript
// Let clients request only fields they need
app.get('/users/:id', async (req, res) => {
  const fields = req.query.fields?.split(',') || ['id', 'name', 'email'];
  const allowed = ['id', 'name', 'email', 'avatar', 'role'];
  const select = Object.fromEntries(
    fields.filter(f => allowed.includes(f)).map(f => [f, true])
  );
  const user = await prisma.user.findUnique({ where: { id: req.params.id }, select });
  res.json({ data: user });
});
\`\`\`

### Batch Endpoints
\`\`\`typescript
// Instead of N individual requests, batch them
app.post('/users/batch', async (req, res) => {
  const ids = req.body.ids;
  if (!Array.isArray(ids) || ids.length > 100) {
    return res.status(400).json({ error: 'Max 100 IDs per batch' });
  }
  const users = await prisma.user.findMany({ where: { id: { in: ids } } });
  res.json({ data: users });
});
\`\`\`
`,

  "scalability/caching-and-queues.md": `# Caching & Async Processing Reference

## Caching Strategies

### Cache-Aside (Lazy Loading) — Most Common
\`\`\`typescript
async function getUser(id: string) {
  // 1. Check cache
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  // 2. Cache miss → fetch from DB
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return null;

  // 3. Populate cache with TTL
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user)); // 5min
  return user;
}
\`\`\`
**Best for:** Read-heavy workloads, data that tolerates brief staleness.

### Write-Through (Immediate Consistency)
\`\`\`typescript
async function updateUser(id: string, data: Partial<User>) {
  // 1. Write to DB
  const user = await db.user.update({ where: { id }, data });

  // 2. Immediately update cache
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user));

  return user;
}
\`\`\`
**Best for:** Data that must be consistent between cache and DB.

### Write-Behind (Async Write)
\`\`\`typescript
async function updateUserFast(id: string, data: Partial<User>) {
  // 1. Write to cache (fast)
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify({ ...existing, ...data }));

  // 2. Queue DB write (async)
  await queue.add('sync-user-to-db', { id, data });

  return { ...existing, ...data };
}
\`\`\`
**Best for:** High-write throughput where brief inconsistency is acceptable.

### Cache Invalidation Patterns

| Pattern | How | When |
|---------|-----|------|
| **TTL expiry** | \`setex(key, 300, value)\` | Default — simple, predictable |
| **Explicit delete** | \`del(key)\` on write | When you need instant consistency |
| **Tag-based** | Group keys, purge by tag | Related entities (user + user's orders) |
| **Versioned keys** | \`user:\${id}:v\${version}\` | Avoid stale reads entirely |

### TTL Guidelines

| Data Type | TTL | Rationale |
|-----------|-----|-----------|
| User session | 1 hour | Security + memory |
| User profile | 5-15 min | Changes infrequently |
| Product catalog | 1-24 hours | Updates are batched |
| Config/feature flags | 30-60 sec | Needs fast propagation |
| Static assets (CDN) | 1 year | Versioned URLs |
| API responses | 1-60 min | Depends on freshness need |

---

## Redis Patterns

### Rate Limiting (Sliding Window)
\`\`\`typescript
async function rateLimit(userId: string, limit = 100, windowSec = 60) {
  const now = Date.now() / 1000;
  const window = Math.floor(now / windowSec);
  const key = \`rate:\${userId}:\${window}\`;
  const prevKey = \`rate:\${userId}:\${window - 1}\`;

  const [curr, prev] = await Promise.all([redis.get(key), redis.get(prevKey)]);
  const elapsed = (now % windowSec) / windowSec;
  const estimate = (parseInt(prev || '0') * (1 - elapsed)) + parseInt(curr || '0');

  if (estimate >= limit) return { allowed: false, retryAfter: Math.ceil(windowSec * (1 - elapsed)) };

  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, windowSec * 2);
  return { allowed: true, remaining: Math.max(0, limit - Math.ceil(estimate) - 1) };
}
\`\`\`

### Distributed Lock (Redlock)
\`\`\`typescript
async function withLock<T>(resource: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const lockValue = crypto.randomBytes(16).toString('hex');
  const acquired = await redis.set(\`lock:\${resource}\`, lockValue, 'NX', 'PX', ttlMs);

  if (acquired !== 'OK') throw new Error('Could not acquire lock');

  try {
    return await fn();
  } finally {
    // Release only if we still own it (Lua for atomicity)
    await redis.eval(
      \`if redis.call("get",KEYS[1]) == ARGV[1] then return redis.call("del",KEYS[1]) else return 0 end\`,
      1, \`lock:\${resource}\`, lockValue
    );
  }
}

// Usage: prevent duplicate processing
await withLock(\`process:order:\${orderId}\`, 30000, async () => {
  await processOrder(orderId);
});
\`\`\`

### Session Storage
\`\`\`typescript
async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomUUID();
  await redis.setex(\`session:\${sessionId}\`, 3600, JSON.stringify({
    userId, createdAt: Date.now()
  }));
  return sessionId;
}

async function getSession(sessionId: string) {
  const data = await redis.get(\`session:\${sessionId}\`);
  if (!data) return null;
  // Extend TTL on access (sliding expiration)
  await redis.expire(\`session:\${sessionId}\`, 3600);
  return JSON.parse(data);
}
\`\`\`

### Sorted Set (Leaderboards / Rankings)
\`\`\`typescript
// Add score
await redis.zadd('leaderboard', score, \`user:\${userId}\`);

// Top 10
const top10 = await redis.zrevrange('leaderboard', 0, 9, 'WITHSCORES');

// User's rank
const rank = await redis.zrevrank('leaderboard', \`user:\${userId}\`);
\`\`\`

---

## Message Queues

### When to Use a Queue

| Scenario | Queue? | Why |
|----------|--------|-----|
| Email sending | Yes | Slow, can fail, user doesn't wait |
| Image processing | Yes | CPU-heavy, decouple from request |
| Payment processing | Maybe | Depends on UX (sync for checkout) |
| Webhook delivery | Yes | External service may be down |
| Report generation | Yes | Long-running, deliver async |
| Real-time chat | No | Use WebSockets/SSE instead |
| Simple CRUD | No | Adds unnecessary complexity |

### BullMQ (Node.js + Redis)
\`\`\`typescript
import { Queue, Worker } from 'bullmq';

// Producer
const emailQueue = new Queue('email', { connection: { host: 'redis' } });

await emailQueue.add('welcome', { to: 'user@example.com', name: 'John' }, {
  attempts: 3,
  backoff: { type: 'exponential', delay: 1000 },
  removeOnComplete: 1000,
  removeOnFail: 5000
});

// Consumer
const worker = new Worker('email', async (job) => {
  await sendEmail(job.data.to, job.data.name);
}, {
  connection: { host: 'redis' },
  concurrency: 5,
  limiter: { max: 10, duration: 1000 } // 10 per second
});

worker.on('completed', (job) => console.log(\`Done: \${job.id}\`));
worker.on('failed', (job, err) => console.error(\`Failed: \${job?.id}\`, err));
\`\`\`

### Queue-Based Load Leveling
\`\`\`
Spike: 10,000 req/s ─→ Queue (buffer) ─→ Workers process at 1,000/s
                                          (auto-scale based on queue depth)
\`\`\`

\`\`\`typescript
// Producer: Enqueue immediately, respond fast
app.post('/process', async (req, res) => {
  const job = await queue.add('process', req.body);
  res.json({ jobId: job.id, status: 'queued' });
});

// Consumer: Process at sustainable rate
const worker = new Worker('process', async (job) => {
  await heavyProcessing(job.data);
}, { concurrency: 10 });
\`\`\`

---

## Event-Driven Architecture

### Pub/Sub Pattern
\`\`\`typescript
// Publisher (doesn't know who listens)
await redis.publish('order:created', JSON.stringify({ orderId, userId, total }));

// Subscriber 1: Send confirmation email
redis.subscribe('order:created', (message) => {
  const order = JSON.parse(message);
  emailQueue.add('order-confirmation', order);
});

// Subscriber 2: Update analytics
redis.subscribe('order:created', (message) => {
  const order = JSON.parse(message);
  analyticsQueue.add('track-purchase', order);
});

// Subscriber 3: Notify warehouse
redis.subscribe('order:created', (message) => {
  const order = JSON.parse(message);
  warehouseQueue.add('prepare-shipment', order);
});
\`\`\`

### CQRS (Command Query Responsibility Segregation)
\`\`\`
Write path: API → Command Handler → Write DB (normalized)
                                  → Publish event
Read path:  API → Query Handler → Read DB/Cache (denormalized, optimized for reads)
                                  ← Event → Update read model
\`\`\`

\`\`\`typescript
// Write side: Normalize, validate, enforce business rules
async function createOrder(cmd: CreateOrderCommand) {
  const order = await writeDb.orders.create({ data: cmd });
  await eventBus.publish('order.created', order);
  return order.id;
}

// Read side: Denormalized, fast, optimized for specific queries
eventBus.subscribe('order.created', async (event) => {
  await readDb.orderViews.upsert({
    where: { orderId: event.id },
    create: {
      orderId: event.id,
      customerName: event.customerName, // Denormalized!
      total: event.total,
      itemCount: event.items.length
    }
  });
});

// Query the read model (no joins needed)
async function getOrderDashboard(customerId: string) {
  return readDb.orderViews.findMany({ where: { customerId } });
}
\`\`\`

**When CQRS is worth it:**
- Read and write patterns are very different
- Read:write ratio > 10:1
- Need different scaling strategies for reads vs writes
- Complex read queries that would require expensive joins

**When CQRS is overkill:**
- Simple CRUD applications
- Low traffic (< 1000 req/s)
- Read and write models are nearly identical
`,

  "scalability/database-scaling.md": `# Database Scaling Reference

## Indexing Strategy

### Index Type Selection

| Type | Use Case | Example |
|------|----------|---------|
| **B-tree** (default) | Equality, range, sorting | \`WHERE id = 1\`, \`ORDER BY date\` |
| **GIN** | Arrays, JSONB, full-text search | \`WHERE tags @> ARRAY['a']\` |
| **GiST** | Geometric, spatial, nearest-neighbor | PostGIS, \`ORDER BY location <->\` |
| **BRIN** | Large tables with natural ordering | Time-series > 100GB |

### Compound Index Rules

Order columns: **equality → range → sort**

\`\`\`sql
-- Query: WHERE customer_id = X AND status IN (...) AND created_at > Y ORDER BY id
CREATE INDEX idx_orders ON orders(customer_id, status, created_at, id);
\`\`\`

### Partial Indexes (index what you query)
\`\`\`sql
-- Only index active users (90% smaller, 90% faster writes)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';

-- Only index pending orders
CREATE INDEX idx_pending_orders ON orders(customer_id) WHERE status = 'pending';
\`\`\`

### Covering Indexes (avoid heap lookups)
\`\`\`sql
-- Query only needs total and date — include them in index
CREATE INDEX idx_orders_covering ON orders(customer_id)
INCLUDE (total, created_at);

-- This query is satisfied entirely by the index (index-only scan)
SELECT total, created_at FROM orders WHERE customer_id = 123;
\`\`\`

### Index Anti-Patterns
- Indexing every column (slows writes, wastes storage)
- Indexing low-cardinality columns alone (status with 3 values → useless)
- Missing indexes on foreign keys (kills JOIN performance)
- Unused indexes (check \`pg_stat_user_indexes\` for \`idx_scan = 0\`)

---

## Query Optimization

### EXPLAIN ANALYZE — Always Profile
\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, TIMING ON)
SELECT * FROM orders WHERE customer_id = 123 AND created_at > NOW() - INTERVAL '30d';
\`\`\`

**Red flags in output:**
- \`Seq Scan\` on large table → missing index
- \`Filter\` removes most rows → index should be more selective
- \`Sort\` with high cost → add index that matches ORDER BY
- \`Nested Loop\` with large outer table → consider hash/merge join

### pg_stat_statements — Find Problem Queries
\`\`\`sql
-- Top 10 slowest queries by total time
SELECT query, calls, total_exec_time / 1000 AS total_sec,
       mean_exec_time AS avg_ms,
       100.0 * shared_blks_hit / NULLIF(shared_blks_hit + shared_blks_read, 0) AS cache_pct
FROM pg_stat_statements
ORDER BY total_exec_time DESC LIMIT 10;

-- N+1 detector: queries called many times with low individual cost
SELECT query, calls, mean_exec_time AS avg_ms
FROM pg_stat_statements
WHERE calls > 1000 AND mean_exec_time < 5
ORDER BY calls DESC LIMIT 10;
\`\`\`

---

## N+1 Query Prevention

### Prisma
\`\`\`typescript
// BAD: 1 + N queries
const users = await prisma.user.findMany();
for (const u of users) {
  u.posts = await prisma.post.findMany({ where: { authorId: u.id } });
}

// GOOD: 2 queries (parallel fetch)
const users = await prisma.user.findMany({ include: { posts: true } });

// GOOD: Single query (database JOIN)
const users = await prisma.user.findMany({
  relationLoadStrategy: 'join',
  include: { posts: { select: { id: true, title: true } } }
});
\`\`\`

### TypeORM
\`\`\`typescript
// BAD: N+1
const users = await repo.find();
for (const u of users) u.posts = await postRepo.find({ where: { userId: u.id } });

// GOOD: JOIN
const users = await repo.createQueryBuilder('user')
  .leftJoinAndSelect('user.posts', 'posts')
  .getMany();
\`\`\`

### Drizzle (no N+1 by design)
\`\`\`typescript
const results = await db.select().from(users)
  .leftJoin(posts, eq(users.id, posts.userId));
\`\`\`

### Detection
Enable query logging and look for: **query count = 1 + N** where N = row count.

\`\`\`typescript
// Prisma query logging
const prisma = new PrismaClient({ log: [{ emit: 'event', level: 'query' }] });
prisma.$on('query', (e) => {
  if (e.duration > 100) console.warn(\`SLOW: \${e.duration}ms — \${e.query}\`);
});
\`\`\`

---

## Connection Pooling

### Sizing Formula
\`\`\`
pool_size = (CPU cores × 2) + effective_spindle_count

4-core  → 9 connections
8-core  → 17 connections
16-core → 33 connections
\`\`\`

### PgBouncer Configuration
\`\`\`ini
[pgbouncer]
pool_mode = transaction          # Release after each transaction
default_pool_size = 25           # Per database/user pair
min_pool_size = 10               # Keep warm
reserve_pool_size = 5            # Overflow buffer
max_client_connections = 1000    # Total client limit
server_idle_timeout = 600        # Close idle server connections (10min)
query_wait_timeout = 120         # Max wait for available connection
\`\`\`

### Application-Level (Prisma)
\`\`\`env
# Prisma uses internal pool; configure via connection string
DATABASE_URL="postgresql://user:pass@host/db?connection_limit=25&pool_timeout=10"
\`\`\`

### Connection Pool Monitoring
\`\`\`sql
-- PostgreSQL: Check active connections
SELECT count(*) FROM pg_stat_activity WHERE state = 'active';

-- Check connection limit
SHOW max_connections;

-- Per-database usage
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
\`\`\`

**Warning signs:** Pool utilization > 80%, rising wait times, connection timeouts.

---

## Read Replicas

### When to Add
- Read:write ratio exceeds **10:1**
- Primary CPU consistently > 70% from read queries
- Analytics queries competing with transactional reads

### Routing Pattern
\`\`\`typescript
// Simple: Route by operation type
const primaryPool = new Pool({ host: 'primary.db.com' });
const replicaPool = new Pool({ host: 'replica.db.com' });

async function query(sql: string, params: any[], opts?: { write?: boolean }) {
  const pool = opts?.write ? primaryPool : replicaPool;
  return pool.query(sql, params);
}

// Read from replica
const users = await query('SELECT * FROM users WHERE id = $1', [id]);

// Write to primary
await query('INSERT INTO users (name) VALUES ($1)', [name], { write: true });
\`\`\`

### Replication Lag
- Typical: 5-50ms for well-tuned async replication
- **Read-your-writes consistency**: After a write, read from primary for that user's session
- **Analytics queries**: Always safe on replicas (stale data acceptable)

---

## Partitioning

### When to Partition
- Table exceeds **100GB** or **100M+ rows**
- Queries always filter on a specific column (date, tenant)
- Need fast deletion of old data (\`DROP\` partition vs \`DELETE\`)

### Range Partitioning (time-series)
\`\`\`sql
CREATE TABLE events (
  id BIGSERIAL, created_at TIMESTAMPTZ NOT NULL, data JSONB
) PARTITION BY RANGE (created_at);

CREATE TABLE events_2025_01 PARTITION OF events
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE events_2025_02 PARTITION OF events
  FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Delete old data instantly
DROP TABLE events_2024_01; -- 0.01s vs DELETE which could take minutes
\`\`\`

### Hash Partitioning (even distribution)
\`\`\`sql
CREATE TABLE orders (id BIGSERIAL, customer_id INT, data JSONB)
PARTITION BY HASH (customer_id);

CREATE TABLE orders_0 PARTITION OF orders FOR VALUES WITH (MODULUS 4, REMAINDER 0);
CREATE TABLE orders_1 PARTITION OF orders FOR VALUES WITH (MODULUS 4, REMAINDER 1);
CREATE TABLE orders_2 PARTITION OF orders FOR VALUES WITH (MODULUS 4, REMAINDER 2);
CREATE TABLE orders_3 PARTITION OF orders FOR VALUES WITH (MODULUS 4, REMAINDER 3);
\`\`\`

**Rule:** Keep partition count under 500 — query planning overhead grows with partition count.

---

## Sharding

### When to Shard (Last Resort)
- Single database can't handle write volume
- Data exceeds what fits on one server (multi-TB)
- Need geographic data locality

### Sharding Strategies
| Strategy | Pros | Cons |
|----------|------|------|
| **Hash-based** | Even distribution | No range queries on shard key |
| **Range-based** | Range queries work | Hot shards if distribution skewed |
| **Tenant-based** | Strong isolation | Uneven if tenants vary in size |

### Before Sharding, Try These First
1. Add proper indexes
2. Fix N+1 queries
3. Add read replicas
4. Add caching layer
5. Partition large tables
6. Vertical scaling (bigger instance)
7. Archive old data
8. Optimize queries with EXPLAIN ANALYZE

---

## Denormalization

### Decision Matrix

| Scenario | Keep Normalized | Denormalize |
|----------|----------------|-------------|
| High write volume | Yes | No |
| High read volume, slow joins | No | Yes |
| Data consistency critical | Yes | No |
| Analytics / reporting | No | Yes (materialized views) |

### Materialized Views
\`\`\`sql
-- Precompute expensive aggregation
CREATE MATERIALIZED VIEW order_stats AS
SELECT customer_id, COUNT(*) AS order_count, SUM(total) AS total_spent
FROM orders GROUP BY customer_id;

-- Refresh periodically (not on every write)
REFRESH MATERIALIZED VIEW CONCURRENTLY order_stats;
-- CONCURRENTLY allows reads during refresh (requires unique index)

CREATE UNIQUE INDEX ON order_stats(customer_id);
\`\`\`

**Rule:** Start normalized. Denormalize specific queries only when EXPLAIN shows expensive joins that caching can't solve.
`,

  "scalability/infrastructure.md": `# Infrastructure Scaling Reference

## Kubernetes Autoscaling (HPA)

### Configuration
\`\`\`yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2            # Always 2+ for HA (never 1 in production)
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70    # Scale up at 70% CPU
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 0     # Scale up immediately
      policies:
      - type: Percent
        value: 100                       # Can double capacity
        periodSeconds: 15
    scaleDown:
      stabilizationWindowSeconds: 300   # Wait 5min before scaling down
      policies:
      - type: Percent
        value: 50                        # Max 50% reduction per cycle
        periodSeconds: 60
\`\`\`

### Resource Requests & Limits
\`\`\`yaml
resources:
  requests:                    # What HPA bases utilization on
    cpu: 250m                  # Reserve 250 milliCPU
    memory: 512Mi
  limits:
    cpu: 500m                  # Hard cap
    memory: 1Gi
\`\`\`

**Rules:**
- HPA measures % of **request**, not limit
- If request=250m, actual=175m → utilization=70% → triggers scale
- \`minReplicas: 2+\` in production (single pod = downtime during restart)
- Target utilization 50-70% gives spike headroom

### Custom Metrics Scaling
\`\`\`yaml
# Scale on queue depth instead of CPU
metrics:
- type: External
  external:
    metric:
      name: queue_depth
      selector:
        matchLabels:
          queue: email-processing
    target:
      type: AverageValue
      averageValue: "100"     # 1 pod per 100 queued messages
\`\`\`

---

## Serverless Patterns

### Cold Start Optimization
\`\`\`typescript
// Lazy-load heavy dependencies
let dbClient: PrismaClient | null = null;

export const handler = async (event: any) => {
  // Initialize only on first invocation (reused across warm invocations)
  if (!dbClient) {
    const { PrismaClient } = await import('@prisma/client');
    dbClient = new PrismaClient();
  }

  return dbClient.user.findMany();
};
\`\`\`

**Cold start costs by memory:**
| Memory | Cold Start | Cost/invocation |
|--------|-----------|----------------|
| 256MB | ~400ms | $0.0000004 |
| 512MB | ~280ms | $0.0000008 |
| 1024MB | ~150ms | $0.0000017 |

**Rule:** Allocate 1.5x typical memory usage — faster execution + faster cold starts.

### Provisioned Concurrency
- Cost: ~$0.015/unit/hour ($10.80/month per unit)
- Use only when: Cold start latency violates SLA
- Alternative: Keep a minimum of warm instances via scheduled pings

---

## CDN Caching

### Cache-Control Headers
\`\`\`typescript
// Static assets (versioned URLs — cache forever)
res.set('Cache-Control', 'public, max-age=31536000, immutable');

// API responses (cache at edge, short client cache)
res.set('Cache-Control', 'public, max-age=0, s-maxage=3600, stale-while-revalidate=60');

// Private/authenticated content
res.set('Cache-Control', 'private, max-age=300');

// Never cache
res.set('Cache-Control', 'no-store');
\`\`\`

### Header Reference

| Header | Meaning |
|--------|---------|
| \`max-age=N\` | Browser caches for N seconds |
| \`s-maxage=N\` | CDN caches for N seconds (overrides max-age at edge) |
| \`immutable\` | Never revalidate (use with hashed filenames) |
| \`stale-while-revalidate=N\` | Serve stale for N seconds while refreshing in background |
| \`private\` | Only browser caches (not CDN) — use for user-specific data |
| \`no-store\` | Never cache anywhere |

### Cache Busting via Content Hashing
\`\`\`javascript
// Webpack/Vite: Auto-hash filenames
output: { filename: '[name].[contenthash].js' }

// Result: app.a3f9d2c1.js → new hash on every change
// Combine with: Cache-Control: public, max-age=31536000, immutable
// No purging needed — new URL = new request
\`\`\`

---

## Deployments

### Blue-Green (Zero Downtime, Instant Rollback)
\`\`\`
1. Deploy v2 alongside v1 (both running)
2. Test v2 thoroughly
3. Switch load balancer: v1 → v2
4. Keep v1 for 1 hour (instant rollback)
5. Decommission v1
\`\`\`
**Tradeoff:** Requires 2x resources during deployment.

### Canary (Gradual, Lower Risk)
\`\`\`
1. Deploy v2 to 1 pod (5% traffic)
2. Monitor errors + latency for 5min
3. If healthy: ramp to 25% → 50% → 100%
4. If unhealthy: auto-rollback to v1
\`\`\`
\`\`\`yaml
# Flagger canary config
analysis:
  interval: 1m
  threshold: 5
  maxWeight: 50
  stepWeight: 10          # +10% per minute
  metrics:
  - name: request-success-rate
    thresholdRange: { min: 99 }   # Require 99%+ success
  - name: request-duration
    thresholdRange: { max: 500 }  # p99 < 500ms
\`\`\`

### Database Migrations in Deployments
\`\`\`sql
-- SAFE: Backward compatible (both versions work)
ALTER TABLE users ADD COLUMN new_field TEXT DEFAULT '';

-- UNSAFE: Breaks old version
ALTER TABLE users DROP COLUMN old_field;
ALTER TABLE users RENAME COLUMN name TO full_name;
\`\`\`

**Rule:** Always deploy in 3 phases:
1. Add new column (backward compatible)
2. Deploy new code that uses new column
3. Remove old column (after old code is gone)

---

## Observability

### The Four Golden Signals
| Signal | What to Measure | Alert When |
|--------|----------------|------------|
| **Latency** | p50, p95, p99 response time | p99 > 500ms |
| **Traffic** | Requests per second | Unusual spike or drop |
| **Errors** | Error rate (5xx / total) | > 1% error rate |
| **Saturation** | CPU, memory, DB connections, queue depth | > 80% utilization |

### Structured Logging
\`\`\`typescript
import pino from 'pino';
const logger = pino({ level: 'info' });

// GOOD: Structured, searchable
logger.info({ userId: '123', action: 'login', duration: 45 }, 'User logged in');
// Output: {"level":30,"userId":"123","action":"login","duration":45,"msg":"User logged in"}

// BAD: Unstructured
console.log(\`User 123 logged in in 45ms\`);
\`\`\`

### Request Tracing
\`\`\`typescript
import { v4 as uuid } from 'uuid';

// Middleware: Add trace ID to every request
app.use((req, res, next) => {
  req.traceId = req.headers['x-trace-id'] || uuid();
  res.setHeader('x-trace-id', req.traceId);
  next();
});

// Include in all logs
logger.info({ traceId: req.traceId, path: req.path }, 'Request started');

// Pass to downstream services
const response = await fetch('https://service-b.internal/api', {
  headers: { 'x-trace-id': req.traceId }
});
\`\`\`

### Key Metrics to Track

\`\`\`typescript
import { Counter, Histogram, Gauge } from 'prom-client';

// Request duration (histogram for percentiles)
const httpDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5]
});

// Error counter
const httpErrors = new Counter({
  name: 'http_errors_total',
  help: 'HTTP errors',
  labelNames: ['method', 'route', 'status']
});

// Active connections gauge
const dbConnections = new Gauge({
  name: 'db_active_connections',
  help: 'Active database connections'
});

// Middleware
app.use((req, res, next) => {
  const end = httpDuration.startTimer({ method: req.method, route: req.route?.path });
  res.on('finish', () => {
    end({ status: res.statusCode });
    if (res.statusCode >= 500) {
      httpErrors.inc({ method: req.method, route: req.route?.path, status: res.statusCode });
    }
  });
  next();
});
\`\`\`

---

## Concurrency Patterns

### Worker Threads (CPU-bound work)
\`\`\`typescript
import { Worker, isMainThread, parentPort } from 'worker_threads';

if (isMainThread) {
  // Main thread: Offload CPU-heavy work
  async function processImage(buffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(__filename, { workerData: { buffer } });
      worker.on('message', resolve);
      worker.on('error', reject);
    });
  }
} else {
  // Worker thread: Do the heavy lifting
  const { workerData } = require('worker_threads');
  const result = heavyImageProcessing(workerData.buffer);
  parentPort?.postMessage(result);
}
\`\`\`

### Cluster Mode (Multi-process)
\`\`\`typescript
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numWorkers = os.cpus().length;
  for (let i = 0; i < numWorkers; i++) cluster.fork();

  cluster.on('exit', (worker) => {
    console.error(\`Worker \${worker.process.pid} died, replacing...\`);
    cluster.fork();
  });
} else {
  // Each worker runs the HTTP server
  app.listen(3000);
}
\`\`\`

### Backpressure (Prevent Overload)
\`\`\`typescript
// Stream processing with backpressure
import { Transform } from 'stream';

const processor = new Transform({
  highWaterMark: 1000, // Buffer max 1000 chunks
  transform(chunk, encoding, callback) {
    processChunk(chunk)
      .then(result => callback(null, result))
      .catch(err => callback(err));
  }
});

// Pipeline automatically handles backpressure
inputStream.pipe(processor).pipe(outputStream);
\`\`\`

### Semaphore (Limit Concurrent Operations)
\`\`\`typescript
class Semaphore {
  private queue: (() => void)[] = [];
  private running = 0;

  constructor(private max: number) {}

  async acquire(): Promise<void> {
    if (this.running < this.max) { this.running++; return; }
    return new Promise(resolve => this.queue.push(resolve));
  }

  release(): void {
    this.running--;
    const next = this.queue.shift();
    if (next) { this.running++; next(); }
  }
}

// Limit to 10 concurrent DB operations
const sem = new Semaphore(10);
async function queryWithLimit(sql: string) {
  await sem.acquire();
  try { return await db.query(sql); }
  finally { sem.release(); }
}
\`\`\`

---

## Load Testing

### Before Optimizing, Profile
\`\`\`bash
# Quick load test with k6
k6 run --vus 50 --duration 30s script.js

# Artillery (Node.js)
npx artillery quick --count 50 --num 100 http://localhost:3000/api/users
\`\`\`

### What to Measure During Load Tests

| Metric | Tool | Warning Sign |
|--------|------|-------------|
| p99 latency | k6, Artillery | > 500ms |
| Throughput | k6 | Plateaus while CPU < 100% (IO bottleneck) |
| Error rate | k6 | > 0 (should be zero under expected load) |
| DB connections | pg_stat_activity | Near max_connections |
| Memory | top/htop | Continuously growing (leak) |
| CPU per process | top | Single core at 100% (need cluster mode) |

**Rule:** Test at 2x expected peak traffic. If it survives, you have margin.
`,

  "security/SKILL.md": `---
name: security
description: Secure web and desktop application development. Use when writing authentication, authorization, API endpoints, form handling, database queries, file uploads, Electron apps, Tauri apps, IPC handlers, cryptography, secrets management, security headers, input validation, or when reviewing code for vulnerabilities. Covers OWASP Top 10, XSS, CSRF, SQL injection, SSRF, command injection, path traversal, and desktop app security.
argument-hint: [area to secure or review]
---

# Application Security

You are a security-focused engineer. Every line of code you write or review must defend against real attack vectors. You don't add security theater — you implement defenses that stop actual exploits.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive patterns:

- \`web-security.md\` — XSS, CSRF, injection, SSRF, path traversal, input validation, security headers
- \`auth-and-secrets.md\` — Authentication, JWT, OAuth2 PKCE, API keys, password hashing, secrets management
- \`desktop-security.md\` — Electron and Tauri hardening, IPC security, auto-updater, deep links, sandboxing
- \`database-and-deps.md\` — SQL injection prevention, ORM security, connection management, dependency supply chain

## Security-First Mindset

When writing or reviewing code, always ask:

1. **What can an attacker control?** — Every external input is hostile: URL params, headers, cookies, form data, file uploads, WebSocket messages, deep links, IPC messages
2. **What's the blast radius?** — If this is exploited, what's the worst case? RCE > data theft > DoS > information leak
3. **Am I validating at the boundary?** — Validate where data enters the system, not deep inside

## Quick Reference: The Non-Negotiables

### Web Apps
\`\`\`
✗ NEVER concatenate user input into SQL, HTML, shell commands, or URLs
✗ NEVER use eval(), Function(), innerHTML with untrusted data
✗ NEVER store secrets in code, localStorage, or client-accessible locations
✗ NEVER disable CORS, CSP, or same-origin protections without justification
✗ NEVER use MD5/SHA1 for passwords — use Argon2id or bcrypt
✗ NEVER use Math.random() for security tokens — use crypto.randomBytes()
✗ NEVER trust client-side validation alone

✓ ALWAYS use parameterized queries (prepared statements, ORMs)
✓ ALWAYS set HttpOnly, Secure, SameSite on auth cookies
✓ ALWAYS escape output in the context it's rendered (HTML, JS, URL, CSS)
✓ ALWAYS validate and sanitize input at system boundaries
✓ ALWAYS use HTTPS + HSTS in production
✓ ALWAYS implement rate limiting on auth endpoints
✓ ALWAYS use CSP headers — start with default-src 'self'
\`\`\`

### Desktop Apps (Electron)
\`\`\`
✗ NEVER enable nodeIntegration in renderer
✗ NEVER disable contextIsolation or webSecurity
✗ NEVER expose raw ipcRenderer to renderer process
✗ NEVER use the remote module (deprecated, dangerous)
✗ NEVER load remote URLs without URL validation

✓ ALWAYS enable contextIsolation + sandbox
✓ ALWAYS use contextBridge with minimal, validated API surface
✓ ALWAYS validate IPC sender identity and message schema
✓ ALWAYS validate deep link URLs before processing
✓ ALWAYS use code signing for distribution
\`\`\`

### Desktop Apps (Tauri)
\`\`\`
✗ NEVER allow unrestricted shell execution
✗ NEVER use broad file system scopes
✗ NEVER skip command input validation (even with Rust types)

✓ ALWAYS use invoke() pattern (not raw events) for sensitive ops
✓ ALWAYS configure restrictive scopes (fs, http, shell)
✓ ALWAYS set CSP in tauri.conf.json
✓ ALWAYS define per-window capabilities (least privilege)
\`\`\`

## Vulnerability Response Patterns

When you detect a vulnerability in code:

| Vulnerability | Immediate Fix |
|--------------|---------------|
| SQL injection | Switch to parameterized queries |
| XSS (reflected/stored) | Escape output + add CSP header |
| Command injection | Use spawn() with array args, never exec() with strings |
| Path traversal | Resolve path, verify it starts with allowed directory |
| CSRF | Add SameSite=Strict cookies + CSRF tokens |
| SSRF | Validate URL against allowlist, block private IP ranges |
| Insecure auth cookie | Add HttpOnly, Secure, SameSite flags |
| Hardcoded secret | Move to env var, rotate the exposed secret |
| Weak password hash | Migrate to Argon2id with proper parameters |
| Electron nodeIntegration | Set false + enable contextIsolation + sandbox |

## Critical Rules

1. **Validate at boundaries** — Every system edge (HTTP, IPC, file read, DB query) needs validation
2. **Defense in depth** — Never rely on a single security control; layer defenses
3. **Principle of least privilege** — Grant minimum access needed; restrict tools, scopes, permissions
4. **Fail closed** — Errors should deny access, not grant it; default to rejection
5. **Never trust the client** — All client data is attacker-controlled until validated server-side
6. **Secrets never in code** — Use env vars, vaults, or OS keychains; rotate exposed secrets immediately
7. **Escape for the output context** — HTML entities for HTML, parameterized for SQL, array args for shell
8. **Use established crypto** — Argon2id for passwords, AES-256-GCM for encryption, crypto.randomBytes() for tokens
9. **Pin dependencies** — Use lock files, audit regularly, verify integrity with SRI for CDN resources
10. **Log security events** — Failed logins, permission denials, input validation failures; never log secrets

## Using This Skill

If \`$ARGUMENTS\` specifies an area (e.g., \`/security authentication\`), read the relevant reference file and focus there. Otherwise, apply security principles to whatever code you're currently writing or reviewing.

When reviewing existing code, scan for the vulnerability patterns in the reference files and flag each finding with severity (Critical/High/Medium/Low) and a concrete fix.
`,

  "security/auth-and-secrets.md": `# Authentication & Secrets Management Reference

## Password Hashing

### Argon2id (Recommended — 2025 standard)
\`\`\`javascript
const argon2 = require('argon2');

async function hashPassword(password) {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,   // 64 MB
    timeCost: 3,
    parallelism: 4
  });
}

async function verifyPassword(hash, password) {
  return argon2.verify(hash, password);
}

// Login — never reveal which field was wrong
async function login(email, password) {
  const user = await db.findUser(email);
  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    throw new Error('Invalid credentials'); // Same message for both cases
  }
  return user;
}
\`\`\`

### bcrypt (Acceptable alternative)
\`\`\`javascript
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 12; // Minimum 10, prefer 12+

const hash = await bcrypt.hash(password, SALT_ROUNDS);
const valid = await bcrypt.compare(password, hash);
\`\`\`

**Never use:** MD5, SHA1, SHA256 (without key stretching), or plain text for passwords.

---

## JWT Authentication

### Short-Lived Access + Refresh Token Pattern
\`\`\`javascript
const jwt = require('jsonwebtoken');

function createAccessToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
    algorithm: 'HS256'
  });
}

function createRefreshToken(userId) {
  return jwt.sign({ sub: userId }, process.env.REFRESH_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256'
  });
}

// Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Refresh endpoint — refresh token in HttpOnly cookie
app.post('/auth/refresh', (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccess = createAccessToken(decoded.sub);
    res.json({ accessToken: newAccess });
  } catch {
    res.clearCookie('refreshToken');
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});
\`\`\`

### JWT Security Rules
- Access tokens: 15 minutes max
- Refresh tokens: HttpOnly cookie, 7 days max, rotate on use
- Never store JWTs in localStorage (XSS-accessible)
- Always verify \`algorithm\` — don't accept \`none\`
- Include \`sub\` (subject), \`iat\` (issued at), \`exp\` (expiry) claims

---

## OAuth2 with PKCE

\`\`\`javascript
const crypto = require('crypto');

// Generate PKCE values
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

// Step 1: Redirect to provider
app.get('/auth/login', (req, res) => {
  const state = crypto.randomBytes(32).toString('base64url');
  req.session.oauthState = state;
  req.session.codeVerifier = codeVerifier;

  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID,
    redirect_uri: 'https://myapp.com/auth/callback',
    response_type: 'code',
    scope: 'openid profile email',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  res.redirect(\`https://provider.com/authorize?\${params}\`);
});

// Step 2: Handle callback
app.get('/auth/callback', async (req, res) => {
  // Verify state (CSRF protection)
  if (req.query.state !== req.session.oauthState) {
    return res.status(403).send('Invalid state');
  }

  const response = await fetch('https://provider.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: req.query.code,
      code_verifier: req.session.codeVerifier,
      client_id: process.env.OAUTH_CLIENT_ID,
      redirect_uri: 'https://myapp.com/auth/callback'
    })
  });

  const tokens = await response.json();
  // Verify ID token, create session
});
\`\`\`

---

## API Key Security

\`\`\`javascript
const crypto = require('crypto');

// Generate: prefix + random bytes
function generateApiKey() {
  return \`sk_live_\${crypto.randomBytes(32).toString('hex')}\`;
}

// Store: hash only, never plaintext
function hashApiKey(key) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

// Verify middleware
async function apiKeyAuth(req, res, next) {
  const key = req.headers.authorization?.replace('Bearer ', '');
  if (!key) return res.status(401).json({ error: 'Missing API key' });

  const hash = hashApiKey(key);
  const record = await db.apiKeys.findOne({ hash });
  if (!record) return res.status(401).json({ error: 'Invalid API key' });

  req.userId = record.userId;
  next();
}
\`\`\`

---

## Rate Limiting

\`\`\`javascript
const rateLimit = require('express-rate-limit');

// General API limiter
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
}));

// Strict auth limiter
app.use('/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: { error: 'Too many login attempts, try again later' }
}));

// Tiered limiting
app.use('/api/v1/', rateLimit({
  windowMs: 60 * 1000,
  max: (req) => {
    if (req.user?.tier === 'premium') return 1000;
    if (req.user?.tier === 'pro') return 500;
    return 100;
  }
}));
\`\`\`

---

## Secrets Management

### Environment Variables
\`\`\`javascript
require('dotenv').config();

// Validate required secrets at startup
const REQUIRED = ['JWT_SECRET', 'DB_PASSWORD', 'OAUTH_CLIENT_SECRET'];
for (const key of REQUIRED) {
  if (!process.env[key]) {
    console.error(\`Missing required env var: \${key}\`);
    process.exit(1);
  }
}

// Never log secrets
function sanitizeForLogging(env) {
  const sensitive = ['PASSWORD', 'SECRET', 'KEY', 'TOKEN'];
  return Object.fromEntries(
    Object.entries(env).map(([k, v]) => [
      k, sensitive.some(s => k.includes(s)) ? '[REDACTED]' : v
    ])
  );
}
\`\`\`

### .env Security
\`\`\`bash
# .env.example (committed — no real values)
DB_PASSWORD=CHANGE_ME
JWT_SECRET=CHANGE_ME

# .env (gitignored — real values)
DB_PASSWORD=actual-secret
JWT_SECRET=actual-secret
\`\`\`

**.gitignore must contain:**
\`\`\`
.env
.env.local
.env.*.local
*.pem
*.key
\`\`\`

---

## Cryptography Essentials

### Secure Random Generation
\`\`\`javascript
const crypto = require('crypto');

// Session tokens, CSRF tokens, API keys
const token = crypto.randomBytes(32).toString('hex');

// Numeric codes (OTP, verification)
const code = crypto.randomInt(100000, 999999).toString();

// NEVER use Math.random() for security purposes
\`\`\`

### AES-256-GCM Encryption
\`\`\`javascript
const ALGO = 'aes-256-gcm';

function encrypt(plaintext, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

function decrypt(ciphertext, key) {
  const buf = Buffer.from(ciphertext, 'base64');
  const iv = buf.subarray(0, 16);
  const tag = buf.subarray(16, 32);
  const encrypted = buf.subarray(32);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  return decipher.update(encrypted, undefined, 'utf8') + decipher.final('utf8');
}
\`\`\`

### Crypto Rules
- **Passwords**: Argon2id (preferred) or bcrypt (minimum rounds: 12)
- **Encryption**: AES-256-GCM (authenticated encryption)
- **Hashing**: SHA-256 for integrity, HMAC-SHA256 for signatures
- **Randomness**: Always \`crypto.randomBytes()\`, never \`Math.random()\`
- **Key derivation**: \`crypto.scryptSync()\` or HKDF
- **Never**: Roll your own crypto, use ECB mode, use MD5/SHA1 for security
`,

  "security/database-and-deps.md": `# Database & Dependency Security Reference

## SQL Injection Prevention

### Parameterized Queries (Every Database)

\`\`\`javascript
// PostgreSQL (pg)
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1 AND org_id = $2',
  [email, orgId]
);

// MySQL (mysql2)
const [rows] = await connection.execute(
  'SELECT * FROM users WHERE email = ? AND org_id = ?',
  [email, orgId]
);

// SQLite (better-sqlite3)
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
\`\`\`

### ORM Security

\`\`\`javascript
// Prisma — safe by default
const user = await prisma.user.findUnique({ where: { id: userId } });
const users = await prisma.user.findMany({
  where: { name: { contains: searchTerm } } // Auto-parameterized
});

// DANGER: Raw queries bypass ORM protection
// Only use when necessary, ALWAYS parameterize
const result = await prisma.$queryRaw\`
  SELECT * FROM users WHERE id = \${userId}
\`; // Tagged template — Prisma parameterizes this

// WRONG — string concatenation in raw query
// await prisma.$queryRawUnsafe(\`SELECT * FROM users WHERE id = \${userId}\`);
\`\`\`

\`\`\`javascript
// Knex — query builder (safe)
const users = await knex('users')
  .where('email', email)
  .andWhere('status', 'active')
  .select('id', 'name', 'email');

// Knex — raw (parameterize manually)
const users = await knex.raw('SELECT * FROM users WHERE id = ?', [userId]);
\`\`\`

\`\`\`javascript
// TypeORM
const user = await userRepo.findOne({ where: { id: userId } });

// TypeORM — QueryBuilder (safe)
const users = await userRepo
  .createQueryBuilder('user')
  .where('user.email = :email', { email })
  .getMany();
\`\`\`

### MongoDB Injection Prevention

\`\`\`javascript
// Mongoose — safe with schema validation
const user = await User.findById(userId); // ObjectId validated

// DANGER: $where and $regex with user input
// WRONG:
// await User.find({ $where: \`this.name == '\${name}'\` });

// CORRECT: Use structured queries
await User.find({ name: { $eq: name } });

// Sanitize query operators — block $ prefix in user input
function sanitizeMongoInput(input) {
  if (typeof input === 'object' && input !== null) {
    for (const key of Object.keys(input)) {
      if (key.startsWith('$')) delete input[key];
    }
  }
  return input;
}
\`\`\`

---

## Connection Security

### Encrypted Connections
\`\`\`javascript
// PostgreSQL with SSL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true, // Verify server certificate
    ca: fs.readFileSync('/path/to/ca-cert.pem')
  },
  max: 20
});

// MySQL with SSL
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }
});
\`\`\`

### Connection String Security
\`\`\`javascript
// NEVER hardcode credentials
// WRONG: const db = connect('postgres://admin:password@host/db');

// Use env vars
const db = connect(process.env.DATABASE_URL);

// Validate at startup
if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}
\`\`\`

### Connection Pool Limits
\`\`\`javascript
const pool = new Pool({
  max: 20,                          // Max connections
  idleTimeoutMillis: 30000,         // Close idle connections after 30s
  connectionTimeoutMillis: 5000,    // Fail fast if can't connect
  allowExitOnIdle: true
});

// Always release connections
const client = await pool.connect();
try {
  const result = await client.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows;
} finally {
  client.release(); // ALWAYS release, even on error
}
\`\`\`

---

## Field-Level Encryption

\`\`\`javascript
const crypto = require('crypto');

// Encrypt sensitive columns before storage
class FieldEncryption {
  constructor(masterKey) {
    this.key = crypto.scryptSync(masterKey, 'field-encrypt-salt', 32);
  }

  encrypt(value) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', this.key, iv);
    const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }

  decrypt(ciphertext) {
    const buf = Buffer.from(ciphertext, 'base64');
    const iv = buf.subarray(0, 16);
    const tag = buf.subarray(16, 32);
    const data = buf.subarray(32);
    const decipher = crypto.createDecipheriv('aes-256-gcm', this.key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(data, undefined, 'utf8') + decipher.final('utf8');
  }
}

// Usage with ORM
const fieldCrypto = new FieldEncryption(process.env.FIELD_ENCRYPTION_KEY);

// Before save
user.ssn = fieldCrypto.encrypt(plainSSN);
await user.save();

// After read
const plainSSN = fieldCrypto.decrypt(user.ssn);
\`\`\`

---

## Dependency Supply Chain Security

### Lock Files — Always Commit
\`\`\`bash
# These MUST be in version control
package-lock.json    # npm
yarn.lock           # yarn
pnpm-lock.yaml      # pnpm
Cargo.lock          # Rust

# CI: Use lockfile-only installs
npm ci              # NOT npm install
yarn --frozen-lockfile
pnpm install --frozen-lockfile
\`\`\`

### Dependency Auditing
\`\`\`bash
# Run regularly (weekly minimum, on every CI build ideally)
npm audit
npm audit fix --audit-level=high

# More comprehensive tools
npx snyk test
npx retire

# Check for known malicious packages
npx npm-check-updates --upgrade
\`\`\`

### Version Pinning Strategy
\`\`\`json
{
  "dependencies": {
    "express": "4.18.2",       // Exact pin for critical deps
    "cors": "^2.8.5",          // Minor/patch for trusted deps
    "lodash": "~4.17.21"       // Patch only for stable deps
  }
}
\`\`\`

**Rules:**
- Pin exact versions for security-critical packages (auth, crypto, DB drivers)
- Use \`^\` for well-maintained packages you trust
- Never use \`*\` or \`latest\`
- Review changelogs before major version bumps

### Subresource Integrity (SRI) for CDN

\`\`\`html
<!-- Always use SRI for CDN-loaded scripts -->
<script
  src="https://cdn.example.com/lib.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5..."
  crossorigin="anonymous"
></script>

<!-- Generate SRI hash -->
<!-- openssl dgst -sha384 -binary lib.js | openssl base64 -A -->
\`\`\`

### .gitignore Security Essentials
\`\`\`
# Secrets — never commit
.env
.env.local
.env.*.local
*.pem
*.key
*.p12
credentials.json
service-account.json

# Dependencies — don't commit
node_modules/
vendor/

# Build artifacts
.trigger/
dist/
build/
\`\`\`

### Supply Chain Attack Prevention
- Review new dependencies before adding (check maintainers, download count, last update)
- Use \`npm audit signatures\` to verify package provenance
- Enable 2FA on your npm account
- Use scoped packages for internal code (@myorg/package)
- Monitor for typosquatting (lodash vs l0dash)
- Consider using a private registry for critical projects
- Set up Dependabot or Renovate for automated security updates

---

## Database Security Checklist

- [ ] All queries use parameterized statements or ORM
- [ ] No raw SQL with string concatenation
- [ ] Database connections use SSL/TLS
- [ ] Connection strings from env vars, not hardcoded
- [ ] Connection pool limits configured
- [ ] Connections always released (try/finally pattern)
- [ ] Sensitive fields encrypted at rest
- [ ] Database user has minimum required privileges
- [ ] No default/weak database passwords
- [ ] Regular backups with encryption
- [ ] Audit logging for sensitive operations
`,

  "security/desktop-security.md": `# Desktop Application Security Reference

## Electron Security

### Secure Window Configuration
\`\`\`javascript
const win = new BrowserWindow({
  webPreferences: {
    contextIsolation: true,        // Separate JS contexts (MANDATORY)
    nodeIntegration: false,         // No Node.js in renderer (MANDATORY)
    sandbox: true,                  // OS-level sandboxing (MANDATORY)
    webSecurity: true,              // Same-origin policy (MANDATORY)
    enableRemoteModule: false,      // Deprecated, dangerous
    preload: path.join(__dirname, 'preload.js'),
    allowRunningInsecureContent: false
  }
});
\`\`\`

**What happens without these:**
- \`nodeIntegration: true\` → XSS becomes RCE (\`require('child_process').exec()\`)
- \`contextIsolation: false\` → Renderer can tamper with preload globals
- \`sandbox: false\` → Renderer has broader OS access
- \`webSecurity: false\` → Same-origin policy disabled, data theft possible

### Preload Script — Minimal API Surface

\`\`\`javascript
// preload.js — expose ONLY specific, validated functions
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  loadPreferences: () => ipcRenderer.invoke('prefs:load'),
  savePreferences: (prefs) => {
    if (!prefs || typeof prefs !== 'object') throw new Error('Invalid prefs');
    return ipcRenderer.invoke('prefs:save', prefs);
  },
  openExternal: (url) => {
    if (typeof url !== 'string') throw new Error('Invalid URL');
    return ipcRenderer.invoke('shell:open-external', url);
  }
  // NEVER expose: ipcRenderer directly, require(), process, fs
});
\`\`\`

### IPC Security — Validate Everything

\`\`\`javascript
// main.js
const { ipcMain, shell } = require('electron');

ipcMain.handle('prefs:load', async (event) => {
  // Validate sender
  if (event.sender !== mainWindow.webContents) {
    throw new Error('Unauthorized sender');
  }
  return loadPreferences();
});

ipcMain.handle('prefs:save', async (event, prefs) => {
  if (event.sender !== mainWindow.webContents) throw new Error('Unauthorized');

  // Schema validation
  if (!prefs || typeof prefs !== 'object') throw new Error('Invalid data');
  if (typeof prefs.theme !== 'string') throw new Error('Invalid theme');

  return savePreferences(prefs);
});

ipcMain.handle('shell:open-external', async (event, url) => {
  if (event.sender !== mainWindow.webContents) throw new Error('Unauthorized');

  // URL validation — only allow HTTPS
  try {
    const parsed = new URL(url);
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
  } catch { throw new Error('Invalid URL'); }

  return shell.openExternal(url);
});
\`\`\`

### CSP for Electron

\`\`\`javascript
// Set via webRequest (works with file:// protocol)
session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.myapp.com"
      ]
    }
  });
});
\`\`\`

### Deep Link Security

\`\`\`javascript
app.setAsDefaultProtocolClient('myapp');

app.on('open-url', (event, url) => {
  event.preventDefault();

  try {
    const parsed = new URL(url);

    // Validate protocol
    if (parsed.protocol !== 'myapp:') return;

    // Allowlist valid hosts
    const allowedHosts = ['auth', 'open', 'settings'];
    if (!allowedHosts.includes(parsed.hostname)) return;

    // Length limit
    if (url.length > 2000) return;

    // Sanitize params
    for (const [, value] of parsed.searchParams) {
      if (/[<>"'\`;]/.test(value)) return; // Block injection chars
    }

    handleDeepLink(parsed);
  } catch {
    // Invalid URL — silently ignore
  }
});
\`\`\`

### Auto-Updater Security

\`\`\`javascript
const { autoUpdater } = require('electron-updater');

// Always HTTPS, always signed
autoUpdater.on('update-downloaded', async (info) => {
  const { response } = await dialog.showMessageBox(mainWindow, {
    type: 'info',
    buttons: ['Restart Now', 'Later'],
    message: \`Update \${info.version} ready\`
  });
  if (response === 0) autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (err) => {
  // Never silently fail — don't install unverified updates
  console.error('Update failed:', err.message);
});

// Check after app is ready (not on startup — slows launch)
setTimeout(() => autoUpdater.checkForUpdates(), 30000);
\`\`\`

### Credential Storage

\`\`\`javascript
const { safeStorage } = require('electron');

function storeSecret(key, value) {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption not available');
  }
  const encrypted = safeStorage.encryptString(value);
  store.set(key, encrypted.toString('base64'));
}

function retrieveSecret(key) {
  const encrypted = Buffer.from(store.get(key), 'base64');
  return safeStorage.decryptString(encrypted);
}
\`\`\`

### WebView / BrowserView / iframe

**Preference order (most to least secure):**
1. **iframe with sandbox** — best isolation for web content
2. **BrowserView** — Chromium-level isolation
3. **WebView tag** — deprecated, avoid

\`\`\`javascript
// BrowserView with full security
const view = new BrowserView({
  webPreferences: {
    sandbox: true,
    contextIsolation: true,
    nodeIntegration: false
  }
});
\`\`\`

### Electron Vulnerability Checklist
- [ ] \`contextIsolation: true\`
- [ ] \`nodeIntegration: false\`
- [ ] \`sandbox: true\`
- [ ] \`webSecurity: true\`
- [ ] No \`remote\` module usage
- [ ] Preload uses \`contextBridge\` with minimal API
- [ ] IPC validates sender AND message schema
- [ ] Deep links validated against allowlist
- [ ] Auto-updater uses HTTPS + code signing
- [ ] CSP headers configured
- [ ] No \`eval()\` or \`Function()\` in renderer
- [ ] Credentials stored via \`safeStorage\`

---

## Tauri Security

### Command Security

\`\`\`rust
// Define commands with strict typing — Rust enforces at compile time
#[tauri::command]
async fn read_user_data(user_id: u32) -> Result<UserData, String> {
    if user_id == 0 {
        return Err("Invalid user ID".to_string());
    }
    db::get_user(user_id).map_err(|e| e.to_string())
}

// Register only needed commands
tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![read_user_data])
    .run(tauri::generate_context!())
    .expect("error running app");
\`\`\`

### Scope Configuration (tauri.conf.json)

\`\`\`json
{
  "app": {
    "security": {
      "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
    }
  },
  "plugins": {
    "fs": {
      "scope": [{ "path": "$APPDATA/**", "allow": ["read", "write"] }]
    },
    "http": {
      "scope": [
        { "allow": ["https://api.myapp.com/**"] },
        { "deny": ["https://api.myapp.com/admin/**"] }
      ]
    },
    "shell": {
      "scope": [{ "name": "open", "allow": ["open"] }]
    }
  }
}
\`\`\`

### Per-Window Capabilities

\`\`\`json
{
  "security": {
    "capabilities": [
      {
        "windows": ["main"],
        "permissions": ["core:default", "fs:allow-read:$APPDATA"]
      },
      {
        "windows": ["settings"],
        "permissions": ["core:default", "fs:allow-read:$APPCONFIG"]
      },
      {
        "windows": ["untrusted"],
        "permissions": []
      }
    ]
  }
}
\`\`\`

### Tauri Security Rules
- Use \`invoke()\` for sensitive operations (not events)
- Define restrictive scopes — deny by default
- Validate all command inputs even though Rust types help
- Configure CSP in tauri.conf.json
- Use per-window capabilities (least privilege)
- Audit third-party plugins before adding
- Code-sign all builds for distribution

### Tauri Vulnerability Checklist
- [ ] Commands validate all inputs
- [ ] File system scopes are restrictive
- [ ] HTTP scopes whitelist specific endpoints
- [ ] Shell scopes limit allowed commands
- [ ] CSP configured
- [ ] Per-window capabilities defined
- [ ] Plugins from trusted sources only
- [ ] Credentials in OS keychain (not plaintext files)
- [ ] Code signed for distribution
- [ ] Updates over HTTPS with signature verification

---

## Common Desktop Security Patterns

### Code Signing
- **Windows**: EV certificate (SmartScreen trusted) via Azure Key Vault
- **macOS**: Developer ID certificate + notarization
- **Linux**: GPG signing for packages
- **Never**: Commit private keys to version control

### Secure Auto-Update Flow
1. Check for updates over HTTPS only
2. Verify code signature of downloaded update
3. Verify checksum matches manifest
4. Ask user before installing (don't auto-install silently)
5. Fall back gracefully on verification failure

### Sandboxing Strategy
- Renderer processes: Always sandboxed
- Main process: Minimize direct OS access
- File access: Through validated IPC only
- Network access: Scoped to known endpoints
- Privileges: Minimum required per window/component
`,

  "security/web-security.md": `# Web Security Reference

## XSS (Cross-Site Scripting) Prevention

### Output Escaping by Context

**HTML context** — escape \`& < > " '\`:
\`\`\`javascript
const escapeHtml = (text) => {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, m => map[m]);
};
\`\`\`

**React/Vue/Svelte** — auto-escape by default. Dangerous exceptions:
\`\`\`jsx
// React: dangerouslySetInnerHTML — sanitize first
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />

// Vue: v-html — sanitize first
<div v-html="DOMPurify.sanitize(userContent)" />

// Svelte: {@html} — sanitize first
{@html DOMPurify.sanitize(html)}
\`\`\`

**URL context** — validate protocol:
\`\`\`javascript
function safeHref(url) {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol) ? url : '#';
  } catch { return '#'; }
}
\`\`\`

### Content Security Policy (CSP)

\`\`\`javascript
// Express + Helmet
const helmet = require('helmet');
app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('hex');
  next();
});

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", (req, res) => \`'nonce-\${res.locals.nonce}'\`],
    styleSrc: ["'self'", (req, res) => \`'nonce-\${res.locals.nonce}'\`],
    imgSrc: ["'self'", 'data:', 'https:'],
    connectSrc: ["'self'"],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: []
  }
}));
\`\`\`

**Never use:** \`'unsafe-inline'\`, \`'unsafe-eval'\`, or wildcard \`*\` for script-src.

---

## CSRF Prevention

### SameSite Cookies (primary defense)
\`\`\`javascript
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'Strict', // or 'Lax' for links from external sites
  maxAge: 3600000,
  path: '/'
});
\`\`\`

### CSRF Tokens (defense in depth)
\`\`\`javascript
const csrf = require('csurf');
app.use(csrf({ cookie: false })); // session-based, not cookie-based

// Include in forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// AJAX: send via header
fetch('/api/action', {
  method: 'POST',
  headers: { 'X-CSRF-Token': csrfToken },
  body: JSON.stringify(data)
});
\`\`\`

---

## Injection Prevention

### SQL — Always Parameterize
\`\`\`javascript
// Raw SQL — parameterized
db.query('SELECT * FROM users WHERE id = ? AND status = ?', [userId, status]);

// Knex query builder
const user = await knex('users').where({ id: userId }).first();

// Prisma ORM
const user = await prisma.user.findUnique({ where: { id: userId } });
\`\`\`

### Command — Never Concatenate
\`\`\`javascript
// WRONG: exec() parses through shell
exec(\`convert \${userFile} output.png\`); // command injection!

// CORRECT: spawn() with array args, no shell parsing
spawn('convert', [userFile, 'output.png']);

// CORRECT: execFile() — no shell
execFile('convert', [userFile, 'output.png']);
\`\`\`

### Path Traversal — Resolve and Verify
\`\`\`javascript
const path = require('path');
const UPLOADS_DIR = path.resolve('./uploads');

function safePath(userInput) {
  const resolved = path.resolve(UPLOADS_DIR, userInput);
  if (!resolved.startsWith(UPLOADS_DIR + path.sep) && resolved !== UPLOADS_DIR) {
    throw new Error('Path traversal blocked');
  }
  return resolved;
}
\`\`\`

---

## SSRF Prevention

\`\`\`javascript
function validateUrl(urlString) {
  const parsed = new URL(urlString);

  // HTTPS only
  if (parsed.protocol !== 'https:') return false;

  // Block private/internal IPs
  const blocked = ['localhost', '127.0.0.1', '0.0.0.0', '169.254', '10.', '172.16', '192.168', '[::1]'];
  if (blocked.some(b => parsed.hostname.startsWith(b) || parsed.hostname === b)) return false;

  // Allowlist approach (preferred)
  const allowed = ['api.example.com', 'cdn.example.com'];
  if (!allowed.includes(parsed.hostname)) return false;

  return true;
}
\`\`\`

---

## Input Validation

### Schema Validation (Zod example)
\`\`\`typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).trim(),
  age: z.number().int().min(0).max(150),
  role: z.enum(['user', 'admin']),
});

// In route handler
app.post('/users', (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  // result.data is typed and validated
});
\`\`\`

### File Upload Validation
\`\`\`javascript
const multer = require('multer');
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  }
});

// Don't trust file extension — verify magic bytes
import { fileTypeFromBuffer } from 'file-type';

async function validateFile(buffer) {
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !['image/jpeg', 'image/png', 'image/webp'].includes(type.mime)) {
    throw new Error('Invalid file type');
  }
}
\`\`\`

---

## Security Headers

### Complete Header Set
\`\`\`javascript
app.use(helmet()); // Sets most headers with sane defaults

// Additional manual headers
app.use((req, res, next) => {
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  next();
});

app.disable('x-powered-by');
\`\`\`

### Header Reference

| Header | Value | Purpose |
|--------|-------|---------|
| \`Strict-Transport-Security\` | \`max-age=31536000; includeSubDomains; preload\` | Force HTTPS |
| \`X-Content-Type-Options\` | \`nosniff\` | Block MIME sniffing |
| \`X-Frame-Options\` | \`DENY\` | Prevent clickjacking |
| \`Content-Security-Policy\` | \`default-src 'self'; script-src 'nonce-{N}'\` | XSS prevention |
| \`Referrer-Policy\` | \`strict-origin-when-cross-origin\` | Limit referrer leakage |
| \`Permissions-Policy\` | \`geolocation=(), camera=()\` | Restrict browser features |

---

## CORS Configuration

\`\`\`javascript
const cors = require('cors');

// WRONG: Allow everything
// app.use(cors()); // Allows all origins!

// CORRECT: Explicit allowlist
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));
\`\`\`

---

## iframe Security

\`\`\`html
<!-- Restrictive sandbox for untrusted content -->
<iframe
  src="https://trusted.com/embed"
  sandbox="allow-scripts allow-same-origin"
  allow="geolocation 'none'; camera 'none'; microphone 'none'"
  referrerpolicy="no-referrer"
></iframe>
\`\`\`

**postMessage validation:**
\`\`\`javascript
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://trusted.com') return; // Verify origin!
  // Process event.data
});
\`\`\`
`,

  "self-healing/SKILL.md": `---
name: self-healing
description: Continuously improve Claude's effectiveness by recognizing patterns, saving memory, creating skills, and refining project knowledge. Use when Claude notices repeated workflows, encounters a problem it solved before, wants to save something for future sessions, needs to create a reusable skill, or when the user asks Claude to improve itself, learn, remember, or get smarter over time.
argument-hint: [optional: specific area to improve or review]
---

# Self-Healing & Continuous Improvement

You are a metacognitive system — an expert at observing your own work patterns, extracting reusable knowledge, and evolving your capabilities over time. Your goal is to make every future session smarter than the last.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive guidance:

- \`memory-management.md\` — How to organize, maintain, and evolve memory files effectively
- \`skill-creation-guide.md\` — When and how to create new skills from discovered patterns
- \`pattern-recognition.md\` — How to detect actionable patterns and decide what to do with them

## When This Skill Activates

This skill should engage whenever you notice any of these signals:

1. **Déjà vu** — You're solving a problem you've seen before (or would have, if you remembered)
2. **Repeated workflow** — You've done the same sequence of steps 2+ times across sessions
3. **Hard-won knowledge** — You discovered something non-obvious that took real effort
4. **User correction** — The user corrected you on something you should remember
5. **Convention discovery** — You notice a codebase pattern that should be documented
6. **Explicit request** — The user asks you to improve, learn, remember, or optimize yourself

## Core Loop: Observe → Decide → Act → Verify

### 1. OBSERVE — Assess Current State

Before acting, gather context:

\`\`\`
Current memory state: Read MEMORY.md and scan topic files
Existing skills: Check .claude/skills/ for what already exists
Project conventions: Read CLAUDE.md for established rules
Recent work: What patterns emerged in this session?
\`\`\`

If \`$ARGUMENTS\` is provided, focus the observation on that specific area.

### 2. DECIDE — Choose the Right Action

Use this decision matrix:

| Signal | Action | Where |
|--------|--------|-------|
| Solved a tricky problem | Save to memory topic file | \`~/.claude/projects/*/memory/\` |
| User corrected me | Update or remove incorrect memory | MEMORY.md or topic file |
| Found a codebase convention | Document in memory or CLAUDE.md | Depends on team vs personal |
| Same workflow 2+ times | Create a new skill | \`.claude/skills/\` |
| Existing memory is stale/wrong | Edit or delete it | Memory files |
| Discovered useful external resource | Save URL + context to memory | Topic file |
| Built something complex | Extract the reusable pattern | Skill or memory |

### 3. ACT — Execute the Improvement

**For Memory Updates:**
- Read the existing MEMORY.md first — never write blind
- Keep MEMORY.md under 200 lines (only first 200 load automatically)
- Use MEMORY.md as an index; put details in topic files
- Link topic files from MEMORY.md: \`See debugging.md for details\`
- Use semantic organization (by topic, not by date)
- Remove outdated entries — stale memory is worse than no memory

**For Skill Creation:**
- Only create a skill when a pattern has clear reuse value
- Follow the structure: \`name/SKILL.md\` + optional reference files
- Keep SKILL.md under 300 lines; split into reference files if larger
- Write descriptions with trigger phrases for auto-activation
- Use \`\${CLAUDE_SKILL_DIR}\` for internal references, never hardcode paths
- Test mentally: "Would this auto-activate at the right moments?"

**For CLAUDE.md Updates:**
- Only add truly stable conventions (confirmed across multiple interactions)
- Keep entries concise — CLAUDE.md is loaded every session
- Prefer \`.claude/rules/\` files for path-specific conventions
- Never duplicate what's already in memory or skills

### 4. VERIFY — Confirm the Improvement

After acting, verify:
- [ ] Memory files are valid markdown and under size limits
- [ ] New skills have correct frontmatter and directory structure
- [ ] MEMORY.md index accurately reflects topic files
- [ ] No duplicate information across memory, skills, and CLAUDE.md
- [ ] Nothing sensitive (secrets, credentials) was persisted

## Critical Rules

1. **Read before writing** — Always read existing memory/skills before modifying
2. **No duplicates** — Check if knowledge already exists before creating it
3. **Correct mistakes immediately** — If memory is wrong, fix it now, not later
4. **Keep MEMORY.md as an index** — Details go in topic files, summaries in MEMORY.md
5. **200-line limit on MEMORY.md** — Only the first 200 lines load at session start
6. **300-line limit on SKILL.md** — Split into reference files for detailed content
7. **Semantic organization** — Group by topic, not chronology
8. **Delete stale knowledge** — Outdated memory causes more harm than gaps
9. **Skills need clear reuse value** — Don't create a skill for a one-off task
10. **Never persist secrets** — No API keys, tokens, passwords, or credentials in memory
11. **User corrections override everything** — When corrected, update memory immediately
12. **Prefer editing over creating** — Update existing files before creating new ones

## Self-Improvement Session (when explicitly invoked)

When the user runs \`/self-healing\` or asks you to improve yourself:

1. Read all memory files and assess their quality
2. Check existing skills — are any outdated or missing?
3. Review recent conversation for unrecorded learnings
4. Present a brief improvement plan to the user
5. Execute improvements with user approval
6. Summarize what was improved

Use \`$ARGUMENTS\` to focus on a specific area (e.g., \`/self-healing debugging patterns\` focuses only on debugging knowledge).
`,

  "self-healing/memory-management.md": `# Memory Management Reference

## Memory Architecture

\`\`\`
~/.claude/projects/<encoded-project-path>/memory/
├── MEMORY.md              # Index file (first 200 lines auto-loaded)
├── patterns.md            # Discovered code patterns
├── debugging.md           # Debugging strategies that worked
├── architecture.md        # Architecture decisions and rationale
├── conventions.md         # Codebase conventions discovered
├── tooling.md             # Build tools, scripts, CLI commands
├── external-resources.md  # Useful URLs, docs, references
└── [topic].md             # Any other topic-specific file
\`\`\`

### How Memory Loading Works

1. **Session start**: MEMORY.md lines 1–200 are injected into context automatically
2. **Topic files**: Never auto-loaded. Claude must explicitly Read them when needed
3. **Cross-session**: All memory persists across conversations in the same project
4. **Cross-worktree**: Memory is shared across git worktrees of the same repo

### The 200-Line Budget

MEMORY.md has a hard constraint: only the first 200 lines load. Use them wisely:

**Good MEMORY.md structure:**
\`\`\`markdown
# Project Memory

## Quick Reference
- Build: \`npm run build\` (takes ~45s)
- Test: \`npm test -- --watch\`
- Deploy: \`npm run deploy:staging\`
- DB: PostgreSQL 15, Redis 7

## Tech Stack
Next.js 14 (App Router), TypeScript, Prisma, TailwindCSS

## Key Patterns
See patterns.md for discovered code patterns
See conventions.md for codebase conventions

## Architecture Decisions
See architecture.md for ADRs and rationale

## Debugging
See debugging.md for strategies that worked

## Known Gotchas
- Auth middleware runs before API routes, not after
- Redis connection pool max is 10 in dev, 50 in prod
- Image uploads must go through /api/upload, not direct S3

## Recent Learnings
- [topic]: brief summary (see [file].md for details)
\`\`\`

**Anti-patterns:**
- Chronological entries ("March 5: did X, March 6: did Y")
- Entire code blocks in MEMORY.md (put in topic files)
- Duplicate entries scattered across the file
- Entries longer than 2 lines (summarize, link to topic file)

## When to Write Memory

### Always Save
- **User corrections**: When the user says "actually, it should be X" — save immediately
- **Non-obvious discoveries**: Things that took real effort to figure out
- **Environment specifics**: Build commands, deploy steps, required env vars
- **Recurring gotchas**: Traps you or the user fell into
- **Architecture decisions**: Why things are the way they are (not just what)

### Sometimes Save
- **Useful patterns**: Only if they're project-specific (not general knowledge)
- **External resources**: URLs to docs/guides that were actually helpful
- **User preferences**: Workflow preferences the user explicitly stated

### Never Save
- **Session-specific state**: What you're currently working on
- **Speculative conclusions**: Unverified assumptions from reading one file
- **General knowledge**: Things any developer would know
- **Secrets or credentials**: API keys, tokens, passwords — never persist these
- **Information in CLAUDE.md**: Don't duplicate what's already there

## Memory Hygiene Operations

### Audit (run periodically)
1. Read MEMORY.md — is everything still accurate?
2. Check each topic file — is anything outdated?
3. Look for duplicates across files
4. Verify links from MEMORY.md to topic files are valid
5. Check line count — is MEMORY.md under 200 lines?

### Prune
- Remove entries about code that no longer exists
- Delete topic files with no remaining valid entries
- Consolidate overlapping topic files
- Remove "learned on [date]" prefixes — dates aren't useful for reference

### Reorganize
- Move misplaced entries to the correct topic file
- Update MEMORY.md index when topic files change
- Merge small topic files (under 10 lines) into MEMORY.md directly
- Split large topic files (over 200 lines) into subtopics

## Memory Update Workflow

\`\`\`
1. Read MEMORY.md
2. Read relevant topic file (if it exists)
3. Decide: update existing entry, add new entry, or create new topic file
4. Make the edit (use Edit tool, not Write, for existing files)
5. If topic file changed, verify MEMORY.md index still references it
6. If MEMORY.md changed, verify it's under 200 lines
\`\`\`

## Topic File Template

\`\`\`markdown
# [Topic Name]

## [Subtopic]
- Key point with context
- Another point
  - Supporting detail if needed

## [Another Subtopic]
- Entries organized by relevance, not chronology
\`\`\`

Keep topic files focused. If a file covers too many unrelated things, split it.
`,

  "self-healing/pattern-recognition.md": `# Pattern Recognition Reference

## What Is a Pattern?

A pattern is any recurring element in your work that, if captured, would make future sessions faster, more accurate, or more consistent. Patterns exist at multiple levels:

### Code Patterns
- Repeated file structures or boilerplate
- Project-specific error handling approaches
- Naming conventions and code organization
- Import ordering and module structure
- Test file organization and helper utilities

### Workflow Patterns
- Sequences of tool calls you repeat (read → search → edit → test)
- Debugging approaches that consistently work for this project
- Build/test/deploy sequences
- Code review steps specific to the codebase

### Knowledge Patterns
- Non-obvious project facts that keep coming up
- Gotchas that cause repeated mistakes
- Architecture decisions that inform every change
- External API quirks and workarounds

### User Patterns
- How the user prefers to work (autonomous vs. confirmatory)
- Communication style preferences
- Common requests and their actual intent
- Tool and framework preferences

## Detection Signals

### Strong Signals (Act Immediately)
- **User correction**: "No, we always do it THIS way" → Save to memory NOW
- **Explicit request**: "Remember this for next time" → Save to memory NOW
- **Discovery after struggle**: Spent significant effort finding the answer → Save to memory
- **Configuration/environment fact**: Build commands, env vars, ports → Save to memory

### Medium Signals (Note and Watch)
- **Similar code in 2+ places**: Might be a convention worth documenting
- **Same debugging steps twice**: Emerging workflow pattern
- **Repeated search queries**: Knowledge gap that should be filled
- **User gives same instruction twice**: They expect you to remember

### Weak Signals (Observe Only)
- **One-off complex task**: Wait for repetition before acting
- **Experimental approach**: Too early to codify
- **External dependency behavior**: May change, verify before saving

## Pattern → Action Matrix

| Pattern Type | Frequency | Complexity | Action |
|-------------|-----------|------------|--------|
| Code convention | 1x confirmed | Any | Memory (conventions.md) |
| Workflow sequence | 2+ times | 3+ steps | Create skill |
| Workflow sequence | 2+ times | 1-2 steps | Memory or CLAUDE.md |
| Debugging strategy | 1x that worked well | Any | Memory (debugging.md) |
| User preference | 1x explicit request | Any | Memory (MEMORY.md) |
| Codebase gotcha | 1x discovered | Any | Memory (MEMORY.md) |
| Architecture decision | 1x confirmed | Any | Memory (architecture.md) |
| External resource | Used successfully | N/A | Memory (external-resources.md) |
| Repeated boilerplate | 3+ files with same structure | Moderate | Create skill |

## Self-Assessment Questions

Ask yourself these during and after each session:

### During Work
- "Have I done this exact sequence before?" → If yes, consider a skill
- "Did I just learn something non-obvious?" → Save to memory
- "Was I corrected on something?" → Update memory immediately
- "Am I searching for something I should already know?" → Memory gap

### End of Session
- "What would I want to know at the start of the next session?"
- "Did I discover any project conventions?"
- "Were there any surprises or gotchas?"
- "Is any existing memory now outdated?"

### Periodic Review
- "Is MEMORY.md still accurate and under 200 lines?"
- "Are there memory entries I haven't used in many sessions?"
- "Should any memory patterns be promoted to skills?"
- "Is CLAUDE.md missing any stable conventions?"

## Anti-Patterns to Avoid

### Over-Remembering
- Saving every minor detail clutters memory and reduces signal-to-noise
- General programming knowledge doesn't need to be in memory
- Temporary workarounds shouldn't become permanent memory

### Under-Acting
- Noticing a pattern but not saving it "because it might change"
- Waiting too long to create a skill from a clear repeated workflow
- Not correcting wrong memory because "it's close enough"

### Wrong Scope
- Putting personal preferences in project memory (use user-level)
- Putting project-specific conventions in personal skills (use project-level)
- Putting stable rules in memory instead of CLAUDE.md (memory is for learnings)

### Stale Knowledge
- The most dangerous pattern: memory that was once true but is now wrong
- Old architecture decisions that were reversed
- Deprecated commands or API endpoints
- Team members who left or roles that changed

**Rule: When in doubt about accuracy, delete the memory.** A gap is better than a lie.
`,

  "self-healing/skill-creation-guide.md": `# Skill Creation Guide (for Self-Healing)

## When to Create a Skill

A skill should be created when ALL of these are true:

1. **Repeated pattern**: The workflow has appeared 2+ times (or is clearly reusable)
2. **Non-trivial**: It involves multiple steps, decisions, or specialized knowledge
3. **Stable**: The pattern is unlikely to change significantly soon
4. **Not already covered**: No existing skill handles this workflow

**Do NOT create a skill for:**
- One-off tasks (save to memory instead)
- Simple commands (document in CLAUDE.md or memory)
- General programming knowledge (Claude already knows this)
- Unstable/experimental workflows (wait until they stabilize)

## Skill Creation Checklist

### 1. Choose the Type

| Type | When | Example |
|------|------|---------|
| **Task** | Performs actions, has side effects | deploy, migrate, publish |
| **Knowledge** | Provides reference context | api-patterns, style-guide |
| **Dynamic** | Injects live project state | pr-summary, env-check |
| **Research** | Gathers and synthesizes information | deep-dive, audit |

### 2. Determine Scope

- **Project** (\`.claude/skills/\`) — Default. Use when the pattern is project-specific
- **Personal** (\`~/.claude/skills/\`) — Use when the pattern applies across all projects

### 3. Write the Frontmatter

\`\`\`yaml
---
name: kebab-case-name          # Must match directory name
description: Action-oriented description with trigger phrases...
argument-hint: [what the user provides]
# Only add these when needed:
# auto-activate: false         # For dangerous operations
# user-invocable: false        # For pure knowledge skills
# allowed-tools: [Read, Grep]  # For read-only skills
---
\`\`\`

**Description quality matters most.** Claude uses it for auto-activation. Include:
- What the skill does (action verbs)
- When to use it (trigger phrases)
- Keywords users might say

### 4. Structure the SKILL.md

\`\`\`markdown
---
[frontmatter]
---

# Title

One-sentence role statement.

Reference to supporting files (if any):
Read \`\${CLAUDE_SKILL_DIR}/reference.md\` for details.

## Core Instructions
[Main guidance — specific and actionable]

## Critical Rules
[Numbered list, max 10-12]

## Quick Templates
[Minimal, copy-paste-ready patterns]

Final note about $ARGUMENTS usage.
\`\`\`

### 5. Add Supporting Files (if needed)

Create separate \`.md\` files when:
- Content exceeds ~50 lines
- Reference material is only needed on-demand
- Multiple code examples would bloat SKILL.md

Reference them with \`\${CLAUDE_SKILL_DIR}\`:
\`\`\`markdown
Read \`\${CLAUDE_SKILL_DIR}/api-patterns.md\` for the complete reference.
\`\`\`

### 6. Verify

- [ ] SKILL.md is under 300 lines
- [ ] Directory name matches \`name\` field
- [ ] Description includes trigger phrases
- [ ] Supporting files use \`\${CLAUDE_SKILL_DIR}\` references
- [ ] No hardcoded paths
- [ ] \`$ARGUMENTS\` is referenced for user input
- [ ] Templates are minimal (pattern, not full app)

## Skill from Pattern — Decision Flow

\`\`\`
Noticed a pattern?
  ↓
Has it appeared 2+ times? ──No──→ Save to memory instead
  ↓ Yes
Is it non-trivial (3+ steps)? ──No──→ Add to CLAUDE.md or memory
  ↓ Yes
Is it project-specific? ──No──→ Create in ~/.claude/skills/
  ↓ Yes
Create in .claude/skills/
\`\`\`

## Common Skill Patterns Worth Creating

- **Error handling workflows**: Project-specific debugging sequences
- **Code generation templates**: Repeated boilerplate with conventions
- **Review checklists**: PR review, security audit, performance review
- **Migration workflows**: Database, API version, framework upgrades
- **Testing patterns**: Project-specific test structure and utilities
- **Integration patterns**: How this project connects to external services

## Naming Conventions

- **Directories**: \`kebab-case\` (e.g., \`api-generator\`)
- **SKILL.md**: Always uppercase
- **Supporting files**: \`lowercase-kebab.md\` (e.g., \`api-patterns.md\`)
- **Scripts**: lowercase with extension (e.g., \`validate.sh\`)
`,

  "trigger-dev/SKILL.md": `---
name: trigger-dev
description: Build Trigger.dev background jobs, automations, and workflows in TypeScript. Use when the user wants to create tasks, scheduled jobs, AI agent workflows, queued background processing, cron jobs, or any long-running async work with Trigger.dev. Triggers on imports from @trigger.dev/sdk or mentions of trigger.dev.
argument-hint: [description of what to build]
---

# Trigger.dev Skill

You are an expert at building production-grade Trigger.dev v4 background tasks, workflows, and automations in TypeScript.

Read the detailed reference files in \`\${CLAUDE_SKILL_DIR}\` for comprehensive code patterns:

- \`core-reference.md\` — Tasks, runs, triggering, queues, concurrency, retries, errors, idempotency, wait functions
- \`config-reference.md\` — trigger.config.ts, build extensions, deployment, CLI, project structure, env vars, monorepos
- \`advanced-reference.md\` — AI integration, streams, realtime, middleware, locals, lifecycle hooks, metadata, tags, scheduled tasks

## Setup Checklist

If starting a new Trigger.dev project or adding to an existing one, refer to https://trigger.dev/docs/manual-setup and use the \`mcp__trigger__search_docs\` tool for the latest setup instructions. Core steps:

1. Install packages: \`npm add @trigger.dev/sdk@latest\` and \`npm add -D @trigger.dev/build@latest\`
2. Create \`trigger.config.ts\` at project root with \`defineConfig({ project: "<ref>", dirs: ["./src/trigger"] })\`
3. Add \`TRIGGER_SECRET_KEY\` to \`.env\`
4. Create task files in the configured \`dirs\` directory
5. Run \`npx trigger.dev@latest dev\` for local development
6. Deploy with \`npx trigger.dev@latest deploy\`

## Core Patterns

### Basic Task
\`\`\`typescript
import { task } from "@trigger.dev/sdk";

export const myTask = task({
  id: "my-task",
  run: async (payload: { data: string }, { ctx }) => {
    return { result: "done" };
  },
});
\`\`\`

### Schema-Validated Task
\`\`\`typescript
import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

export const myTask = schemaTask({
  id: "my-task",
  schema: z.object({ name: z.string(), age: z.number() }),
  run: async (payload) => { /* payload is typed and validated */ },
});
\`\`\`

### Scheduled Task (Cron)
\`\`\`typescript
import { schedules } from "@trigger.dev/sdk";

export const dailyCleanup = schedules.task({
  id: "daily-cleanup",
  cron: "0 0 * * *",
  run: async (payload) => {
    // payload.timestamp, payload.lastTimestamp, payload.timezone
  },
});
\`\`\`

### Trigger from Backend
\`\`\`typescript
import { tasks } from "@trigger.dev/sdk";
import type { myTask } from "~/trigger/my-task";

const handle = await tasks.trigger<typeof myTask>("my-task", { data: "hello" });
\`\`\`

### Trigger from Inside a Task
\`\`\`typescript
const result = await otherTask.triggerAndWait({ data: "hello" });
if (result.ok) console.log(result.output);
\`\`\`

## Critical Rules

1. **Task IDs must be unique** across the entire project
2. **Payloads and return values must be JSON serializable** — no classes, functions, or circular refs
3. **Always export tasks** from trigger files (unexported tasks become hidden/internal-only)
4. **Use type-only imports** when triggering from backend: \`import type { myTask } from "~/trigger/my-task"\`
5. **trigger.config.ts must be at the project root** — it cannot be nested
6. **Use \`AbortTaskRunError\`** to fail without retrying on permanent errors
7. **Wait functions are free** — tasks checkpoint during waits, no compute charges
8. **Concurrency limits only count actively executing runs** — delayed/waiting runs don't count
9. **Max 10 tags per run**, max 256KB metadata per run, max 1000 items per batch
10. **Use \`idempotencyKeys.create()\`** inside tasks to prevent duplicate child triggers during retries
11. **Use the \`mcp__trigger__search_docs\` tool** to look up the latest docs when unsure about any API
12. **Use \`mcp__trigger__deploy\`** to deploy tasks, **\`mcp__trigger__list_runs\`** to check runs, **\`mcp__trigger__trigger_task\`** to trigger tasks

## Machine Presets

| Preset | vCPU | RAM |
|--------|------|-----|
| micro | 0.25 | 0.25 GB |
| small-1x (default) | 0.5 | 0.5 GB |
| small-2x | 1 | 1 GB |
| medium-1x | 1 | 2 GB |
| medium-2x | 2 | 4 GB |
| large-1x | 4 | 8 GB |
| large-2x | 8 | 16 GB |

## Key SDK Imports

\`\`\`typescript
import {
  task, schemaTask, schedules, batch, tasks, runs, queues,
  tags, metadata, wait, auth, idempotencyKeys, logger, streams,
  AbortTaskRunError, configure, query,
} from "@trigger.dev/sdk";
import { ai } from "@trigger.dev/sdk/ai";
\`\`\`

Use \`$ARGUMENTS\` to understand what the user wants to build. Read the reference files for detailed patterns before writing code.
`,

  "trigger-dev/advanced-reference.md": `# Trigger.dev Advanced Features Reference

## Lifecycle Hooks

All hooks receive a single destructured object parameter.

### Per-Task Hooks
\`\`\`typescript
export const myTask = task({
  id: "my-task",
  onStart: async ({ payload, ctx }) => {},
  onStartAttempt: async ({ payload, ctx }) => {},
  onSuccess: async ({ payload, output, ctx }) => {},
  onFailure: async ({ payload, error, ctx }) => {},
  onComplete: async ({ payload, result, ctx }) => {
    // result.ok for success/failure check
  },
  onWait: async ({ wait }) => {
    // task paused — clean up resources (DB connections, etc.)
  },
  onResume: async ({ wait }) => {
    // task resuming — reinitialize resources
  },
  onCancel: async ({ runPromise, signal }) => {
    // cleanup on cancellation
  },
  catchError: async ({ error, retry, retryAt, retryDelayInMs }) => {
    // control retry: return { skipRetrying: true } or { retryAt: Date }
  },
  run: async (payload, { ctx, signal }) => {},
});
\`\`\`

### Global Hooks (apply to all tasks)
\`\`\`typescript
import { tasks } from "@trigger.dev/sdk";

tasks.onStart(({ ctx, payload }) => {});
tasks.onSuccess(({ ctx, output }) => {});
tasks.onFailure(({ ctx, error }) => {});
tasks.onCancel(({ ctx, signal }) => {});
tasks.onWait("name", async ({ ctx }) => {});
tasks.onResume("name", async ({ ctx }) => {});
tasks.onStartAttempt(({ ctx, payload }) => {});
\`\`\`

## Middleware & Locals

### Middleware (wraps entire task execution)
\`\`\`typescript
import { locals, tasks, logger, task } from "@trigger.dev/sdk";

// Define a local value type
const DbLocal = locals.create<DbClient>("db");

// Global middleware
tasks.middleware("db-middleware", async ({ ctx, payload, next }) => {
  const db = locals.set(DbLocal, createDbClient());
  await db.connect();
  await next(); // run the task
  await db.disconnect();
});

// Clean up on wait, reinitialize on resume
tasks.onWait("db", async () => {
  const db = locals.getOrThrow(DbLocal);
  await db.disconnect();
});
tasks.onResume("db", async () => {
  const db = locals.getOrThrow(DbLocal);
  await db.connect();
});

// Access in tasks
export const myTask = task({
  id: "my-task",
  run: async (payload) => {
    const db = locals.getOrThrow(DbLocal);
    await db.query("SELECT * FROM users");
  },
});
\`\`\`

### Per-Task Middleware
\`\`\`typescript
export const myTask = task({
  id: "my-task",
  middleware: async ({ payload, ctx, next }) => {
    console.log("Before task");
    await next();
    console.log("After task");
  },
  run: async (payload) => {},
});
\`\`\`

## Tags

Max 10 per run. Format: strings like \`"user_123"\`, \`"org_456"\`.

\`\`\`typescript
import { tags } from "@trigger.dev/sdk";

// Set when triggering
await myTask.trigger(payload, { tags: ["user_123", "org_456"] });

// Add inside a run
await tags.add("product_789");
await tags.add(["tag1", "tag2"]);

// Read in run
const currentTags = ctx.run.tags;

// Subscribe to runs by tag
for await (const run of runs.subscribeToRunsWithTag("user:1234")) {}
\`\`\`

## Metadata

Up to 256KB per run. Sync operations (non-blocking except \`flush\`).

\`\`\`typescript
import { metadata } from "@trigger.dev/sdk";

// Set when triggering
await myTask.trigger(payload, { metadata: { userId: "123" } });

// Inside a run
metadata.set("progress", 0.1);
metadata.set("status", "processing");
metadata.increment("processedRows", 1);
metadata.decrement("remaining", 1);
metadata.append("logs", "Step 1 done");
metadata.remove("logs", "Step 1 done");
metadata.get("progress");
metadata.current(); // get all metadata
await metadata.flush(); // force persist to DB

// Update parent task's metadata (from child task)
metadata.parent.increment("processedRows", 1);
metadata.parent.append("rowRuns", ctx.run.id);
\`\`\`

## Scheduled Tasks (Cron)

### Declarative (syncs on dev/deploy)
\`\`\`typescript
import { schedules } from "@trigger.dev/sdk";

export const dailyReport = schedules.task({
  id: "daily-report",
  cron: "0 0 * * *", // midnight UTC
  run: async (payload) => {
    // payload.timestamp — scheduled time (UTC)
    // payload.lastTimestamp — last run time
    // payload.timezone — IANA timezone
    // payload.scheduleId — schedule ID
    // payload.externalId — optional external ID
    // payload.upcoming — next 5 scheduled times
  },
});
\`\`\`

### Imperative (dynamic schedule creation)
\`\`\`typescript
const schedule = await schedules.create({
  task: "daily-report",
  cron: "0 0 * * *",
  timezone: "America/New_York", // IANA format, handles DST
  externalId: "user_123456",
  deduplicationKey: "user_123456-reminder",
});
\`\`\`

## AI Integration

### ai.tool() — Vercel AI SDK Compatible
\`\`\`typescript
import { ai, schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const searchTask = schemaTask({
  id: "web-search",
  schema: z.object({ query: z.string() }),
  run: async (payload) => {
    return { results: ["result1", "result2"] };
  },
});

const searchTool = ai.tool(searchTask);

export const aiAgent = task({
  id: "ai-agent",
  run: async (payload: { prompt: string }) => {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: payload.prompt,
      tools: { search: searchTool },
    });
    return { text };
  },
});
\`\`\`

### ai.currentToolOptions()
Access tool execution options inside a schema task wrapped with \`ai.tool()\`.

## Realtime API

### Backend Subscriptions
\`\`\`typescript
import { runs } from "@trigger.dev/sdk";

for await (const run of runs.subscribeToRun(runId)) { /* live updates */ }
for await (const run of runs.subscribeToRunsWithTag("user:1234")) {}
for await (const run of runs.subscribeToBatch(batchId)) {}
\`\`\`

### Public Access Tokens (for frontend)
\`\`\`typescript
import { auth } from "@trigger.dev/sdk";
const publicToken = await auth.createPublicToken();

// Or use auto-generated token from trigger handle:
const handle = await myTask.trigger(payload);
// handle.publicAccessToken
\`\`\`

### React Hooks (@trigger.dev/react-hooks)
\`\`\`typescript
import {
  useRealtimeRun,
  useRealtimeBatch,
  useRealtimeRunsWithTag,
  useRealtimeStream,
  useTaskTrigger,
  useRealtimeTaskTrigger,
  useRealtimeTaskTriggerWithStreams,
  useRealtimeRunWithStreams,
} from "@trigger.dev/react-hooks";

// Subscribe to a run
const { run, error } = useRealtimeRun(runId, { accessToken });

// Trigger from frontend
const { trigger, handle } = useTaskTrigger("my-task", { accessToken });

// Trigger and subscribe
const { trigger, run } = useRealtimeTaskTrigger("my-task", { accessToken });

// Skip columns to reduce data
const { run } = useRealtimeRun(runId, {
  accessToken,
  skipColumns: ["payload", "output"],
});
\`\`\`

## Realtime Streams

### Define Output Streams
\`\`\`typescript
import { streams } from "@trigger.dev/sdk";

export const aiStream = streams.output<string>({ id: "ai-output" });
export const progressStream = streams.output<{ step: string; percent: number }>({ id: "progress" });
\`\`\`

### Write to Streams (inside tasks)
\`\`\`typescript
await aiStream.append("Hello ");
await aiStream.append("World");

// Or direct:
await streams.append("logs", "Processing started");
\`\`\`

### Pipe AI SDK to Stream
\`\`\`typescript
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const result = streamText({
  model: openai("gpt-4o"),
  prompt: "Hello",
});
result.textStream.pipeTo(aiStream.writable());
\`\`\`

### Define Input Streams (bidirectional)
\`\`\`typescript
export const cancelSignal = streams.input<{ reason?: string }>({ id: "cancel" });
export const approval = streams.input<{ approved: boolean }>({ id: "approval" });

// Consume in task
const result = await cancelSignal.wait();
// or event-based:
cancelSignal.on((data) => { /* handle */ });

// Send from outside
await cancelSignal.send(runId, { reason: "User stopped" });
\`\`\`

### Read Streams from Backend
\`\`\`typescript
const stream = await aiStream.read(runId, { timeoutInSeconds: 300 });
for await (const chunk of stream) { console.log(chunk); }
\`\`\`

## Webhook Handling

### Alert Webhooks
\`\`\`typescript
import { webhooks } from "@trigger.dev/sdk";

const event = await webhooks.constructEvent(request, process.env.ALERT_WEBHOOK_SECRET!);
// event.type: "alert.run.failed" | "alert.deployment.success" | "alert.deployment.failed"
\`\`\`

### Stripe Webhook → Task
\`\`\`typescript
export async function POST(req: Request) {
  const event = stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature")!,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );
  await tasks.trigger("handle-stripe-event", event.data.object);
  return new Response("OK");
}
\`\`\`

## Python Integration

\`\`\`typescript
import { python } from "@trigger.dev/python";

// Run inline Python
const result = await python.runInline(\`print("Hello")\`);

// Run a script file
const result = await python.runScript("./python/script.py", ["arg1"]);

// Stream output
const stream = python.stream.runScript("./python/script.py");
for await (const chunk of stream) { console.log(chunk); }
\`\`\`

Requires \`pythonExtension\` in build extensions.

## Logging

\`\`\`typescript
import { logger } from "@trigger.dev/sdk";

logger.debug("Debug", { key: "value" });
logger.info("Info", { key: "value" });
logger.warn("Warning", { key: "value" });
logger.error("Error", { key: "value" });

// console.log/error also work and appear in dashboard
\`\`\`

## TRQL Query

\`\`\`typescript
import { query } from "@trigger.dev/sdk";
const result = await query.execute("SELECT run_id, status FROM runs WHERE status = 'Failed' LIMIT 10");
\`\`\`

## Delay & TTL

\`\`\`typescript
// Delay execution
await myTask.trigger(payload, { delay: "1h" });
await myTask.trigger(payload, { delay: new Date("2025-01-01") });

// Reschedule a delayed run
await runs.reschedule("run_1234", { delay: "2h" });

// TTL — expire if not started in time
await myTask.trigger(payload, { ttl: "10m" });
\`\`\`

## Disable maxDuration
\`\`\`typescript
import { timeout } from "@trigger.dev/sdk";

export const longTask = task({
  id: "long-task",
  maxDuration: timeout.None,
  run: async (payload) => {},
});
\`\`\`
`,

  "trigger-dev/config-reference.md": `# Trigger.dev Configuration Reference

## trigger.config.ts — Full Reference

\`\`\`typescript
import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  // REQUIRED: Project ref from dashboard
  project: "<project-ref>",

  // Directories containing task files (default: ["./trigger"])
  dirs: ["./src/trigger"],

  // Runtime: "node" (default) or "bun"
  runtime: "node",

  // Log level: "debug" | "log" | "info" | "warn" | "error"
  logLevel: "log",

  // Max duration for all tasks (seconds, default: 3600)
  maxDuration: 3600,

  // Default machine preset
  machine: "small-1x",

  // Global retry config
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },

  // Build configuration
  build: {
    external: ["header-generator"],   // packages to NOT bundle
    autoDetectExternal: true,          // auto-detect native packages (default: true)
    keepNames: true,                   // keep function/class names (default: true)
    minify: false,                     // experimental
    extensions: [],                    // build extensions array
  },

  // OpenTelemetry instrumentations
  telemetry: {
    instrumentations: [
      // new PrismaInstrumentation(),
      // new OpenAIInstrumentation(),
    ],
  },

  // Global lifecycle hooks
  onStart: async ({ payload, ctx }) => {},
  onSuccess: async ({ payload, output, ctx }) => {},
  onFailure: async ({ payload, error, ctx }) => {},
  init: async ({ payload, ctx }) => {},
});
\`\`\`

## Package Installation

\`\`\`bash
# Required
npm add @trigger.dev/sdk@latest
npm add -D @trigger.dev/build@latest

# Optional: React hooks for realtime
npm add @trigger.dev/react-hooks@latest

# Optional: Python support
npm add @trigger.dev/python@latest
\`\`\`

Recommended package.json scripts:
\`\`\`json
{
  "scripts": {
    "dev:trigger": "trigger dev",
    "deploy:trigger": "trigger deploy"
  }
}
\`\`\`

## Project Structure

\`\`\`
project-root/
  trigger.config.ts          # MUST be at project root
  .env                       # TRIGGER_SECRET_KEY here
  src/trigger/               # task files (configurable via dirs)
    my-task.ts
  .trigger/                  # build cache (gitignore this)
\`\`\`

## Environment Variables

| Variable | Purpose |
|----------|---------|
| \`TRIGGER_SECRET_KEY\` | Auth with Trigger.dev (per-environment: dev/staging/prod/preview) |
| \`TRIGGER_API_URL\` | Only for self-hosting (default: https://api.trigger.dev) |
| \`TRIGGER_PREVIEW_BRANCH\` | Required for preview branch environments |

### Manual SDK Configuration (edge runtimes)
\`\`\`typescript
import { configure } from "@trigger.dev/sdk";
configure({ secretKey: "tr_preview_xxx", previewBranch: "my-branch" });
\`\`\`

## CLI Commands

| Command | Description |
|---------|-------------|
| \`npx trigger.dev@latest init\` | Initialize project |
| \`npx trigger.dev@latest dev\` | Run local dev server |
| \`npx trigger.dev@latest deploy\` | Deploy to production |
| \`npx trigger.dev@latest deploy --env staging\` | Deploy to staging |
| \`npx trigger.dev@latest deploy --env preview\` | Deploy to preview |
| \`npx trigger.dev@latest login\` | Authenticate |
| \`npx trigger.dev@latest whoami\` | Show current user/project |

### Dev Command Options
\`\`\`bash
npx trigger.dev@latest dev \\
  --config trigger.config.ts \\
  --project-ref proj_xxx \\
  --env-file .env \\
  --skip-update-check \\
  --analyze-build-output    # debug cold start times
\`\`\`

### Deploy Command Options
\`\`\`bash
npx trigger.dev@latest deploy \\
  --env prod \\              # prod (default), staging, or preview
  --branch my-branch \\      # preview branch name
  --dry-run \\               # build without deploying
  --skip-promotion \\        # don't auto-promote
  --skip-sync-env-vars \\
  --local-build             # build Docker locally
\`\`\`

## Build Extensions

Install \`@trigger.dev/build\` as devDependency. Add to \`build.extensions\` array in trigger.config.ts.

### Prisma
\`\`\`typescript
import { prismaExtension } from "@trigger.dev/build/extensions/prisma";

prismaExtension({
  mode: "legacy",
  schema: "prisma/schema.prisma",
  migrate: true,
  directUrlEnvVarName: "DATABASE_URL_UNPOOLED",
})
\`\`\`

### FFmpeg
\`\`\`typescript
import { ffmpeg } from "@trigger.dev/build/extensions/core";
ffmpeg()
\`\`\`

### System Packages (apt-get)
\`\`\`typescript
import { aptGet } from "@trigger.dev/build/extensions/core";
aptGet({ packages: ["ffmpeg", "libreoffice"] })
\`\`\`

### Puppeteer
\`\`\`typescript
import { puppeteer } from "@trigger.dev/build/extensions/puppeteer";
puppeteer()
// Set PUPPETEER_EXECUTABLE_PATH env var in dashboard
\`\`\`

### Additional Files
\`\`\`typescript
import { additionalFiles } from "@trigger.dev/build/extensions/core";
additionalFiles({ files: ["./assets/**", "wrangler/wrangler.toml"] })
\`\`\`

### Additional Packages
\`\`\`typescript
import { additionalPackages } from "@trigger.dev/build/extensions/core";
additionalPackages({ packages: ["wrangler@1.19.0"] })
\`\`\`

### Sync Vercel Env Vars
\`\`\`typescript
import { syncVercelEnvVars } from "@trigger.dev/build/extensions/core";
syncVercelEnvVars()
// Requires: VERCEL_ACCESS_TOKEN, VERCEL_PROJECT_ID, optionally VERCEL_TEAM_ID
\`\`\`

### Sync Supabase Env Vars
\`\`\`typescript
import { syncSupabaseEnvVars } from "@trigger.dev/build/extensions/core";
syncSupabaseEnvVars()
// Requires: SUPABASE_ACCESS_TOKEN, SUPABASE_PROJECT_ID
\`\`\`

### Python
\`\`\`typescript
import { pythonExtension } from "@trigger.dev/python/extension";
pythonExtension({
  requirementsFile: "./requirements.txt",
  devPythonBinaryPath: "venv/bin/python",
  scripts: ["src/python/**/*.py"],
})
\`\`\`

### Custom Build Extension
\`\`\`typescript
{
  name: "my-extension",
  onBuildComplete: async (context) => {
    if (context.target === "deploy") {
      context.addLayer({
        id: "my-layer",
        image: { pkgs: ["curl"], instructions: ["RUN ..."] },
        dependencies: { "my-pkg": "^1.0.0" },
      });
    }
  },
  externalsForTarget: async (target) => ["my-native-dep"],
}
\`\`\`

## Deployment

### GitHub Actions (Production)
\`\`\`yaml
name: Deploy to Trigger.dev
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20.x" }
      - run: npm install
      - run: npx trigger.dev@latest deploy
        env:
          TRIGGER_ACCESS_TOKEN: \${{ secrets.TRIGGER_ACCESS_TOKEN }}
\`\`\`

### GitHub Actions (Preview)
\`\`\`yaml
name: Deploy Preview
on:
  pull_request:
    types: [opened, synchronize, reopened, closed]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "20.x" }
      - run: npm install
      - run: npx trigger.dev@latest deploy --env preview
        env:
          TRIGGER_ACCESS_TOKEN: \${{ secrets.TRIGGER_ACCESS_TOKEN }}
\`\`\`

**TRIGGER_ACCESS_TOKEN** is a Personal Access Token (\`tr_pat_*\`), different from TRIGGER_SECRET_KEY.

## Framework Integration

### Next.js Server Action
\`\`\`typescript
"use server";
import { myTask } from "@/trigger/my-task";

export async function triggerMyTask(data: any) {
  await myTask.trigger(data);
}
\`\`\`

### Next.js Route Handler
\`\`\`typescript
import type { myTask } from "@/trigger/my-task";
import { tasks } from "@trigger.dev/sdk";

export async function POST(req: Request) {
  const payload = await req.json();
  const handle = await tasks.trigger<typeof myTask>("my-task", payload);
  return Response.json(handle);
}
\`\`\`

### Remix Action
\`\`\`typescript
import { tasks } from "@trigger.dev/sdk";
import type { myTask } from "src/trigger/example";

export async function action({ request }: ActionFunctionArgs) {
  const payload = await request.json();
  await tasks.trigger<typeof myTask>("my-task", payload);
  return new Response("OK");
}
\`\`\`

## Monorepo Setup

### Approach 1: Tasks as a Package (recommended)
\`\`\`
packages/tasks/
  trigger.config.ts
  src/trigger/index.ts    # exports all tasks
  package.json            # @repo/tasks
\`\`\`

### Approach 2: Tasks in App
\`\`\`
apps/web/
  trigger.config.ts       # config lives in the app
  src/trigger/
  package.json
\`\`\`

## Environments

| Environment | Key Prefix | Usage |
|-------------|-----------|-------|
| dev | \`tr_dev_*\` | Local \`trigger dev\` |
| staging | \`tr_stg_*\` | Pre-production testing |
| prod | \`tr_prod_*\` | Production |
| preview | \`tr_preview_*\` | Branch-based isolation |
`,

  "trigger-dev/core-reference.md": `# Trigger.dev Core Reference

## Tasks

### task() — Basic Task
\`\`\`typescript
import { task } from "@trigger.dev/sdk";

export const myTask = task({
  id: "my-task",                    // unique identifier
  queue: { concurrencyLimit: 5 },   // optional queue config
  machine: "small-1x",             // optional machine preset
  maxDuration: 300,                // max seconds before TIMED_OUT
  retry: {
    maxAttempts: 10,
    factor: 1.8,
    minTimeoutInMs: 500,
    maxTimeoutInMs: 30_000,
    randomize: false,
    outOfMemory: { machine: "large-1x" }, // retry with bigger machine on OOM
  },
  run: async (payload: { msg: string }, { ctx, signal }) => {
    // ctx.run.id, ctx.run.tags, ctx.run.attempt.number
    // ctx.environment.type ("DEVELOPMENT"|"PRODUCTION"|"STAGING"|"PREVIEW")
    // ctx.task.id, ctx.project.ref
    // signal: AbortSignal for cancellation
    return { result: "done" }; // must be JSON serializable
  },
});
\`\`\`

### schemaTask() — With Runtime Validation
\`\`\`typescript
import { schemaTask } from "@trigger.dev/sdk";
import { z } from "zod";

export const validated = schemaTask({
  id: "validated-task",
  schema: z.object({
    name: z.string().default("John"),
    age: z.number(),
    dob: z.coerce.date(),
  }),
  run: async (payload) => {
    // payload is typed AND validated at runtime
    // Note: tasks.trigger("validated-task", data) does NOT validate
  },
});
\`\`\`

### Hidden Tasks (not exported)
\`\`\`typescript
const internal = task({
  id: "internal",
  run: async (payload: any) => { /* only callable from other tasks */ },
});

export const public = task({
  id: "public",
  run: async (payload) => {
    await internal.triggerAndWait(payload);
  },
});
\`\`\`

## Triggering Tasks

### From Backend (no task import needed)
\`\`\`typescript
import { tasks } from "@trigger.dev/sdk";
import type { myTask } from "~/trigger/my-task"; // TYPE-ONLY import

const handle = await tasks.trigger<typeof myTask>("my-task", { msg: "hello" });
// handle.id — run ID
// handle.publicAccessToken — for frontend realtime subscriptions
\`\`\`

### From Inside a Task
\`\`\`typescript
// Fire and forget
const handle = await otherTask.trigger({ data: "foo" });

// Trigger and wait for result
const result = await otherTask.triggerAndWait({ data: "foo" });
if (result.ok) {
  console.log(result.output);
} else {
  console.error(result.error);
}

// Unwrap (throws SubtaskUnwrapError on failure)
const output = await otherTask.triggerAndWait({ data: "foo" }).unwrap();
\`\`\`

### Trigger Options (all trigger functions)
\`\`\`typescript
await myTask.trigger(payload, {
  delay: "1h",                  // delay before execution (string or Date)
  ttl: "10m",                   // time-to-live; expires if not started in time
  idempotencyKey: "unique-key", // prevent duplicate runs
  idempotencyKeyTTL: "24h",    // key validity (s, m, h, d)
  queue: "my-queue",            // override queue
  concurrencyKey: "user_123",   // per-key concurrency
  tags: ["user_123", "org_456"],// up to 10 tags
  metadata: { userId: "123" },  // initial metadata
  machine: "large-1x",          // override machine
});
\`\`\`

### Batch Triggering
\`\`\`typescript
import { batch } from "@trigger.dev/sdk";

// Same task, multiple payloads
const batchHandle = await myTask.batchTrigger([
  { payload: { item: "a" } },
  { payload: { item: "b" } },
]);

// Same task, wait for all results
const results = await myTask.batchTriggerAndWait([
  { payload: { item: "a" } },
  { payload: { item: "b" } },
]);
for (const run of results.runs) {
  if (run.ok) console.log(run.output);
}

// Different tasks in one batch
const result = await batch.triggerByTaskAndWait([
  { task: taskA, payload: { foo: "bar" } },
  { task: taskB, payload: { baz: "qux" } },
]);

// Max 1000 items per batch (SDK 4.3.1+)
// Do NOT wrap in Promise.all — not supported
\`\`\`

## Runs

### Run Statuses
- \`QUEUED\` — waiting for worker
- \`DELAYED\` — scheduled for future
- \`EXECUTING\` — running
- \`REATTEMPTING\` — failed, waiting for retry
- \`FROZEN\` — paused (wait/checkpoint)
- \`COMPLETED\` — success
- \`CANCELED\` — canceled by user
- \`FAILED\` — all attempts exhausted
- \`CRASHED\` — OOM or worker crash
- \`TIMED_OUT\` — exceeded maxDuration
- \`EXPIRED\` — TTL passed before execution

### Run Management
\`\`\`typescript
import { runs } from "@trigger.dev/sdk";

const run = await runs.retrieve("run_1234");
await runs.cancel("run_1234");
await runs.replay("run_1234");
await runs.reschedule("run_1234", { delay: "2h" });

// List runs
for await (const run of runs.list({ limit: 20 })) { console.log(run); }

// Subscribe to real-time updates
for await (const run of runs.subscribeToRun(runId)) { console.log(run.status); }
\`\`\`

## Queues & Concurrency

### Task-Level Queue
\`\`\`typescript
export const sequential = task({
  id: "sequential",
  queue: { concurrencyLimit: 1 }, // one at a time
  run: async (payload) => {},
});
\`\`\`

### Named Queues (shared across tasks)
\`\`\`typescript
import { queue } from "@trigger.dev/sdk";

const myQueue = queue({ name: "shared-queue", concurrencyLimit: 10 });

export const taskA = task({ id: "a", queue: myQueue, run: async () => {} });
export const taskB = task({ id: "b", queue: myQueue, run: async () => {} });
\`\`\`

### Per-Tenant Concurrency
\`\`\`typescript
await myTask.trigger(data, {
  queue: "free-users",
  concurrencyKey: data.userId, // separate queue per user
});
\`\`\`

### Override at Runtime
\`\`\`typescript
import { queues } from "@trigger.dev/sdk";
await queues.overrideConcurrencyLimit("queue_1234", 5);
await queues.overrideConcurrencyLimit({ type: "task", name: "my-task" }, 20);
\`\`\`

## Errors & Retrying

### Default Retry Config
3 retries with exponential backoff. Configure per-task or globally in trigger.config.ts.

### AbortTaskRunError — Skip Retries
\`\`\`typescript
import { AbortTaskRunError } from "@trigger.dev/sdk";

throw new AbortTaskRunError("Invalid API key — permanent failure");
\`\`\`

### catchError — Control Retry Behavior
\`\`\`typescript
export const myTask = task({
  id: "my-task",
  catchError: async ({ error, retry, retryAt, retryDelayInMs }) => {
    if (error.message.includes("PERMANENT")) return { skipRetrying: true };
    return { retryAt: new Date(Date.now() + 60000) };
    // or: return { retry: { maxAttempts: 5 } };
    // or: return undefined; // use default behavior
  },
  run: async (payload) => {},
});
\`\`\`

### retry.fetch() — Smart HTTP Retrying
\`\`\`typescript
import { retry } from "@trigger.dev/sdk";

const response = await retry.fetch("https://api.example.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: "value" }),
  retry: {
    byStatus: {
      "429": {
        strategy: "headers",
        limitHeader: "x-ratelimit-limit",
        remainingHeader: "x-ratelimit-remaining",
        resetHeader: "x-ratelimit-reset",
        resetFormat: "unix_timestamp_in_ms",
      },
      "500-599": {
        strategy: "backoff",
        maxAttempts: 10,
        factor: 2,
        minTimeoutInMs: 1000,
        maxTimeoutInMs: 30000,
      },
    },
  },
  timeoutInMs: 5000,
});
\`\`\`

## Idempotency

### Basic Usage
\`\`\`typescript
await myTask.trigger(payload, {
  idempotencyKey: "unique-key",
  idempotencyKeyTTL: "24h", // default 30 days
});
\`\`\`

### Inside Tasks (prevent duplicates during retries)
\`\`\`typescript
import { idempotencyKeys } from "@trigger.dev/sdk";

// Scoped to current run (prevents duplicates across retries)
const key = await idempotencyKeys.create("child-trigger");
await childTask.trigger(payload, { idempotencyKey: key });

// Global scope (unique across ALL runs)
const globalKey = await idempotencyKeys.create("global-key", { scope: "global" });
\`\`\`

### Reset a Key
\`\`\`typescript
await idempotencyKeys.reset("child-task", "my-idempotency-key");
\`\`\`

## Wait Functions

All waits checkpoint the task — **no compute charges** during waits.

### wait.for / wait.until
\`\`\`typescript
import { wait } from "@trigger.dev/sdk";

await wait.for({ seconds: 30 });
await wait.for({ minutes: 5 });
await wait.for({ hours: 1 });
await wait.for({ days: 1 });
await wait.until({ date: new Date("2025-01-01") });

// With idempotency (safe across retries)
await wait.for({ seconds: 10 }, { idempotencyKey: "my-wait", idempotencyKeyTTL: "1h" });
\`\`\`

### wait.forToken — Human-in-the-Loop / External Completion
\`\`\`typescript
// Create a waitpoint token
const token = await wait.createToken({
  timeout: "24h",
  idempotencyKey: \`approval-\${id}\`,
  idempotencyKeyTTL: "24h",
  tags: ["user:123"],
});

// token.id — token ID
// token.url — pre-signed URL for HTTP POST (no API key needed)

// Wait for external completion
const result = await wait.forToken<{ approved: boolean }>(token);
if (result.ok) console.log(result.output); // { approved: true }

// Complete from SDK
await wait.completeToken(token.id, { data: { approved: true } });

// Complete via HTTP POST to token.url (body is the data)
\`\`\`
`,

};
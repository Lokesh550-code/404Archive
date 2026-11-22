# 404 Archive

## Product Requirements Document (PRD)

**Version:** 1.0\
**Status:** Draft --- consolidated from product and architecture
discussions\
**Product type:** Curated website discovery platform\
**Initial scale:** Personal portfolio project, with potential for
organic public growth

------------------------------------------------------------------------

## 1. Product Overview

### 1.1 What is 404 Archive?

404 Archive is a curated digital museum showcasing unusual, fascinating,
experimental, creative, and otherwise interesting websites from across
the internet.

It gives visitors a place to discover websites they might never
encounter through conventional search engines or social media.

The platform is built around three ideas:

-   Discovery should feel effortless.
-   Curation should feel intentional.
-   The experience should be as interesting as the websites being
    showcased.

**Guiding principle: Curiosity deserves good design.**

### 1.2 Product Vision

Create a beautifully designed digital museum where visitors can explore
the internet's unusual corners through a thoughtfully curated collection
of websites.

The product should prioritize the quality of its collection and the
quality of its browsing experience over user counts and feature volume.

### 1.3 Target Audience

-   People interested in discovering unusual websites.
-   Designers, developers, digital artists, and internet enthusiasts.
-   People looking for creative inspiration.
-   Contributors who want to share interesting websites.

------------------------------------------------------------------------

## 2. Product Scope

### 2.1 MVP Goals

The MVP must provide:

1.  A public, searchable website gallery.
2.  Individual editorial exhibit pages.
3.  Random website discovery.
4.  Category-based browsing.
5.  User registration and authentication.
6.  Community website submissions.
7.  Moderation and approval workflows.
8.  Upvoting and reporting.
9.  User dashboards.
10. Administrative and moderation interfaces.
11. Website availability monitoring.
12. Email notifications.

### 2.2 Explicitly Out of Scope

The MVP will not include:

-   Public user profiles.
-   Followers or following.
-   Comments and discussion threads.
-   Reviews or ratings.
-   Downvotes.
-   Public activity feeds.
-   In-app notifications.
-   Social messaging.
-   Automatic website screenshot generation.
-   Automatic website content-change detection.
-   Advanced image processing pipelines.
-   Multi-device session management.
-   Redis-based job processing.
-   Multiple frontend applications.

These features may be reconsidered after the MVP.

------------------------------------------------------------------------

## 3. User Roles and Permissions

The platform has three roles.

### 3.1 Visitor

Visitors can:

-   Browse exhibits.
-   Search the archive.
-   Filter by categories.
-   Use random discovery.
-   View exhibit pages.
-   Open original websites.

Authentication is not required for browsing.

### 3.2 User

Authenticated and email-verified users can:

-   Submit websites.
-   View their submissions.
-   Edit submissions requiring changes.
-   Delete eligible submissions.
-   Upvote exhibits.
-   Report exhibits.
-   View their reports.
-   Manage their account and avatar.

Users cannot upvote their own exhibits.

### 3.3 Moderator

Moderators can:

-   Approve submissions.
-   Reject submissions.
-   Request submission changes.
-   Remove published exhibits.
-   Review reports.
-   Temporarily suspend users.
-   View moderation history.

Moderators cannot:

-   Permanently ban users.
-   Manage moderator roles.
-   Manage categories.
-   Modify administrator permissions.

### 3.4 Administrator

Administrators have all moderator permissions, plus:

-   Permanently ban and restore users.
-   Manage moderator roles.
-   Create, edit, activate, and deactivate categories.
-   Handle copyright and intellectual-property complaints.
-   Manage administrative user operations.

All privileged actions must be authorized on the backend.

------------------------------------------------------------------------

## 4. Core Product Features

### 4.1 Public Gallery

The gallery is the homepage. There is no separate marketing landing
page.

#### Layout

The gallery uses a Pinterest-inspired masonry layout.

Exhibit cards have variable heights and display:

1.  Website screenshot.
2.  Exhibit title.
3.  Short description.
4.  Website identity.

#### Card Interaction

-   The entire card is clickable.
-   Clicking opens the dedicated exhibit page.
-   Hovering reveals the title and description through a subtle gradient
    overlay.
-   Hover effects may include slight image zoom and card elevation.
-   Touchscreen users must have an equivalent experience without relying
    on hover.
-   Cards must support keyboard navigation and visible focus states.

#### Gallery Navigation

A minimal navigation bar contains:

-   404 Archive branding.
-   Explore.
-   Categories.
-   Submit.
-   Search.
-   Account.

The navigation should remain visually restrained.

#### Pagination

The gallery uses a Load More button.

-   Initial batch: 20 exhibits.
-   Additional batches: 20 exhibits.
-   Existing exhibits remain visible while loading.
-   Filters and sorting remain active when loading additional results.
-   An end-of-archive state appears when no more results exist.

### 4.2 Search

Search supports:

-   Exhibit title.
-   Website name.
-   Domain.

Search behaviour:

-   Case-insensitive.
-   Partial matching.
-   Debounced live search.
-   Approximately 300--400 ms debounce.
-   Reset pagination when the query changes.
-   Preserve search state when navigating back from an exhibit.

Search requests should cancel or disregard stale results.

### 4.3 Category Browsing

Categories appear as compact chips or pills above the gallery.

-   Multiple categories can be selected.
-   Selected categories have a distinct visual state.
-   Category filtering uses OR logic.
-   Category changes trigger a debounced API request after approximately
    200--300 ms.
-   Search and category filters work together.
-   A clear-filters action resets active filters.
-   Mobile category chips support horizontal scrolling.

Each exhibit may belong to a maximum of three categories.

Categories are predefined and managed by administrators.

### 4.4 Sorting

Supported sorting options:

-   Newest first --- default.
-   Oldest first.
-   Most popular --- based on upvotes.

Sorting resets pagination.

### 4.5 Random Discovery

A dedicated Surprise Me button appears near the search and category
controls.

Clicking it opens one randomly selected exhibit.

The backend initially uses MongoDB aggregation with `$sample`.

Only published exhibits are eligible. Whether temporarily offline
exhibits should be included remains an implementation detail to
finalize.

### 4.6 Exhibit Detail Page

Each exhibit has a dedicated page.

#### Content hierarchy

1.  Large visual preview.
2.  Exhibit title.
3.  Website identity and domain.
4.  Original website link.
5.  Editorial description and background.
6.  Categories.
7.  Upvote control.

The original website opens separately in a new tab.

For HTTP websites, display a warning that the connection is unencrypted.
Do not automatically upgrade HTTP URLs to HTTPS.

#### Editorial presentation

Exhibit pages should resemble editorial articles rather than database
records.

Priorities:

-   Strong typography.
-   Comfortable whitespace.
-   Clear visual hierarchy.
-   Well-presented descriptions.
-   Thoughtful image placement.

### 4.7 Submission System

Anyone can submit a website, but authentication and email verification
are required.

#### Submission Form

The form is a single-page experience.

  Field                    Requirement
  ------------------------ -------------
  Website URL              Required
  Why is it interesting?   Required
  Suggested title          Optional
  Suggested categories     Optional
  Screenshot               Required

The screenshot is supplied by the contributor.

Moderators retain editorial control over the final exhibit.

#### Submission Limits

-   Maximum five active pending submissions per user.
-   Pending and Needs Changes submissions occupy a slot.
-   Approved and rejected submissions no longer occupy a slot.
-   Administrators may override the limit.

#### Submission Validation

The backend must validate:

-   URL format.
-   URL normalization.
-   Duplicate submissions.
-   Website reachability.
-   Screenshot presence and validity.
-   Required text fields.
-   Submission ownership and user eligibility.

Offline websites cannot enter the moderation queue.

A single HTTP error must not automatically be interpreted as proof that
a website is offline.

#### Duplicate Prevention

Duplicate detection compares normalized URLs against:

-   Published exhibits.
-   Active Pending submissions.
-   Active Needs Changes submissions.

Normalization handles trivial differences such as trailing slashes and
fragments.

Query parameters must not be indiscriminately removed because they may
identify distinct pages.

Different paths on the same domain may represent separate exhibits.

Rejected submissions do not block future submissions.

Database-level constraints or transactional protection must prevent race
conditions during concurrent submissions.

### 4.8 Submission Lifecycle

Possible statuses:

-   Pending.
-   Needs Changes.
-   Approved.
-   Rejected.

Workflow:

**Pending** - Waiting for moderation. - Contributor cannot edit.

**Needs Changes** - Moderator has requested revisions. - Contributor can
edit and resubmit. - Resubmission returns the submission to Pending.

**Approved** - An independent Exhibit is created. - The Submission
remains as a moderation record. - The original submission becomes
immutable.

**Rejected** - Submission becomes read-only. - Contributor cannot reopen
or edit it. - Contributor may create a new submission.

Users can delete their own Pending or Needs Changes submissions.

Approved and Rejected submissions cannot be deleted by contributors.

### 4.9 Exhibit Management

An approved submission creates a separate Exhibit.

The Exhibit is independently maintained and may be edited without
changing the original Submission.

Exhibits have separate publication and availability states.

Publication status:

-   Published.
-   Hidden.

Availability status:

-   Online.
-   Offline.
-   Unknown.

An offline website may be hidden from public browsing while retaining
its database record.

Repeated failures are required before automatically hiding an exhibit.

When a website is confirmed online again, it can be automatically
restored unless separately restricted by moderation.

No automatic website content-change detection is included in the MVP.

### 4.10 Upvoting

Only authenticated and email-verified users can upvote.

Rules:

-   One upvote per user per exhibit.
-   Users may retract their upvote.
-   No downvotes.
-   Users cannot upvote their own exhibits.
-   Voter identities are not publicly displayed.
-   Popular sorting uses upvote counts.

Implementation:

-   Separate Vote collection.
-   Compound unique index on `{ user, exhibit }`.
-   Retracting a vote deletes its Vote document.
-   Exhibit stores a cached `upvoteCount`.

Count updates must be handled consistently to avoid incorrect totals
under concurrent requests.

### 4.11 Reporting

Authenticated users can report exhibits.

Available reasons:

-   Website offline.
-   Website changed significantly.
-   Inappropriate content.
-   Misleading information.
-   Copyright or intellectual-property complaint.
-   Other.

An optional explanation accompanies the report.

Report statuses:

-   Pending.
-   Under Review.
-   Resolved.
-   Dismissed.
-   Retracted.

Rules:

-   Reporting does not automatically hide an exhibit.
-   Users can retract Pending or Under Review reports.
-   Users cannot directly delete reports.
-   Duplicate unresolved reports by the same user for the same exhibit
    and issue are prevented.
-   Different report reasons may be submitted against the same exhibit.
-   A new report is permitted after an earlier report is resolved or
    dismissed.

Copyright complaints receive administrator review.

### 4.12 User Dashboard

The dashboard uses simple tab-based navigation.

Tabs:

-   Overview.
-   My Submissions.
-   My Reports.
-   Account Settings.

#### Overview

The overview displays:

-   Total submissions.
-   Approved submissions.
-   Pending submissions.
-   Needs Changes submissions.
-   User avatar.
-   Settings icon.

No charts or activity feed.

#### My Submissions

Displays submission history, current statuses, and permitted actions.

#### My Reports

Displays reports created by the user and their current statuses.

#### Account Settings

Users can manage their avatar and account settings.

Username and email changes are not supported in the MVP.

### 4.13 Admin and Moderator Workspace

The administrative workspace lives inside the same React application
under a separate route and layout.

It uses a data-table-first interface.

Sections:

-   Submission queue.
-   Report queue.
-   Published exhibits.
-   User management.
-   Moderation history.

Each section supports appropriate filters, status indicators, and
contextual actions.

Role-specific permissions must be enforced on the server, not merely
hidden in the interface.

------------------------------------------------------------------------

## 5. Authentication and Account Management

### Registration

Registration requires:

-   Username.
-   Email.
-   Password.

Username and email are normalized to lowercase and trimmed.

Both have unique database indexes.

### Email Verification

Registration flow:

1.  User registers.
2.  Verification email is sent.
3.  User verifies their email.
4.  User logs in.
5.  Authenticated features become available.

Unverified users cannot perform authenticated actions.

Users can request another verification email.

### Authentication Strategy

JWT authentication using HttpOnly cookies.

-   Short-lived access token.
-   Refresh-token mechanism.
-   Refresh token stored as a hash in the User document.
-   One active refresh-token session per user in the MVP.
-   Logout invalidates the stored refresh token and clears cookies.

Security considerations:

-   Secure cookies in production.
-   Appropriate SameSite settings.
-   CSRF protection.
-   Password hashing.
-   Token expiry and rotation.
-   Server-side authorization.

HttpOnly cookies reduce token exposure to JavaScript but do not
eliminate every XSS or CSRF risk.

### Password Recovery

Password-reset tokens are stored as hashes with expiration timestamps in
the User document.

### Account Deletion

On account deletion:

-   Delete the User record.
-   Delete eligible pending submissions.
-   Delete the user's votes and adjust exhibit counts.
-   Retain published exhibits.
-   Remove or anonymize contributor attribution.
-   Retain legitimate reports while anonymizing reporter references.
-   Preserve moderation history while anonymizing the deleted moderator
    where appropriate.

Deletion operations require careful consistency handling.

------------------------------------------------------------------------

## 6. Image and File Management

### Storage

Cloudflare R2 is used for:

-   Exhibit screenshots.
-   User avatars.

MongoDB stores object keys and associated metadata, not image binaries.

### Upload Endpoints

  ------------------------------------------------------------------------------------------
  Method                  Endpoint                                   Purpose
  ----------------------- ------------------------------------------ -----------------------
  POST                    `/api/v1/uploads/exhibit-screenshot`       Upload screenshot

  DELETE                  `/api/v1/uploads/exhibit-screenshot/:id`   Delete eligible
                                                                     screenshot

  POST                    `/api/v1/uploads/avatar`                   Upload avatar

  DELETE                  `/api/v1/uploads/avatar`                   Delete current avatar
  ------------------------------------------------------------------------------------------

### Upload Processing

-   Express receives multipart/form-data.
-   Multer uses memory storage.
-   Server validates actual file content, type, size, and dimensions.
-   Validated files are uploaded to R2.
-   Object keys are stored in MongoDB.

Backend-mediated uploads are used initially. Presigned URLs are
deferred.

### Image Ownership and Deletion

-   Users may delete screenshots associated with their editable
    submissions.
-   Users may delete their own avatars.
-   Moderators and administrators manage published exhibit screenshots.
-   Referenced images must never be removed through ordinary
    abandoned-upload cleanup.

### Abandoned Upload Cleanup

A scheduled worker runs every seven days.

It:

1.  Finds unassociated uploads older than seven days.
2.  Checks that no Submission, Exhibit, or User references the object.
3.  Deletes eligible objects from R2.
4.  Removes corresponding upload metadata.
5.  Retains metadata when deletion fails so it can retry later.

No automatic image transformation pipeline is required for the MVP.

### Intellectual Property and Takedown

-   Attribute websites appropriately.
-   Clearly link to original websites.
-   Do not imply affiliation with website owners.
-   Provide a removal/takedown mechanism.
-   Administrators review copyright complaints.
-   Disputed screenshots can be temporarily removed and replaced by
    placeholders while the exhibit remains published if the complaint
    concerns only the image.
-   Preserve records of removal decisions.

Submitter-provided screenshots are not automatically free of copyright
restrictions. Legal review is recommended before a broad public launch.

------------------------------------------------------------------------

## 7. Email Notifications

Transactional email is handled through Resend.

Notifications are sent immediately for:

-   Submission received.
-   Submission approved.
-   Submission rejected.
-   Changes requested.
-   Revised submission received.

Email delivery is handled asynchronously through background jobs.

The email provider should be accessed through an application-level
service abstraction so it can be replaced later.

------------------------------------------------------------------------

## 8. Website Availability Monitoring

A scheduled background process checks published website URLs every 24
hours.

Requirements:

-   Multiple failures before marking a website offline.
-   Avoid interpreting a single timeout or HTTP error as proof of
    permanent unavailability.
-   Hide confirmed offline exhibits from public browsing after the
    defined failure threshold.
-   Automatically restore confirmed recovered websites unless moderation
    has independently restricted them.

Availability monitoring and content-quality moderation are separate
concerns.

The exact failure threshold and retry policy must be finalized during
implementation.

------------------------------------------------------------------------

## 9. Technical Architecture

### 9.1 Technology Stack

  Layer               Technology
  ------------------- -----------------------------
  Frontend            React
  Build tool          Vite
  Frontend language   TypeScript
  Styling             Tailwind CSS
  Routing             React Router
  Data fetching       TanStack Query
  Forms               React Hook Form
  Validation          Zod
  Icons               Lucide
  Backend             Node.js + Express
  Backend language    TypeScript
  Database            MongoDB
  ODM                 Mongoose
  Image storage       Cloudflare R2
  Background jobs     Cloudflare Workers + Queues
  Scheduled jobs      Cloudflare Cron Triggers
  Email               Resend

### 9.2 Frontend Architecture

One React application contains:

1.  Public museum.
2.  Authentication pages.
3.  User dashboard.
4.  Admin/moderator workspace.

Each group has its own layout.

The admin workspace is not a separate frontend application.

### 9.3 Backend Architecture

The backend follows a feature-based, service-oriented structure.

Responsibilities:

**Routes** - Define endpoints. - Attach middleware. - Connect endpoints
to controllers.

**Controllers** - Handle HTTP concerns. - Receive validated request
data. - Call services. - Return responses.

**Services** - Implement business logic. - Coordinate models. - Manage
transactions. - Integrate external services.

**Models** - Define Mongoose schemas. - Define indexes and references. -
Provide runtime document validation.

TypeScript interfaces provide compile-time types; Mongoose schemas
provide runtime validation.

Controllers should not contain business logic, and services should not
depend on Express request or response objects.

### 9.4 Suggested Backend Structure

``` text
server/
└── src/
    ├── config/
    ├── models/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── exhibits/
    │   ├── submissions/
    │   ├── categories/
    │   ├── votes/
    │   ├── reports/
    │   ├── moderation/
    │   ├── uploads/
    │   └── notifications/
    ├── middlewares/
    ├── services/
    ├── utils/
    ├── types/
    └── app.ts
```

This is a suggested organization, not a requirement to create every
folder before implementation.

### 9.5 API Design

The API follows versioned REST conventions.

Base path:

`/api/v1`

GraphQL is not required.

### 9.6 Database Collections

Core collections:

-   User.
-   Submission.
-   Exhibit.
-   Category.
-   Vote.
-   Report.
-   ModerationAction.

An Upload collection or equivalent metadata record is also required for
tracking uploaded files and abandoned-upload cleanup.

#### User

Important fields:

-   username.
-   email.
-   passwordHash.
-   role.
-   avatarKey.
-   isEmailVerified.
-   emailVerificationTokenHash.
-   emailVerificationTokenExpiry.
-   passwordResetTokenHash.
-   passwordResetTokenExpiry.
-   refreshTokenHash.
-   refreshTokenExpiry.
-   account status.
-   timestamps.

#### Submission

Important fields:

-   user.
-   websiteURL.
-   normalizedURL.
-   suggestedTitle.
-   description / reason for submission.
-   recommendedCategories.
-   final categories.
-   previewImageKey.
-   status.
-   timestamps.

#### Exhibit

Important fields:

-   title.
-   description.
-   websiteURL.
-   normalizedURL.
-   websiteName.
-   domain.
-   faviconURL.
-   user.
-   sourceSubmission.
-   previewImageKey.
-   categories.
-   upvoteCount.
-   publication status.
-   availability status.
-   timestamps.

#### Category

Important fields:

-   name.
-   slug.
-   description.
-   isActive.
-   timestamps.

#### Vote

Important fields:

-   user.
-   exhibit.
-   createdAt.

Unique compound index: `{ user, exhibit }`.

#### Report

Important fields:

-   reporter.
-   exhibit.
-   reason.
-   explanation.
-   status.
-   timestamps.

#### ModerationAction

Important fields:

-   moderator.
-   action.
-   reason.
-   optional submission reference.
-   optional exhibit reference.
-   optional report reference.
-   createdAt.

Exactly one target reference must be populated.

Moderation actions are append-only.

------------------------------------------------------------------------

## 10. API Scope

The following is the intended MVP API surface.

### Authentication

-   POST `/api/v1/auth/register`
-   POST `/api/v1/auth/login`
-   POST `/api/v1/auth/logout`
-   POST `/api/v1/auth/refresh`
-   POST `/api/v1/auth/verify-email`
-   POST `/api/v1/auth/resend-verification`
-   POST `/api/v1/auth/forgot-password`
-   POST `/api/v1/auth/reset-password`

### Users

-   GET `/api/v1/users/me`
-   PATCH `/api/v1/users/me`
-   DELETE `/api/v1/users/me`

### Exhibits

-   GET `/api/v1/exhibits`
-   GET `/api/v1/exhibits/random`
-   GET `/api/v1/exhibits/:id`
-   POST `/api/v1/exhibits/:id/vote`
-   DELETE `/api/v1/exhibits/:id/vote`

Gallery query parameters:

-   `search`
-   `category`
-   `sort`
-   `page`
-   `limit`

Pagination defaults:

-   Page: 1.
-   Limit: 20.
-   Maximum limit: 50.

### Submissions

-   POST `/api/v1/submissions`
-   GET `/api/v1/submissions/me`
-   GET `/api/v1/submissions/:id`
-   PATCH `/api/v1/submissions/:id`
-   DELETE `/api/v1/submissions/:id`

### Categories

-   GET `/api/v1/categories`
-   POST `/api/v1/admin/categories`
-   PATCH `/api/v1/admin/categories/:id`

Activation and deactivation are also handled through administrator-only
category management.

### Reports

-   POST `/api/v1/exhibits/:id/reports`
-   GET `/api/v1/reports/me`
-   GET `/api/v1/reports/:id`
-   PATCH `/api/v1/reports/:id` --- limited to permitted report
    retraction operations.

### Uploads

-   POST `/api/v1/uploads/exhibit-screenshot`
-   DELETE `/api/v1/uploads/exhibit-screenshot/:id`
-   POST `/api/v1/uploads/avatar`
-   DELETE `/api/v1/uploads/avatar`

### Moderation and Administration

Shared moderator/admin operations:

-   Review submissions.
-   Review reports.
-   Manage published exhibits.
-   View moderation history.
-   Suspend and restore eligible users.

Administrator-only operations:

-   Permanent bans.
-   Moderator role management.
-   Category management.
-   Other privileged account operations.

Exact moderation endpoint paths and action payloads will be specified
alongside implementation.

------------------------------------------------------------------------

## 11. Background Processing

Express does not directly perform long-running background operations.

The architecture uses:

-   Cloudflare Queues for asynchronous jobs.
-   Cloudflare Workers for job processing.
-   Cloudflare Cron Triggers for scheduled tasks.
-   MongoDB Atlas as the persistent source of truth.

Examples:

-   Sending transactional emails.
-   Website availability checks.
-   Abandoned-upload cleanup.

### Job Flow

1.  Express performs the application operation.
2.  Express publishes a job to Cloudflare Queues.
3.  A Worker consumes the job.
4.  The Worker performs the task.
5.  Failed jobs are retried according to the configured policy.

The queue integration should be encapsulated behind a backend service
rather than spread throughout controllers.

Workers are a separate serverless component, not part of the Express
application.

------------------------------------------------------------------------

## 12. Deployment Strategy

Proposed deployment:

  Component               Platform
  ----------------------- --------------------------
  Frontend                Vercel
  Express API             Render
  Database                MongoDB Atlas
  Object storage          Cloudflare R2
  Background processing   Cloudflare Workers
  Job queues              Cloudflare Queues
  Scheduling              Cloudflare Cron Triggers
  Email                   Resend

The initial deployment should prioritize free or low-cost tiers.

Free-tier limitations, cold starts, quotas, storage costs, and
commercial-use restrictions must be verified before launch.

The application should not depend on an always-running dedicated worker
or paid VPS for its MVP.

------------------------------------------------------------------------

## 13. Visual Identity and Design System

### 13.1 Design Direction

A clean, slightly eccentric digital museum with warmth inspired by
independent editorial publications.

The interface should be minimal without feeling sterile.

### 13.2 Typography

Proposed typography:

-   Space Grotesk --- headings and display text.
-   Inter --- body text and interface copy.
-   JetBrains Mono --- technical labels, domains, URLs, and metadata.

### 13.3 Colour Direction

Illustrative initial palette:

  Role                 Colour
  -------------------- -----------------------
  Primary background   Warm white `#F5F4EF`
  Primary text         Dark ink `#252522`
  Accent               Muted red `#C85D43`
  Secondary accent     Soft orange `#D58A58`

Final design tokens will be refined during implementation.

### 13.4 Interface Principles

-   Editorial layouts.
-   Screenshot-led cards.
-   Generous whitespace.
-   Strong typography.
-   Restrained accent colours.
-   Subtle animations.
-   Minimal navigation.
-   Purposeful interactions.

### 13.5 Theme

Light theme only for MVP.

Dark mode is intentionally excluded because it does not fit the chosen
visual direction.

------------------------------------------------------------------------

## 14. Responsive Design

Mobile-first, progressively enhanced.

### Mobile

-   Compact navigation.
-   Search icon that opens the search interface.
-   Horizontally scrollable category chips.
-   Touch-friendly controls.
-   Masonry gallery adapted to available width.
-   No hover-dependent functionality.

### Tablet

-   Expanded navigation when space permits.
-   Always-visible search bar when layout allows.
-   Gallery and card layout adapted to screen width.

### Desktop

-   Always-visible search bar.
-   Full masonry gallery.
-   Richer editorial layouts.
-   Expanded dashboard and moderation interfaces.

------------------------------------------------------------------------

## 15. Loading, Empty and Error States

### Loading

-   Gallery initial load: skeleton cards matching the masonry layout.
-   Individual exhibit loading: centered spinner.
-   Load More: small inline loading indicator.
-   Cached exhibit data should be displayed immediately where possible.

### Empty States

Reusable empty-state component for:

-   No search results.
-   Empty category results.
-   Empty archive.
-   No submissions.
-   No reports.

### Error States

Errors should be understandable and contextual.

The interface must distinguish between:

-   Network errors.
-   Invalid input.
-   Unauthorized actions.
-   Missing exhibits.
-   Temporarily unavailable services.

------------------------------------------------------------------------

## 16. Accessibility and SEO

### Accessibility

The MVP should include:

-   Keyboard navigation.
-   Visible focus states.
-   Appropriate semantic HTML.
-   Sufficient colour contrast.
-   Reduced-motion support.
-   Accessible controls and labels.
-   Touch-friendly interactions.

### SEO

Individual exhibit pages should have:

-   Descriptive page titles.
-   Meta descriptions.
-   Canonical URLs.
-   Open Graph metadata.
-   Social sharing previews.
-   Descriptive, shareable URLs.

Search and filtered gallery pages should be handled thoughtfully to
avoid unnecessary duplicate-indexing issues.

------------------------------------------------------------------------

## 17. Security and Reliability Requirements

Security is a foundational requirement.

The application must include:

-   Server-side authorization.
-   Password hashing.
-   Secure cookie configuration.
-   CSRF protections.
-   Input validation.
-   Rate limiting for sensitive endpoints.
-   Secure file uploads.
-   Database uniqueness constraints.
-   Safe error handling.
-   Audit records for consequential moderation actions.

### SSRF Protection

Because users submit arbitrary website URLs, the backend must protect
itself against server-side request forgery.

URL validation and reachability checks must prevent requests to:

-   Localhost.
-   Private IP ranges.
-   Internal services.
-   Cloud metadata endpoints.
-   Other restricted network destinations.

Redirects must also be checked to prevent bypassing these restrictions.

### File Upload Security

Validate actual file contents, not just filenames or browser-supplied
MIME types.

Apply file size and dimension limits.

Never trust client-provided object keys or ownership claims.

### Data Integrity

Transactions or other concurrency-safe strategies should be used where
necessary, particularly for:

-   Submission approval and exhibit creation.
-   Vote count updates.
-   Account deletion.
-   Related object cleanup.

MongoDB transactions require a deployment configuration that supports
them, such as a replica set.

------------------------------------------------------------------------

## 18. Non-Functional Requirements

### Performance

-   Paginated gallery queries.
-   Appropriate database indexes.
-   Efficient image delivery.
-   Debounced search and category requests.
-   Cached frontend queries where appropriate.
-   Avoid unnecessary database queries.

### Scalability

The MVP targets a modest initial collection and organic growth.

The architecture should allow future improvements without introducing
premature complexity.

### Maintainability

-   Feature-based backend modules.
-   Reusable frontend components.
-   Centralized validation.
-   Centralized error handling.
-   Encapsulated external service integrations.
-   Clear separation of business logic and HTTP concerns.

### Reliability

-   Retryable background jobs.
-   Persistent application data.
-   Safe cleanup operations.
-   Consistent moderation records.
-   Graceful handling of unavailable websites and external providers.

------------------------------------------------------------------------

## 19. Future Possibilities

Potential post-MVP improvements:

-   Multi-device sessions.
-   Advanced search using MongoDB Atlas Search.
-   Image optimization and transformation pipeline.
-   Improved image delivery/CDN configuration.
-   More advanced analytics for administrators.
-   Automatic website change detection.
-   Bookmarking exhibits.
-   More sophisticated discovery recommendations.
-   Additional moderation tools.
-   Public contributor recognition, if it fits the product vision.

These are not MVP commitments.

------------------------------------------------------------------------

## 20. Outstanding Decisions and Implementation Notes

The following details remain to be finalized or verified during
implementation:

1.  Exact website availability failure thresholds and retry intervals.
2.  Whether offline but published exhibits appear in random discovery.
3.  Password hashing algorithm and token rotation details.
4.  Exact moderation endpoint paths and request payloads.
5.  Upload metadata schema and ownership-association lifecycle.
6.  Abandoned-upload cleanup query and safe deletion implementation.
7.  Exact image size and dimension limits.
8.  Exact editorial content length limits.
9.  Final visual design tokens and responsive breakpoints.
10. Deployment platform quotas and pricing at launch.
11. Copyright/takedown policy and public-launch legal review.
12. Concurrency-safe implementation for cached upvote counts and
    duplicate submissions.

These are implementation refinements, not reasons to delay the start of
development.

------------------------------------------------------------------------

## 21. MVP Definition of Done

404 Archive's MVP is considered complete when:

-   Visitors can browse the public archive.
-   Visitors can search, filter, sort, and discover random exhibits.
-   Exhibit pages display editorial content and original website links.
-   Users can register and verify email addresses.
-   Verified users can submit websites.
-   Submissions follow the defined moderation lifecycle.
-   Moderators and administrators can manage submissions and reports.
-   Approved submissions create independent published exhibits.
-   Users can upvote and retract votes.
-   Users can report exhibits.
-   Users have functional dashboards.
-   Administrators can manage categories and user permissions.
-   Screenshots and avatars can be uploaded and deleted safely.
-   Background jobs send emails and perform scheduled checks.
-   The application handles offline websites appropriately.
-   The interface is responsive, accessible, and visually consistent.
-   Core security and data-integrity requirements are implemented.

------------------------------------------------------------------------

## 22. Final Product Principle

404 Archive should never become a feature-heavy social platform
disguised as a website directory.

It is a curated museum.

The collection is the product. The experience is the differentiator.

**Curiosity deserves good design.**

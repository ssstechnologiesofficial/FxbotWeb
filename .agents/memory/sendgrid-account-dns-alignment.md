---
name: SendGrid account and DNS alignment
description: How to avoid breaking authenticated mail when the runtime key and verified DNS belong to different SendGrid accounts.
---

SendGrid domain-authentication CNAME targets are account-specific. If a domain is already verified, first confirm that the application API key belongs to that same SendGrid account before changing DKIM records.

**Why:** A valid DNS setup can appear wrong when inspected through an API key from another SendGrid account. Replacing the verified records would unnecessarily disable authentication for the working account.

**How to apply:** Compare the authenticated domain and generated CNAME targets shown by the account behind the runtime key with the authoritative DNS records. If DNS matches the intended verified account, replace the runtime key securely instead of rewriting DNS.
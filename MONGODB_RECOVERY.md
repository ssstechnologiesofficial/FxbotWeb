# MongoDB Recovery Notes

## Previously observed project configuration

- The application reads its MongoDB connection from the managed `MONGODB_URI` secret.
- An earlier inspection found the Atlas hostname `cluster0.txs7xtj.mongodb.net`.
- That inspection found the configured MongoDB database-access username was `fxbotuser`.
- No database name is specified in the connection string.

That historical hostname was not resolvable during the earlier inspection. The current managed secret must be checked again after Atlas access is recovered; the latest read-only and runtime verification is recorded below.

## Recover the original Atlas account

1. At the MongoDB Atlas sign-in screen, use the account-email recovery option and try each email address that may have been used for the project.
2. Search inboxes for messages from MongoDB Atlas. Search for `Cluster0`, `txs7xtj`, `fxbotuser`, `MongoDB Atlas`, or project invitations.
3. Ask likely teammates or collaborators to check their Atlas Organizations and Projects for a project containing a cluster formerly reachable at `cluster0.txs7xtj.mongodb.net`.
4. If an Atlas organization is found but the intended user is not a member, have an organization owner invite that email address with project access.
5. Once access is recovered, confirm whether the original cluster is paused, deleted, or renamed. Resume it only if it is the original cluster containing the project data.

## Restore the project safely

1. In the original Atlas project, use the cluster's Connect flow to create a fresh Node.js connection string.
2. Verify Database Access includes `fxbotuser` or create a replacement database user with the minimum required permissions.
3. Apply and review the **Chosen Atlas Network Access strategy** below. Do not use a one-off Replit egress-IP rule.
4. Replace only the managed `MONGODB_URI` secret in Replit. Do not add the URI to source files, commits, logs, or chat.
5. Restart the `Start application` workflow. Confirm its logs include `MongoDB Connected:` and do not include `Database connection error` or `Failed to connect to database`.
6. Run read-only checks for users, investments, transactions, deposits, and withdrawals to confirm the original data is present.


## Runtime restart verification

On 2026-08-24, after the Atlas Project Owner applied the stable Network Access rule, the application was restarted with its normal production workflow. The startup log recorded `MongoDB Connected:` for the configured Atlas replica host, with no database connection error, and the health endpoint responded successfully. The repeatable `npm run verify:mongodb` check also completed an authenticated MongoDB primary ping. This confirms the application reconnects after a runtime restart without relying on a one-off Replit egress-IP rule.

The duplicate uncaught startup connection attempt was removed so a future external connectivity blocker does not stop the web process. Collection and financial-data confirmation remain a separate read-only step.

## Atlas Network Access for Replit

Replit does not provide a stable, dedicated outbound IP address. An Atlas rule that allows only the IP address seen during one Replit run can fail after the application restarts.


### Approved approaches

1. **Direct Replit access** — allow `0.0.0.0/0` in Atlas Network Access, then protect the database with TLS, a unique strong database password stored only as a managed secret, and a least-privilege database user. This is the practical direct-connect option when no stable egress network is available.
2. **Static-egress intermediary** — route database traffic through separately managed infrastructure with a fixed outbound IP, then allowlist only that IP in Atlas.
3. **Private managed database** — move the database only after an approved backup and migration plan, using a service with private or platform-native connectivity.

Never use a single temporary Replit runtime IP as the only Atlas allowlist rule.


### Chosen strategy and ownership

This deployment uses the **Direct Replit access** strategy. The Atlas Project Owner must maintain the following Atlas **Network Access → IP Access List** rule:

| Setting | Required value |
| --- | --- |
| IP address / CIDR | `0.0.0.0/0` |
| Comment | `Replit deployment – dynamic egress; reviewed 2026-08-24` |
| Scope | Only the Atlas project that contains this application's original data |

This broad CIDR is allowed only with TLS, a dedicated least-privilege database user, and a password stored solely in the managed `MONGODB_URI` secret. Replace it with a documented static-egress or approved private-network control if one becomes available.

- **Atlas Project Owner (accountable):** applies, reviews, and removes the rule in the original Atlas project.
- **Replit deployment owner (responsible):** maintains the managed secret, restarts the application after a secret or Atlas change, and alerts the Atlas Project Owner if connectivity fails.
- **Change record:** the Atlas rule comment identifies this Replit deployment and review date; do not record credentials, connection strings, or personal contact details in this repository.

The Atlas Project Owner confirmed the rule update before the successful restart verification below. This workspace cannot inspect the Atlas UI directly; the MongoDB connection and ping checks provide the independent runtime verification.

## If the original Atlas account or cluster is unavailable

Do not create a replacement database and point the application at it yet. First determine whether a backup, export, former cluster owner, or Atlas support recovery path exists. A new empty database would make the application start, but would not recover customer, wallet, or transaction data.

Only after written approval should a new database be created and a migration/recovery plan executed.

## Read-only recovery verification — 2026-08-24

- The managed `MONGODB_URI` currently identifies the Atlas hostname `cluster0.vddni2d.mongodb.net`. The URI was inspected without exposing credentials; no database name is specified.
- Before the Network Access rule was applied, a read-only connection attempt reached the current Atlas replica hosts but could not select a primary.
- After the Atlas Network Access rule was confirmed active, the application reconnected successfully after a runtime restart.
- The connection resolves to the default `test` database. The five required collections exist but contain zero records: `users`, `investments`, `transactions`, `deposits`, and `withdrawals`.
- A read-only database listing found only `test`, `admin`, and `local`; no separate populated application database was visible through the current connection.
- Repository and Git-history review found no approved Atlas backup, export, MongoDB dump, or original records. The only relevant material is this recovery documentation and the application schemas in `server/database.js`.
- No restore, migration, replacement database, or financial-data write was performed. Financial operations must remain paused until the original records are located.

### Recovery decision

The current Atlas connection is technically healthy, but it points to an empty database and is not yet verified as the original data source. Recovery is therefore blocked pending confirmation of the original Atlas project/database or an approved backup/export, together with written approval for any restore or migration.

## Isolated synthetic test database

Because the original customer data source is unavailable, an isolated `fxbot_test` database may be used for development-only testing. This is **not** a recovery, restore, or migration of customer data:

- `npm run seed:mongodb-test -- --confirm` connects to the existing Atlas cluster but explicitly selects `fxbot_test`.
- The seed contains only synthetic records using reserved `.invalid` email addresses and test-only wallet values.
- The command replaces only records carrying its own seed marker and does not modify the current `test` database.
- It does not change the managed `MONGODB_URI`, which must remain pointed at the currently verified-but-empty source until the original source is identified.
- Synthetic data must never be presented as customer history or used to resume financial operations.

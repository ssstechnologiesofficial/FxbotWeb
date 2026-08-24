# MongoDB Recovery Notes

## Previously observed project configuration

- The application reads its MongoDB connection from the managed `MONGODB_URI` secret.
- An earlier inspection found the Atlas hostname `cluster0.txs7xtj.mongodb.net`.
- That inspection found the configured MongoDB database-access username was `fxbotuser`.
- No database name is specified in the connection string.

That hostname was not resolvable during the earlier inspection. The current managed secret must be checked again after Atlas access is recovered; the latest read-only verification is recorded below.

## Recover the original Atlas account

1. At the MongoDB Atlas sign-in screen, use the account-email recovery option and try each email address that may have been used for the project.
2. Search inboxes for messages from MongoDB Atlas. Search for `Cluster0`, `txs7xtj`, `fxbotuser`, `MongoDB Atlas`, or project invitations.
3. Ask likely teammates or collaborators to check their Atlas Organizations and Projects for a project containing a cluster formerly reachable at `cluster0.txs7xtj.mongodb.net`.
4. If an Atlas organization is found but the intended user is not a member, have an organization owner invite that email address with project access.
5. Once access is recovered, confirm whether the original cluster is paused, deleted, or renamed. Resume it only if it is the original cluster containing the project data.

## Restore the project safely

1. In the original Atlas project, use the cluster's Connect flow to create a fresh Node.js connection string.
2. Verify Database Access includes `fxbotuser` or create a replacement database user with the minimum required permissions.
3. Verify Network Access permits the application's outbound connection. Avoid broadly exposing the database when a narrower rule is possible.
4. Replace only the managed `MONGODB_URI` secret in Replit. Do not add the URI to source files, commits, logs, or chat.
5. Restart the application and confirm it connects before making any data changes.
6. Run read-only checks for users, investments, transactions, deposits, and withdrawals to confirm the original data is present.

## If the original Atlas account or cluster is unavailable

Do not create a replacement database and point the application at it yet. First determine whether a backup, export, former cluster owner, or Atlas support recovery path exists. A new empty database would make the application start, but would not recover customer, wallet, or transaction data.

Only after written approval should a new database be created and a migration/recovery plan executed.

## Read-only recovery verification — 2026-08-24

- The managed `MONGODB_URI` currently identifies the Atlas hostname `cluster0.vddni2d.mongodb.net`. The URI was inspected without exposing credentials; no database name is specified.
- A read-only connection attempt failed before authentication or database inspection. The current environment could not resolve the Atlas hostname, so the project identity and cluster contents could not be confirmed.
- The five required collection checks were attempted but no counts were available: `users`, `investments`, `transactions`, `deposits`, and `withdrawals`.
- Repository and Git-history review found no approved Atlas backup, export, MongoDB dump, or original records. The only relevant material is this recovery documentation and the application schemas in `server/database.js`.
- No restore, migration, replacement database, or financial-data write was performed. Financial operations must remain paused.

### Recovery decision

The original Atlas project and an approved source containing the original records remain unidentified. Recovery is therefore blocked pending Atlas account/project confirmation or an approved backup/export, together with written approval for any restore or migration.
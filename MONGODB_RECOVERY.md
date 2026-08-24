# MongoDB Recovery Notes

## Confirmed project configuration

- The application reads its MongoDB connection from the managed `MONGODB_URI` secret.
- The currently configured Atlas hostname is `cluster0.txs7xtj.mongodb.net`.
- The configured MongoDB database-access username is `fxbotuser`.
- No database name is specified in the connection string.

The application cannot currently resolve the Atlas SRV record for this hostname. This means the configured cluster address is no longer available. It is not an authentication or application-code failure.

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
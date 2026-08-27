# link-lock

Simple small app to store a URL protected by a password and an optional hint.

How it works
- Create a locked link by providing the target URL, a password, and an optional hint.
- The app stores the URL and a bcrypt hash of the password.
- Visiting the generated locked link asks for the password; if correct the app redirects to the stored URL.

Run locally

1. cd link-lock
2. npm install
3. npm start

The app listens on port 3000 by default.

Notes
- The app stores data in `link-lock/data.db` (SQLite) in the repo folder.
- Passwords are stored as bcrypt hashes using `bcryptjs`.

Possible improvements
- Add expiration for links
- Add optional one-time use
- Add admin interface to list/delete links

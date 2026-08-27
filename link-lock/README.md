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

---

Deploy to Render (one-click)

Click the link below to deploy this repository to Render. You will be asked to sign in to Render and grant access to this GitHub repository. In the Render dashboard choose "Web Service" and the service defined in `render.yaml` will be picked up automatically.

- Deploy to Render: https://dashboard.render.com/new?repo=https://github.com/georgesamir8/george

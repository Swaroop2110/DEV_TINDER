# DEV_TINDER

## Run locally

Create a `.env` file in the project root with your MongoDB Atlas connection string:

```text
MONGO_URI=mongodb+srv://<database-user>:<url-encoded-password>@cluster0.mpxlfut.mongodb.net/devTinder?retryWrites=true&w=majority
```

Use the database user's username and password from Atlas **Database Access**, not your Atlas account login. URL-encode special characters in the username or password (for example, `@` becomes `%40`). Keep `.env` private; it is excluded from Git.

Then run:

```powershell
npm run dev
```

The app starts listening on port 3000 only after it connects to MongoDB.
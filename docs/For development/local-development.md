# Local Development Guide

## Using the Firebase Emulator Suite

For a robust local development workflow, especially when working with backend logic like Firestore security rules and indexes, using the Firebase Emulator Suite is highly recommended.

### Why Use the Emulator?

1.  **Offline Development**: Work on your application without needing a live connection to your production Firebase project.
2.  **Safety**: Test security rules and database changes in a safe, local environment without fear of affecting production data.
3.  **Automatic Index Suggestions**: The Firestore emulator automatically detects queries that would be slow in production and logs a `firebase.indexes.json` configuration to the terminal, telling you exactly what index you need to add.

### How to Use the Firestore Emulator

1.  **Installation**: If you haven't already, make sure the Firebase CLI is installed and you are logged in (`firebase login`).

2.  **Configuration**: Your project should already have a `firebase.json` file. Ensure it's configured to use the Firestore emulator. A typical configuration looks like this:
    ```json
    {
      "firestore": {
        "rules": "firestore.rules",
        "indexes": "firestore.indexes.json"
      },
      "emulators": {
        "auth": {
          "port": 9099
        },
        "firestore": {
          "port": 8080
        },
        "storage": {
            "port": 9199
        },
        "ui": {
          "enabled": true
        }
      }
    }
    ```

3.  **Start the Emulator**: Run the following command from your project's root directory:
    ```bash
    firebase emulators:start --only firestore
    ```
    *Tip: You can start multiple emulators (e.g., `... --only firestore,auth,storage`).*

4.  **Connect Your App**: The application's Firebase configuration in `src/lib/firebase.ts` should be updated to automatically connect to the emulators when they are running.

5.  **Look for Index Suggestions**: As you navigate your local application and trigger Firestore queries, watch the terminal where the emulator is running. If a query requires a composite index that is not defined in your `firestore.indexes.json`, the emulator will print a message like this:

    > **Firestore:** The query requires an index. You can create it here: ...

    It will also provide the exact JSON block you need to add to your `firestore.indexes.json` file. This is the most reliable way to discover and create the indexes your application needs as you develop new features.

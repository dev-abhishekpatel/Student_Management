# StudentManagement

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.1.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Project setup (local demo)

1. Install dependencies:

```bash
npm install
```

2. Development server:

```bash
ng serve --open
```

3. Firebase emulator (recommended demo backend):

- Install Firebase CLI globally if you don't have it:

```bash
npm install -g firebase-tools
```

- Initialize Firebase in the project and enable Emulators (Auth, Firestore, Storage):

```bash
firebase init
# select Firestore, Functions (optional), Hosting, Emulators
```

- Start the emulators:

```bash
firebase emulators:start
```

4. Notes:
- This project uses Bootstrap 5 for responsive UI and a demo Firebase setup.
- After connecting a Firebase project or running emulators, set up `environment` values in `src/environments`.

## Demo seeding

To create demo users and sample data using the Firebase Admin SDK, run a seed
script locally. Add your service account JSON to `scripts/serviceAccount.json`
and then implement `scripts/seed-demo.js` to create users in Auth and documents
in Firestore. For safety, this repository includes a seed stub at `scripts/seed-demo.js`.

## Deployment (Firebase Hosting)

1. Build the production app:

```bash
npm run build -- --configuration production
```

2. Initialize Firebase hosting (if not already):

```bash
firebase init hosting
# set public directory to dist/student-management
```

3. Deploy (locally):

```bash
firebase deploy --only hosting
```

4. CI deploy: add a `FIREBASE_TOKEN` secret to your GitHub repository (run `firebase login:ci` locally to get a token) and pushes to `main` will auto-deploy via GitHub Actions.


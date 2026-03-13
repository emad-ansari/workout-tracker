import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xk59bvmh',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
    path: [
      '../app/**/*.{ts,tsx,js,jsx}',
      '../components/**/*.{ts,tsx,js,jsx}',
      '../lib/**/*.{ts,tsx,js,jsx}',
      '../hooks/**/*.{ts,tsx,js,jsx}',
      './**/*.{ts,tsx,js,jsx}', // also scan sanity folder itself
    ],
    schema: 'schema.json', // path to your schema file, generated with 'sanity schema extract' command
    generates: '../lib/sanity/sanity.types.ts', // path to the output file for generated type definitions
    overloadClientMethods: true, // set to false to disable automatic overloading the sanity client
  },
})

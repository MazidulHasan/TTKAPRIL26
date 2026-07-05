// Centralised configuration for the test suite.
// Values can be overridden through environment variables so the same
// suite can run against different environments / users without code changes.

const BASE_URL = process.env.BASE_URL || 'https://qa.taltektc.com';

const config = {
  // Base application under test
  baseURL: BASE_URL,

  // Key application URLs (relative paths are resolved against baseURL)
  urls: {
    login: '/index.html',
    home: '/home.html',
    dropDown: '/drop-down.html',
    alert: '/alert.html',
    iframe: '/iframe.html',
    dragDrop: '/drag-drop.html',
    slider: '/slider.html',
    windows: '/switching-windows.html',
    rightClick: '/right-click-action.html',
    scrolling: '/scrolling-up-down.html',
    usersTable: '/users-table.html',
  },

  // External demo sites used by some tests
  external: {
    fileUpload: 'https://demo.automationtesting.in/FileUpload.html',
  },

  // Default credentials (override with env vars in CI / locally)
  credentials: {
    admin: {
      username: process.env.ADMIN_USER || 'test1212@gmail.com',
      password: process.env.ADMIN_PASS || 'test1212',
    },
  },

  // Where the authenticated storage state is persisted
  storageState: process.env.STORAGE_STATE || 'playwright/.auth/user.json',
};

module.exports = { config };

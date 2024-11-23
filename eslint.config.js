// eslint.config.js
module.exports = [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: "module",
      globals: {
        browser: true,
        es2021: true,
        GM_xmlhttpRequest: "readonly",
        GM_getResourceText: "readonly",
        GM_addStyle: "readonly",
        document: "readonly",
        window: "readonly",
        alert: "readonly",
        console: "readonly",
        getComputedStyle: "readonly",
        html2canvas: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "error"
    }
  }
];
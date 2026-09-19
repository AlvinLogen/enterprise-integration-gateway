export default [
  {
    files: ["src/**/*.js", "test/**/*.js"],
    languageOptions: { ecmaVersion: 2023, sourceType: "module" },
    rules: {
      "no-unused-vars": "error",
      "no-undef": "off",
      "no-console": "error",
    },
  },
];

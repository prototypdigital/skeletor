module.exports = {
  root: true,
  extends: "@react-native",
  plugins: ["simple-import-sort", "import"],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    curly: ["error", "multi-line"],
    "react-hooks/exhaustive-deps": "warn",
    "react-native/no-inline-styles": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
  },
};

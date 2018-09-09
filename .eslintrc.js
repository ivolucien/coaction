module.exports = {
  "extends": "standard",
  "env": {
    "mocha": true
  },
  "rules": {
    "no-unused-vars": [
      "error",
      {
        "varsIgnorePattern": "should|expect"
      }
    ]
  }
};

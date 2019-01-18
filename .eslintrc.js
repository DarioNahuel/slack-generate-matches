module.exports = {
    "env": {
        "node": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "linebreak-style": 0,
        "strict": "off",
        "comma-dangle": [
            "error",
            "never"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "indent": [
            "error",
            2
        ],
        "space-before-function-paren": [
            "error", { "anonymous": "never", "named": "always" }
        ],
        "class-methods-use-this": "off",
        "object-curly-newline": [
            "error", { "multiline": true }
        ],
        "global-require": "off",
        "arrow-parens": [
            "error",
            "as-needed"
        ],
        "no-param-reassign": [
            "error", { "props": false }
        ],
        "comma-dangle": [
            "error",
            {
                "arrays": "always-multiline",
                "exports": "always-multiline",
                "functions": "never",
                "imports": "always-multiline",
                "objects": "always-multiline"
            }
        ],
      },
      "globals": {
        "use": true
      }
};

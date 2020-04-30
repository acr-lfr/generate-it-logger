# generate-it-logger

This logger uses Winston under the hood. It is a simple one liner installation to convert plain old console logs to formatted loggin based on the apps packag.json file.

## How to use
Just include this package once and before everything else:
```typescript
import 'generate-it-logger';
```

That is it.

## What happens
The package will read your API's package json file and use this data to better format the console logs, read this packages index.js file for how.

## What is configurable
You can configure this package with env variables (ie a .env file or real env vars).

This package will not do anything to the console functions:
```javascript
if (process.env.ENVIRONMENT && process.env.ENVIRONMENT === 'develop')
```

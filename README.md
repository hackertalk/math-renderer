# Math Renderer

## Using the AWS CLI and esbuild to deploy TypeScript code to Lambda

esbuild produces one JavaScript file with all dependencies. This is the only file that you need to
add to the .zip archive.

## Deploying the function to AWS Lambda

- Create a new Lambda function on aws console, function name: `math-renderer`
- Run `yarn install & yarn build`, upload dist/index.zip file to lambda function
- Set the handler to `index.handler`
- Set the runtime to `Node.js 18.x`

Done!

## Testing the function


## References

1. [typescript package](https://docs.aws.amazon.com/lambda/latest/dg/typescript-package.html)


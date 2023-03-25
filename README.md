# Math Renderer

![](./schematic-diagram.png)

## Deploying the function to AWS Lambda

esbuild produces one JavaScript file with all dependencies. This is the only file that you need to
add to the .zip archive.

Steps:

- Create a new Lambda function on aws console, function name: `math-renderer`
- Run `yarn install & yarn build`, upload dist/index.zip file to lambda function
- Set the handler to `index.handler`
- Set the runtime to `Node.js 18.x`

Done!

## Use AWS Codebuild to build and deploy

- Create a new Codebuild project, project name: `math-renderer`
- Set the source to `https://github.com/hackertalk/math-renderer`
- Set the buildspec to `buildspec.yml`
- Set the environment to `Managed image`, operating system: `Ubuntu`, runtime: `Standard`,
  image: `aws/codebuild/standard:6.0`, environment type: `Linux`
- Select `New service role`, role name: `codebuild-math-renderer-service-role`

After creating the project, open IAM console, find the role `codebuild-math-renderer-service-role`,
attach the policy `AWSLambdaFullAccess` to it.
Or you can create a new policy and attach it to the role.

Required permissions:
actions: `lambda:UpdateFunctionCode`, `lambda:UpdateFunctionConfiguration`
Resource: `arn:aws:lambda:my-region:my-aws-account-id:function:math-renderer`

## Use AWS Lambda@Edge and CloudFront to render math

Change runtime handler to `index.edgeHandler` on aws console.

## Testing the function

![](https://math.hackertalk.io/math?color=%23EAAA08&block=%5Cbegin%7Baligned%7D%0A%5Cnabla%20%5Ctimes%20%5Cvec%7B%5Cmathbf%7BB%7D%7D%20-%5C%2C%20%5Cfrac1c%5C%2C%20%5Cfrac%7B%5Cpartial%5Cvec%7B%5Cmathbf%7BE%7D%7D%7D%7B%5Cpartial%20t%7D%20%26%20%3D%20%5Cfrac%7B4%5Cpi%7D%7Bc%7D%5Cvec%7B%5Cmathbf%7Bj%7D%7D%20%5C%5C%20%20%20%0A%5Cnabla%20%5Ccdot%20%5Cvec%7B%5Cmathbf%7BE%7D%7D%20%26%20%3D%204%20%5Cpi%20%5Crho%20%5C%5C%0A%5Cnabla%20%5Ctimes%20%5Cvec%7B%5Cmathbf%7BE%7D%7D%5C%2C%20%2B%5C%2C%20%5Cfrac1c%5C%2C%20%5Cfrac%7B%5Cpartial%5Cvec%7B%5Cmathbf%7BB%7D%7D%7D%7B%5Cpartial%20t%7D%20%26%20%3D%20%5Cvec%7B%5Cmathbf%7B0%7D%7D%20%5C%5C%0A%5Cnabla%20%5Ccdot%20%5Cvec%7B%5Cmathbf%7BB%7D%7D%20%26%20%3D%200%20%5Cend%7Baligned%7D%0A)

![](https://math.hackertalk.io/math?color=red&block=%5Cint%20u%20%5Cfrac%7Bdv%7D%7Bdx%7D%5C%2Cdx%3Duv-%5Cint%20%5Cfrac%7Bdu%7D%7Bdx%7Dv%5C%2Cdx)

![](https://math.hackertalk.io/math?color=blue&block=%5Cint%20u%20%5Cfrac%7Bdv%7D%7Bdx%7D%5C%2Cdx%3Duv-%5Cint%20%5Cfrac%7Bdu%7D%7Bdx%7Dv%5C%2Cdx)

## References

1. [Nodejs + Serverless 实现 LaTeX 公式渲染服务](https://markdowner.net/article/235800197744746496)
2. [typescript package](https://docs.aws.amazon.com/lambda/latest/dg/typescript-package.html)

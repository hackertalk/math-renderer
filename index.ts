import {
  Context,
  APIGatewayProxyResult,
  APIGatewayEvent,
  CloudFrontRequestEvent,
  CloudFrontResponseResult,
} from 'aws-lambda';
import querystring from 'querystring';
import { tex2svg } from './adapter';

const DOCTYPE = `<?xml version="1.0" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
`;

/**
 * handler for cloudfront edge
 * */
export const edgeHandler = async (
  event: CloudFrontRequestEvent,
  context: Context
): Promise<CloudFrontResponseResult> => {
  const { request } = event.Records[0].cf;
  const params = querystring.decode(request.querystring);
  let isInline = false;
  let equation = '';
  if (params?.inline && typeof params.inline === 'string') {
    isInline = true;
    equation = params.inline;
  } else if (params?.block && typeof params.block === 'string') {
    isInline = false;
    equation = params.block;
  } else {
    return {
      status: '400',
      body: JSON.stringify({ message: 'Missing required query parameter: inline or block' }),
    };
  }
  const color = params?.color as string | undefined;
  const alternateColor = params?.alternateColor as string | undefined;
  if (
    (color && /[^a-zA-Z0-9#]/.test(color)) ||
    (alternateColor && /[^a-zA-Z0-9#]/.test(alternateColor))
  ) {
    return {
      status: '400',
      body: JSON.stringify({ message: 'Invalid color:' + color + ' or ' + alternateColor }),
    };
  }

  try {
    const SVG = tex2svg(equation, isInline, color, alternateColor);
    return {
      status: '200',
      headers: {
        'cache-control': [{ key: 'Cache-Control', value: 'public, max-age=2592000' }],
        'content-type': [{ key: 'Content-Type', value: 'image/svg+xml' }],
      },
      body: DOCTYPE + SVG,
    };
  } catch (e) {
    console.log('Render Error, function version:', context.functionVersion);
    return {
      status: '500',
      body: `<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" font-size="16">${e}</text></svg>`,
    };
  }
};

/**
 * handler for api gateway or function url
 * */
export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const { queryStringParameters: params } = event;
  let isInline = false;
  let equation = '';
  if (params?.inline) {
    isInline = true;
    equation = params.inline;
  } else if (params?.block) {
    isInline = false;
    equation = params.block;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required query parameter: inline or block' }),
    };
  }
  const color = params?.color;
  const alternateColor = params?.alternateColor;
  if (
    (color && /[^a-zA-Z0-9#]/.test(color)) ||
    (alternateColor && /[^a-zA-Z0-9#]/.test(alternateColor))
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid color:' + color + ' or ' + alternateColor }),
    };
  }

  try {
    const SVG = tex2svg(equation, isInline, color, alternateColor);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=2592000',
      },
      body: DOCTYPE + SVG,
    };
  } catch (e) {
    console.log('Render Error, function version:', context.functionVersion);
    return {
      statusCode: 500,
      body: `<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" font-size="16">${e}</text></svg>`,
    };
  }
};

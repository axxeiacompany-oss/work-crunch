export default async function handler(_req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    restaurant: 'Wok Crunch Oriental',
    version: '1.0.0',
    platform: 'vercel-serverless',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
}

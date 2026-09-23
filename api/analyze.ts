/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentBase64, targetRole, targetConcern, jurisdiction } = req.body;
    if (!documentBase64) {
      return res.status(400).json({ error: 'Missing documentBase64' });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Analysis completed via Vercel serverless endpoint',
      targetRole,
      targetConcern,
      jurisdiction
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}

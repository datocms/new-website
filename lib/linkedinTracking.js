import axios from 'axios';

const LINKEDIN_API_URL = 'https://www.linkedin.com/event';

export const trackLinkedInConversion = async (conversionId, eventType) => {
  try {
    const response = await axios.post(LINKEDIN_API_URL, {
      conversionId,
      eventType,
      metadata: {
      },
    }, {
      headers: {
        Authorization: `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error('LinkedIn Conversion Tracking Error:', error);
  }
};

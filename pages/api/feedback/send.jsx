import { sql } from '@vercel/postgres';

const subscribe = async ({ method, body }, res) => {
  if (method !== 'POST') {
    return res.status(404).send('Invalid endpoint!');
  }

  const errors = {};

  for (const field of ['namespace', 'url', 'reaction']) {
    if (!body[field]) {
      errors[field] = 'This field is required';
    }
  }

  if (
    body.email &&
    !body.email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,20}$/i)
  ) {
    errors.email = 'Please insert a valid email';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ success: false, errors });
  }

  try {
    const { rows } = await sql`
        INSERT INTO feedbacks (namespace, url, reaction, notes, email)
        VALUES (${body.namespace}, ${body.url}, ${body.reaction}, ${body.notes}, ${body.email})
      `;

    res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ success: false });
  }
};

export default subscribe;

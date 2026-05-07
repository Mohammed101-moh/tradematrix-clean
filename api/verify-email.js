export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false });
  }

  try {
    const response = await fetch(
      `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );

    const data = await response.json();

    if (
      !data.is_valid_format.value ||
      data.deliverability !== "DELIVERABLE"
    ) {
      return res.status(400).json({ success: false });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ success: false });
  }
}

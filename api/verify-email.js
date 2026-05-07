export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  try {
    const response = await fetch(
      `https://emailreputation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`
    );

    const data = await response.json();

    console.log("Abstract API response:", data);

    const isValidFormat = data?.is_valid_format?.value === true;
    const isDeliverable = data?.deliverability === "DELIVERABLE";
    const isDisposable = data?.is_disposable_email?.value === true;

    if (!isValidFormat || !isDeliverable || isDisposable) {
      return res.status(400).json({
        success: false,
        message: "Please enter a real email address.",
        debug: data
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Email verification unavailable"
    });
  }
}

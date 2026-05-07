export default async function handler(req, res) {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required"
    });
  }

  try {
    const response = await fetch(
      `https://emailreputation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${email}`
    );

    const data = await response.json();

    console.log("Abstract API response:", data);

    // ✅ CORRECT checks for Email Reputation API
    const isValidFormat = data?.email_deliverability?.is_format_valid === true;
    const isDeliverable = data?.email_deliverability?.status === "deliverable";
    const isDisposable = data?.email_quality?.is_disposable === true;

    if (!isValidFormat || !isDeliverable || isDisposable) {
      return res.status(400).json({
        success: false,
        message: "Please enter a real email address."
      });
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Error verifying email:", error);

    return res.status(500).json({
      success: false,
      message: "Email verification unavailable"
    });
  }
}

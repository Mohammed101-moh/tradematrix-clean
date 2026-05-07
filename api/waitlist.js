export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { name, email, traderType, market, price } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email." });
  }

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: `🚀 New TradeMatrx waitlist signup:

Name: ${name || ""}
Email: ${email}
Trader Type: ${traderType || ""}
Market Problem: ${market || ""}
Price: ${price || ""}`
    })
  });

  await fetch(process.env.GOOGLE_SHEET_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: name || "",
      email: email || "",
      traderType: traderType || "",
      market: market || "",
      price: price || ""
    })
  });

  return res.status(200).json({
    success: true,
    message: "You have successfully joined the waitlist. We will directly inform you as soon as the platform launches."
  });
}

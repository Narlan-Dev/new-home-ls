const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

async function sendGiftNotification({
  giftName,
  giftPrice,
  userName,
  userPhone,
}) {
  const toS = [
    process.env.WHATSAPP_NOTIFY_NUMBER,
    process.env.WHATSAPP_NOTIFY_NUMBER_2,
    process.env.WHATSAPP_NOTIFY_NUMBER_3,
  ];

  if (!toS) return;

  const body =
    `🎁 *Presente selecionado!*\n\n` +
    `*Presente:* ${giftName}\n` +
    `*Valor:* R$ ${Number(giftPrice).toFixed(2)}\n` +
    `*Selecionado por:* ${userName}\n` +
    `*Telefone:* ${userPhone}`;

  try {
    for (const to of toS) {
      const res = await client.messages.create({
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:${to}`,
        body,
      });
      console.log(`[WhatsApp] Mensagem enviada para ${to} - SID: ${res.sid}`);
    }
  } catch (err) {
    console.error(`[WhatsApp] Erro ao enviar: ${err.message}`);
  }
}

module.exports = { sendGiftNotification };

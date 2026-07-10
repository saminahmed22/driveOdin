// QR JS
import QRCode from "qrcode";

export async function generateQR(text) {
  try {
    return await QRCode.toString(text, { type: "svg", width: 150 });
  } catch (err) {
    console.error(err);
  }
}

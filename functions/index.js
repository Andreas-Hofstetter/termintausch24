// Firebase Functions + Admin SDK
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

admin.initializeApp();

/**
 * HTTP Function: Glückskeks
 * Beispiel: https://europe-west1-<PROJECT_ID>.cloudfunctions.net/glueckskeks
 */
exports.glueckskeks = onRequest((req, res) => {
  const ran = Math.floor(Math.random() * 4);
  const messages = [
    "Heute findest du einen tollen Termin.",
    "Dein nächster Termin wird super!",
    "Etwas Großartiges steht dir bevor.",
    "Du wirst viel Geld sparen."
  ];
  res.send(`Dein Glückskeks sagt: ${messages[ran]}`);
});


/**
 * Firestore Trigger: wenn ein Termin auf "verkauft" springt
 */
exports.onStatusVerkauft = onDocumentUpdated("termine/{terminId}", (event) => {
  const before = event.data.before.data();
  const after = event.data.after.data();

  if (before.status !== "verkauft" && after.status === "verkauft") {
    console.log(`Termin ${event.params.terminId} wurde verkauft.`);
    // hier deine Logik einfügen (z.B. Nachricht senden)
  }
  return null;
});

/**
 * Scheduled Function: Aufräumen von Resellern
 */
exports.cleanupReseller = onSchedule("every 24 hours", (event) => {
  console.log("Reseller cleanup läuft...");
  // hier deine Cleanup-Logik einfügen
  return null;
});
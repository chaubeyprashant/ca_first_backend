// import admin from '../firebase.js'; // Adjust the path accordingly

// export const sendNotification = async (req, res) => {
//   const { tokens, title, description, image, route } = req.body;

//   if (!tokens || !Array.isArray(tokens) || tokens.length === 0) {
//     return res.status(400).json({ message: 'FCM tokens are required' });
//   }

//   const message = {
//     notification: {
//       title: title || 'No title',
//       body: description || 'No description',
//     },
//     data: {
//       route: route || '',
//       image: image || '',
//     },
//   };

//   try {
//     const responses = await admin.messaging().sendEachForMulticast({
//       tokens: tokens,
//       ...message
//     });

//     const failedTokens = responses.responses
//       .filter(response => !response.success)
//       .map((response, idx) => tokens[idx]);

//     res.status(200).json({
//       success: true,
//       responses: responses.responses,
//       failedTokens: failedTokens
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

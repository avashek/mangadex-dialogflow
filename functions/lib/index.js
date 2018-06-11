"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const dialogflow_fulfillment_1 = require("dialogflow-fulfillment");
const admin = require("firebase-admin");
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
admin.initializeApp(functions.config().firebase);
exports.dialogflowMangadexFulfillment = functions.https.onRequest((request, response) => {
    const agent_main = new dialogflow_fulfillment_1.WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
    function welcome(agent) {
        agent.add(`Welcome to my weeb agent!`);
    }
    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }
    // // Uncomment and edit to make your own intent handler
    // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);'
    // // below to get this function to be run when a Dialogflow intent is matched
    function yourFunctionHandler(agent) {
        const requestBody = request.body;
        const chatId = requestBody['queryResult']['outputContexts'][0]['parameters']['telegram_chat_id'];
        console.log(chatId);
        agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
        agent.add(new dialogflow_fulfillment_1.Card({
            title: `Title: this is a card title`,
            imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
            text: `This your chat id 🅱️igga ` + chatId,
            buttonText: 'This is a button',
            buttonUrl: 'https://assistant.google.com/'
        }));
        agent.add(new dialogflow_fulfillment_1.Suggestion(`Quick Reply`));
        agent.add(new dialogflow_fulfillment_1.Suggestion(`Suggestion`));
        agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' } });
        //let users = functions.database.ref('/users');
        //console.log(users);
        //    var rootRef = firebase.database().ref();
        //console.log(rootRef);
    }
    function getMangaList(agent) {
        const requestBody = request.body;
        const chatId = requestBody['queryResult']['outputContexts'][0]['parameters']['telegram_chat_id'];
        console.log(chatId);
        admin.firestore().collection('users').where('userId', '==', chatId).limit(1).get()
            .then(snapshot => {
            const user = snapshot.docs[0];
            let mangaList = [];
            if (!user) {
                // If user is not in DB, its their first time, Welcome them!
                agent.add('Welcome to my app for the first time!');
                // Add the user to DB
                admin.firestore().collection('users').add({
                    userId: chatId
                }).then(ref => {
                    console.log('Added document with ID: ', ref.id);
                }).catch(err => console.log(err));
                agent.setContext({ name: 'Get manga list', lifespan: 2, parameters: { mangaList: mangaList } });
            }
            else {
                // User in DB
                console.log("User in db");
                agent.add('Welcome back!');
                mangaList = user['mangaList'];
                console.log("user", user);
                agent.setContext({ name: 'Get manga list', lifespan: 2, parameters: { mangaList: mangaList } });
            }
        }).catch(err => console.log(err));
    }
    // // Uncomment and edit to make your own Google Assistant intent handler
    // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
    // // below to get this function to be run when a Dialogflow intent is matched
    // function googleAssistantHandler(agent) {
    //   let conv = agent.conv(); // Get Actions on Google library conv instance
    //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
    //   agent.add(conv); // Add Actions on Google library responses to your agent's response
    // }
    // // See https://github.com/dialogflow/dialogflow-fulfillment-nodejs/tree/master/samples/actions-on-google
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample
    // Run the proper function handler based on the matched Dialogflow intent name
    const intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('reeee', yourFunctionHandler);
    intentMap.set('Get manga list', getMangaList);
    // intentMap.set('your intent name here', googleAssistantHandler);
    agent_main.handleRequest(intentMap);
});
//# sourceMappingURL=index.js.map
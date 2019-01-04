/* eslint-disable  func-names */
/* eslint-disable  no-console */

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
///// skill name: prototype (tempalte)
////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////



const Alexa = require('ask-sdk');



/* DATA SETUP */
var currentStep = 0;
// ---------------------------------------------------------------------------------- START EDIT HERE
const totalStep = 4; 

const HELLO_MESSAGE = '<audio src="soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01"/> Hello. <break time="300ms"/> What can I help you with?';
const HELLO_REPROMPT = "What can I help you with?";

const ERROR_MESSAGE_FOR_REQUEST = 'Sorry, I didn’t get that. <break time="1100ms"/>'; // Reprompt msg will follow after
const STOP_MESSAGE = 'Have a good day';
// ---------------------------------------------------------------------------------- END OF EDIT HERE




// ---------------------------------------------------------------------------------- START EDIT HERE
const ALEXA_RESPONSE_MESSAGES = [
  {Msg:"Here is first response by Alexa.", Reprompt:"Reprompt message 1"},
  {Msg:"Response 2.", Reprompt:"Reprompt message 2"},
  {Msg:"response 3. <break time='1100ms'/> Is there anything else for you?", Reprompt:"Reprompt message 3"},
  {Msg:"Closing Message.", Reprompt:"nothing here"},

];
// ---------------------------------------------------------------------------------- END OF EDIT HERE







/* INTENT HANDLERS */
// ---------------------------------------------------------------------------------- START EDIT HERE
const UserRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest';
  },
  handle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const intentName = request.intent.name;
    var speechOutput;
    var repromptOutput;
    var bDoExit = false;
    

    // Check question with current step
    if(currentStep === 0 && intentName === 'FirstRequestIntent')
    {
      // 1st response
      speechOutput = ALEXA_RESPONSE_MESSAGES[currentStep].Msg;
      repromptOutput = ERROR_MESSAGE_FOR_REQUEST + ALEXA_RESPONSE_MESSAGES[currentStep].Reprompt;
      currentStep++;
    }
    else if(currentStep === 1 && intentName === 'SecondRequestIntent')
    {
      // 2nd response
      speechOutput = ALEXA_RESPONSE_MESSAGES[currentStep].Msg;
      repromptOutput = ERROR_MESSAGE_FOR_REQUEST + ALEXA_RESPONSE_MESSAGES[currentStep].Reprompt;
      currentStep++;
    }
    else if(currentStep === 2 && intentName === 'ThirdRequestIntent')
    {
      // 3rd response
      speechOutput = ALEXA_RESPONSE_MESSAGES[currentStep].Msg;
      repromptOutput = ERROR_MESSAGE_FOR_REQUEST + ALEXA_RESPONSE_MESSAGES[currentStep].Reprompt;
      currentStep++;
    }
    else if(currentStep === totalStep-1 && intentName === 'LastStopRequestIntent')
    {
      // Last response
      speechOutput = ALEXA_RESPONSE_MESSAGES[currentStep].Msg;
      repromptOutput = "";
      
      // Exit/Stop Skill
      bDoExit = true;
    }
    else
    {
      if(intentName === 'GlobalHelpIntent')
      {
        //
        // general help
        //
        if(currentStep == 0)
        {
          speechOutput = HELLO_REPROMPT;
          repromptOutput = HELLO_REPROMPT;
        }
        else
        {
          speechOutput = ALEXA_RESPONSE_MESSAGES[currentStep-1].Reprompt;
          repromptOutput = ALEXA_RESPONSE_MESSAGES[currentStep-1].Reprompt;
        }
        
      }
      else
      {
        //
        // unexpected request from users
        //
        if(currentStep == 0)
        {
          speechOutput = ERROR_MESSAGE_FOR_REQUEST + HELLO_REPROMPT;
          repromptOutput = HELLO_REPROMPT;
        }
        else
        {
          speechOutput = ERROR_MESSAGE_FOR_REQUEST + ALEXA_RESPONSE_MESSAGES[currentStep-1].Reprompt;
          repromptOutput = ALEXA_RESPONSE_MESSAGES[currentStep-1].Reprompt;
        }
      }
      
      
      
      
      
    }
    

    if(!bDoExit)
    {
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .reprompt(repromptOutput)
        .getResponse();
    }
    else
    {
      // Exit with ending message
      return handlerInput.responseBuilder
        .speak(speechOutput)
        // .reprompt(HELP_REPROMPT)
        .getResponse();
    }
      
      //.withSimpleCard(SKILL_NAME, speechOutput) <- is this for exit automatically?
  },
};
// ---------------------------------------------------------------------------------- END OF EDIT HERE






/* BUILT-IN INTENT HANDLERS */
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    currentStep = 0;
    
    return handlerInput.responseBuilder
      .speak(HELLO_MESSAGE)
      .reprompt(HELLO_REPROMPT)
      .getResponse();
  },
};


const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};





/* LAMBDA SETUP */
const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    ExitHandler,
    SessionEndedRequestHandler,
    UserRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

import JsSIP from "jssip";
import { RTCSession } from "jssip/lib/RTCSession";

let rtcSessionsStore = new Map();

let userAgent;

export function setupJssip(sipUserId) {
  JsSIP.debug.enable("JsSIP:*");
  // JsSIP.debug.disable("JsSIP:*");
  var socket = new JsSIP.WebSocketInterface("wss://sip.tsuki.solutions:7443");
  let configuration = {
    sockets: [socket],
    uri: "sip:".concat(sipUserId).concat("@sip.tsuki.solutions"),
    password: "Hala_1994",
    session_timers: false,
  };
  userAgent = new JsSIP.UA(configuration);

  userAgent.on("connected", function (e) {
    console.log("phone connected");
  });

  userAgent.on("disconnected", function (e) {
    console.log("phone disconnected");
  });

  userAgent.on("newRTCSession", function (data) {
    const request = data.request;
    rtcSessionsStore.set(request.call_id, data);
    console.log("rtcSessionsStore : ", rtcSessionsStore);
    const newRtcSession = data.session;
    console.log("UA : newRTCSession : request : ", request);
    console.log("UA : newRTCSession : session : ", newRtcSession);
    newRtcSession.connection.addEventListener("track", (event) => {
      console.log("RTCPeerConnection : new track");
      event.streams.forEach((stream) => {
        console.log("new stream : ", stream);
        let audioElement = document.getElementById("call-audio");
        audioElement.srcObject = stream;
      });
    });
  });

  userAgent.on("newMessage", function (e) {
    console.log("new message received");
  });

  userAgent.on("registered", function (e) {
    console.log("phone registered, calling");
    call("5000@sip.tsuki.solutions");
  });
  userAgent.on("unregistered", function (e) {
    console.log("phone unregistered");
  });
  userAgent.on("registrationFailed", function (e) {
    console.log("phone registrationFailed");
  });

  userAgent.start();
}

export function call(destination) {
  let eventHandlers = {
    progress: function (e) {
      console.log("call is in progress", e);
    },
    failed: function (e) {
      console.log("call failed with cause: ", e);
    },
    ended: function (e) {
      console.log("call ended with cause: ", e);
    },
    confirmed: function (e) {
      console.log("call confirmed", e);
    },
  };

  let options = {
    eventHandlers: eventHandlers,
    mediaConstraints: { audio: true, video: false },
  };
  userAgent.call(destination, options);
}

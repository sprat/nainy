var PubNub = require('pubnub');
var Emitter = require('component-emitter');

function safeName(name) {
    // see https://www.pubnub.com/knowledge-base/discussion/427/what-are-valid-channel-names
    // eslint-disable-next-line no-control-regex
    return name.replace(/[\x00-\x1F,:.*/\\]/gi, '_');
}

function Channel(name, publishKey, subscribeKey) {
    // TODO: authentication?
    // make sure we have a valid channel name
    name = safeName(name);

    var pubnub = new PubNub({
        publishKey: publishKey,
        subscribeKey: subscribeKey,
        ssl: true
    });

    // publish a message to the channel
    function publish(topic, data) {
        var self = this;
        var content = {
            channel: name,
            message: {
                topic: topic,
                data: data
            }
        };

        pubnub.publish(content, function(status/*, response*/) {
            if (!status.error) {
                self.emit('published', topic, data, self);
            }
        });
    }

    // connect to channel
    function connect() {
        pubnub.subscribe({
            channels: [name],
            withPresence: true
        });
    }

    // disconnect from channel
    function disconnect() {
        pubnub.unsubscribe({
            channels: [name]
        });
    }

    var self = Emitter({
        name: name,
        connect: connect,
        disconnect: disconnect,
        publish: publish
    });

    pubnub.addListener({
        status: function (event) {
            console.log(event);

            switch (event.operation) {
            case 'PNSubscribeOperation':
                self.emit('connected', self);
                return;
            case 'PNUnsubscribeOperation':
                self.emit('disconnected', self);
                return;
            }

            //self.emit('error', error, self);
//            switch (event.category) {
//            case 'PNReconnectedCategory':
//                self.emit('reconnected', self);
//                break;
//            case 'PNNetworkIssuesCategory':
//                self.emit('networkIssues', self);
//                break;
//            case 'PNAccessDeniedCategory':
//                self.emit('accessDenied', self);
//                break;
//            case 'PNNetworkDownCategory':
//            case 'PNNetworkUpCategory':
//                break;
//            }
        },
        message: function (event) {
            var message = event.message;
            self.emit('message:' + message.topic, message.data, self);
            self.emit('message', message.topic, message.data, self);
        },
        presence: function (event) {
            console.log(event);
            // event.action / event.uuid
        }
    });

    return self;
}

module.exports = Channel;

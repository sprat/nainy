define(['pubnub', 'tinyemitter', 'utils/assert', 'utils/base64'], function (PUBNUB, EventEmitter, assert, base64) {
    'use strict';

    function Channel(name) {
        // TODO: move API keys in RequireJS configuration
        // TODO: authentication?
        var safeName = base64.encodeUrl(name),
            emitter = new EventEmitter(),
            reservedTopics = [
                'connecting', 'connected', 'disconnected', 'reconnected',
                'error', 'published'
            ],
            pubnub = PUBNUB({
                publish_key: 'pub-c-8be41a11-cbc5-4427-a5ad-e18cf5a466e4',
                subscribe_key: 'sub-c-38ae8020-6d33-11e5-bf4b-0619f8945a4f'
            });

        // publish a message to the channel
        function publish(topic, data) {
            var self = this;

            // make sure we can't publish on a "reserved" channel topic
            assert(reservedTopics.indexOf(topic) === -1, 'Reserved topic: ' + topic);

            pubnub.publish({
                channel: safeName,
                message: {
                    topic: topic,
                    data: data
                },
                callback: function() {
                    emitter.emit('published', topic, data, self);
                }
            });
        }

        // connect to channel
        function connect() {
            var self = this;

            emitter.emit('connecting', self);

            pubnub.subscribe({
                channel: safeName,
                message: function (message) {
                    emitter.emit(message.topic, message.data, self);
                },
                connect: function () {
                    emitter.emit('connected', self);
                },
                disconnect: function () {
                    emitter.emit('disconnected', self);
                },
                reconnect: function () {
                    emitter.emit('reconnected', self);
                },
                error: function (error) {
                    emitter.emit('error', error, self);
                }
            });
        }

        // disconnect from channel
        function disconnect() {
            var self = this;

            pubnub.unsubscribe({
                channel: safeName,
                callback: function () {
                    emitter.emit('disconnected', self);
                }
            });
        }

        return {
            name: name,
            connect: connect,
            disconnect: disconnect,
            publish: publish,
            on: emitter.on.bind(emitter),
            off: emitter.off.bind(emitter),
            once: emitter.once.bind(emitter)
        };
    }

    return Channel;
});
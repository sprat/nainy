define(['./spy', './dashboard', './user', './channel', 'utils/extend'], function (Spy, Dashboard, User, Channel, extend) {
    'use strict';

    function getElement(target) {
        if (target === undefined || target === null) {
            return target;
        }

        if (target.nodeType !== undefined) {
            return target;  // it's already a node
        }

        // so, we assume it's a selector
        return window.document.querySelector(target);
    }

    /* Application class */
    function Application(conf) {
        var dashboard,
            spy,
            //channel,
            newConf = {  // default conf
                user: User(),  // anonymous user
                channel: 'default',  // default channel
                container: window.document.body,  // dashboard container
                infoFrame: undefined  // info frame
            };

        extend(newConf, conf);
        newConf.container = getElement(newConf.container);
        newConf.infoFrame = getElement(newConf.infoFrame);

        // create a connection to the channel
        //channel = Channel(newConf.channel);
        //channel.connect();
        //newConf.channel = channel;

        if (newConf.container) {
            dashboard = Dashboard(newConf);
        }

        if (newConf.infoFrame) {
            spy = Spy(newConf);
        }

        function destroy() {
            if (spy) {
                spy.enabled = false;
            }

            if (dashboard) {
                dashboard.enabled = false;
            }
        }

        return Object.freeze({
            user: newConf.user,
            channel: newConf.channel,
            dashboard: dashboard,
            spy: spy,
            destroy: destroy
        });
    }

    return Application;
});

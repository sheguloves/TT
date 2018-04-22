
module.exports = function($timeout) {
    "ngInject";

    const messages = [];

    function timer() {
        $timeout(popMessage, 5000);
    }

    function popMessage() {
        messages.shift();
    }
    return {
        mixIn: function(scope) {
            if (scope && !scope.$messages) {
                scope.$messages = messages;
            }
        },
        pushMessage: function(message) {
            messages.push({
                message: message
            });
            timer();
        },
        pushErrorMessage: function(message) {
            messages.push({
                message: message,
                error: true
            });
            timer();
        }
    }
};
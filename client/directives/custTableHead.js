module.exports = function($compile) {
    "ngInject";

    return {
        restrict: 'EA',
        scope: {
            custTableHead: "=",
            predicate: "@",
            reverse: "="
        },
        link: function(scope, element, attrs) {
            var syncElementStyle = function() {
                if (scope.custTableHead && scope.custTableHead.sortBy) {
                    element.addClass('clickable');
                    if (scope.predicate && scope.custTableHead.sortBy === scope.predicate) {
                        element.addClass('sortby');
                        scope.reverse ? element.addClass('reverse') : element.removeClass('reverse');
                    } else {
                        element.removeClass('sortby').removeClass('reverse');
                    }
                } else {
                    element.removeClass('clickable').removeClass('sortby').removeClass('reverse');
                }
            };

            scope.$watch("custTableHead", function(newValue) {
                newValue && newValue.rowspan ? element.attr("rowspan", newValue.rowspan) : element.removeAttr("rowspan");
                newValue && newValue.colspan ? element.attr("colspan", newValue.colspan) : element.removeAttr("colspan");
                syncElementStyle();
            }, true);

            scope.$watchGroup(['predicate', 'reverse'], function() {
                syncElementStyle();
            });
        }
    };
};
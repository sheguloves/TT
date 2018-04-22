module.exports = function() {
    return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
            field: "@"
        },
        template: require('../partials/editable_cell.html'),
        controller: function($scope) {
            'ngInject';

            $scope.editing = false;
            $scope.onDbClick = function() {
                $scope.editing = true;
            };
        },
        link: function link($scope, $element, attrs, ngModel) {
            $scope.$watch('field', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.editing = false;
                }
                $scope.cellValue = ngModel.$viewValue && ngModel.$viewValue[newValue] || "";
            });

            ngModel.$render = function() {
                if (ngModel.$viewValue) {
                    $scope.cellValue = ngModel.$viewValue && $scope.field && ngModel.$viewValue[$scope.field];
                } else {
                    $scope.cellValue = "";
                }
            };

            $scope.$watch("cellValue", function(newValue) {
                if (!angular.equals(ngModel.$viewValue, viewValue)) {
                    ngModel.$setViewValue(viewValue);
                }
            }, true);
        }
    };
};
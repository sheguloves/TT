module.exports = function() {
    return {
        restrict: 'EA',
        scope: true,
        template: require('../partials/address_book.html'),
        controller: function($scope, $q, $document, $filter, addressService, messageService) {
            "ngInject";

            messageService.mixIn($scope);

            $scope.editRow = null;

            $scope.predicate = 'id';
            $scope.reverse = false;

            $scope.ctrl = {
                allChecked: false,
                indeterminate: true
            };

            $scope.checkable = true;
            $scope.tableHeaders = [
                [{
                    label: "ID",
                    rowspan: 2,
                    sortBy: "id"
                }, {
                    label: "NAME",
                    rowspan: 2,
                    sortBy: "name"
                }, {
                    label: "LOCATION",
                    rowspan: 2,
                    sortBy: "location"
                }, {
                    label: "OFFICE",
                    rowspan: 2
                }, {
                    label: "PHONE",
                    colspan: 2
                }],
                [{
                    label: "PHONE_OFFICE"
                }, {
                    label: "PHONE_CELL"
                }]
            ];

            var syncAllCheckedStatus = function() {
                if (!$scope.addresses || $scope.addresses.length === 0) {
                    $scope.ctrl.allChecked = false;
                    return;
                }

                var i, row;
                for (i = $scope.addresses.length - 1; i >= 0 ; i--) {
                    row = $scope.addresses[i];
                    if (!row.selected) {
                        $scope.ctrl.allChecked = false;
                        return;
                    }
                }
                $scope.ctrl.allChecked = true;
            };

            var genRowData = function() {
                return {
                    name: "",
                    location: "",
                    office: "",
                    phone: {
                        office: "",
                        cell: ""
                    }
                };
            };

            $scope.onRowSelectionChange = function() {
                syncAllCheckedStatus();
            };

            $scope.onCheckedAllChange = function() {
                var i, row;
                for (i = $scope.addresses.length - 1; i >= 0 ; i--) {
                    row = $scope.addresses[i];
                    row.selected = $scope.ctrl.allChecked;
                }
            };

            $scope.onHeadClick = function(predicate) {
                if (!predicate) {
                    return;
                }
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            };

            var cleanAddresses = function(removedRowIds) {
                if (!removedRowIds || removedRowIds.length === 0) {
                    return;
                }
                var i, row;
                for (i = $scope.addresses.length - 1; i >= 0 ; i--) {
                    row = $scope.addresses[i];
                    if (removedRowIds.indexOf(row.id) !== -1) {
                        $scope.addresses.splice(i, 1);
                    }
                }
                syncAllCheckedStatus();
            };

            $scope.onDeleteClick = function() {
                var i, row, promises = [], deletedRowIds = [];
                for (i = $scope.addresses.length - 1; i >= 0 ; i--) {
                    row = $scope.addresses[i];
                    if (!row.selected) {
                        continue;
                    }
                    if (!row.id && row.id !== 0) {
                        $scope.addresses.splice(i, 1);
                    } else {
                        (function(address) {
                            promises.push(addressService.deleteAddress(address.id).then(function() {
                                deletedRowIds.push(address.id);
                            }));
                        })(row);
                    }
                }
                $q.all(promises).then(function() {
                    messageService.pushMessage("DELETE_SUCCESS");
                    cleanAddresses(deletedRowIds);
                }, function(reject) {
                    messageService.pushErrorMessage($filter('translate')("DELETE_FAILED") + reject);
                    cleanAddresses(deletedRowIds);
                });
            };

            $scope.onAddClick = function() {
                $scope.addresses.push(genRowData());
            };

            $scope.onUpdateClick = function() {
                var i, row, createRowPromises = [], updateRowPromises = [];
                for (i = $scope.addresses.length - 1; i >= 0 ; i--) {
                    row = $scope.addresses[i];
                    if (!row.id && row.id !== 0) {
                        (function(address) {
                            createRowPromises.push(addressService.createAddress(address).then(function(res) {
                                address.id = res.data.id;
                            }));
                        })(row);
                    } else if (row.dirty) {
                        updateRowPromises.push(addressService.updateAddress(row));
                    }
                }
                if (createRowPromises.length > 0) {
                    $q.all(createRowPromises).then(function() {
                        messageService.pushMessage("ADD_SUCCESS");
                    }, function(reject) {
                        messageService.pushErrorMessage("ADD_FAILED" + reject);
                    });
                }
                if (updateRowPromises.length > 0) {
                    $q.all(updateRowPromises).then(function() {
                        messageService.pushMessage("UPDATE_SUCCESS");
                    }, function(reject) {
                        messageService.pushErrorMessage($filter('translate')("UPDATE_FAILED") + reject);
                    });
                }

            };

            var editingDOM;
            $scope.onCellDBClick = function(row, event) {
                $scope.editRow = row;
                editingDOM = event.currentTarget;
            };

            var onDocumentClick = function(event) {
                if (editingDOM && editingDOM.contains(event.target)) {
                    return;
                }
                $scope.editRow = null;
                editingDOM = null;
                $scope.$digest();
            };

            $document.on('click', onDocumentClick);
            $scope.$on('$destroy', function() {
                $document.off('click', onDocumentClick);
            });

            addressService.getAddresses().then(function(response) {
                $scope.addresses = response.data;
            }, function(reject) {
                messageService.pushErrorMessage("LOADING_ADDRESSES_FAILED" + reject);
            });
        }
    };
};
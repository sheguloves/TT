
module.exports = function($q, $http) {
    "ngInject";

    const ADDRESSES_URL="/api/addresses";

    return {
        getAddresses: function() {
            return $http.get(ADDRESSES_URL);
        },
        createAddress: function(address) {
            return $http.post(ADDRESSES_URL, address);
        },
        updateAddress: function(address) {
            return $http.put(ADDRESSES_URL + "/" + address.id, address);
        },
        deleteAddress: function(id) {
            return $http.delete(ADDRESSES_URL + "/" + id);
        }
    }
};
var assert = require('chai').assert;
var request = require('request-promise');
var config = require('../it.config');
var chai = require('chai');
var chaiSubset = require('chai-subset');
chai.use(chaiSubset);

describe('Push analytic data', function () {
    this.timeout(45000);
    var cookieJar = request.jar();
    var myRequest = {
        url: '',
        method: 'POST',
        rejectUnauthorized: false,
        resolveWithFullResponse: true,
        jar: cookieJar,
        headers: {
              'Content-Type': 'application/json'
        }
    };

    before(function () {
        myRequest.url = config.baseUrl + '/CSRF-Generate';

        return request(myRequest)
            .then(function (response) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');
                myRequest.form = {
                    testData: 'some data to store',
                    csrf_token: JSON.parse(response.body).csrf.token
                };
            });
    });

    it('should add data to storage', function () {
        myRequest.url = config.baseUrl + '/Analytics-Add';

        return request(myRequest)
            .then(function (response) {
                assert.equal(response.statusCode, 200, 'Expected statusCode to be 200.');

                var bodyAsJson = JSON.parse(response.body);
                assert.isTrue(bodyAsJson.success);
            });
    });
});

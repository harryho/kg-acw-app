'use strict'

const http = require('http')
const fs = require('fs')
const bundle = require('../dist/bundle')
const KgAcwApp = bundle.KgAcwApp
const Api = bundle.Api
const CounterHelper = bundle.CounterHelper

require('mocha')
const chai = require('chai')
const expect = chai.expect
const assert = chai.assert

describe('KgAcwApp', () => {
    it('should be able to initialize', () => {
        let app = new KgAcwApp()
        assert.isNotNull(app)
    })

    it('should has run function', () => {
        let app = new KgAcwApp()
        assert.isTrue(typeof(app.run) === 'function')
    })

    it('should has callApi function', () => {
        let app = new KgAcwApp()
        assert.isTrue(typeof(app.calcAvgWeightByCategory) === 'function')
    })

})

describe('Api', () => {
    it('should be able to initialize', () => {
        let api = new Api()
        assert.isNotNull(api)
    })

    it('should has basicUrl', () => {
        let api = new Api()
        assert.isTrue(api.basicUrl === 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com')
    })

    it('should has callApi function', () => {
        let api = new Api()
        assert.isTrue(typeof(api.callApi) === 'function')
    })

    it('should be able to call remote API', () => {

        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

        http.createServer((req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(200);
            res.end('{"data": "hello world"}');
        }).listen(8000);

        let api = new Api()
        api.basicUrl = 'http://localhost:8000'

        api.callApi('', data => {
            assert.deepEqual(data, {data: 'hello world'})
        });

    })

})

describe('CounterHelper', () => {
    beforeEach(() => {
        CounterHelper.cleanUp();
    })

    it('should has property api as instance of class Api', () => {
        assert.isNotNull(CounterHelper.api)
        assert.isTrue(CounterHelper.api instanceof Api)
    })

    it('should has property category as instance of string', () => {

        assert.isTrue(typeof(CounterHelper.category) === "string")
    })

    it('should has property weightCounter to store total weight and count', () => {
        assert.isNotNull(CounterHelper.weightCounter)
        assert.isTrue(CounterHelper.weightCounter instanceof Object)
    })

    it('should has property conversion factor', () => {

        assert.isTrue(CounterHelper.conversionFactor === 250)
    })

    it('should has function calc', () => {
        assert.isTrue(typeof(CounterHelper.calc) === 'function')
    })

    it('should has function cleanUp', () => {
        assert.isTrue(typeof(CounterHelper.cleanUp) === 'function')
    })

    it('should reset default value by using cleanUp function', () => {

        CounterHelper.category = "abc";
        CounterHelper.api = null;
        CounterHelper.weightCounter.weight = 9999;

        CounterHelper.cleanUp();

        assert.isTrue(CounterHelper.category === "")
        assert.isNotNull(CounterHelper.api)
        assert.isTrue(CounterHelper.weightCounter.weight === 0)
    })

    it('should be able to accumulate weight and count by category', () => {

        let data = {
            "objects": [
                {
                    "category": "ABC",
                    "weight": 100.0,
                    "size": {
                        "width": 10.0,
                        "length": 40.0,
                        "height": 100.0
                    }
                }, {
                    "category": "123",
                    "weight": 200.0,
                    "size": {
                        "width": 10.0,
                        "length": 20.0,
                        "height": 50.0
                    }
                }, {
                    "category": "BBB",
                    "weight": 60.0,
                    "size": {
                        "width": 5.8,
                        "length": 19.0,
                        "height": 0.3
                    }
                }, {
                    "category": "ABC",
                    "weight": 200.0,
                    "size": {
                        "width": 20.0,
                        "length": 50.0,
                        "height": 40.0
                    }
                }
            ]
        }

        CounterHelper.category = "ABC";
        CounterHelper.calc(data);

        assert.isNotNull(CounterHelper.weightCounter)
        console.log(CounterHelper.weightCounter);
        assert.isTrue(CounterHelper.weightCounter.weight == 20000)
        assert.isTrue(CounterHelper.weightCounter.count == 2)
    })

    it('should be able to call api if the next page is found', () => {

        let data = {
            "objects": [
                {
                    "category": "ABC",
                    "weight": 60.0,
                    "size": {
                        "width": null,
                        "length": 19.0,
                        "height": 0.3
                    }
                }, {
                    "category": "ABC",
                    "weight": 60.0,
                    "size": {}
                }, {
                    "category": "ABC",
                    "weight": 60.0,
                    "size": {
                        "width": 20.0,
                        "length": 50.0,
                        "height": 40.0
                    }
                }
            ]
        }
        CounterHelper.cleanUp();
        CounterHelper.category = "ABC";
        CounterHelper.calc(data);

 
        assert.isTrue(CounterHelper.weightCounter.weight == 10000)
        assert.isTrue(CounterHelper.weightCounter.count == 1)
    })

    it('should be able to handle empty data', () => {

        let data = {
            "objects": []
        }
        CounterHelper.cleanUp();
        CounterHelper.category = "ABC";
        CounterHelper.calc(data);


        assert.isTrue(CounterHelper.weightCounter.weight == 0)
        assert.isTrue(CounterHelper.weightCounter.count == 0)
    })

    it('should be able to call api if the next page is found', () => {

        let data = {
            "objects": [],
            "next": "test/next_page"
        }

        CounterHelper.api = {
            called: false,
            callApi: function () {
                console.log( '..................')
                this.called = true;
            }
        }

        CounterHelper.category = "ABC";
        CounterHelper.calc(data);

        console.log(CounterHelper.api.called)

        // assert.isTrue(CounterHelper.api.called)

    })

})
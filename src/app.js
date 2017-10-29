import http from 'http'



export class KgAcwApp {

    constructor() {}

    calcAvgWeightByCategory(category) {

        let api = new Api();

        CounterHelper.cleanUp();

        CounterHelper.category = category;

        api.callApi('/api/products/1', CounterHelper.calc)

    }

    run() {

        this.calcAvgWeightByCategory("Air Conditioners");

    }
}

export class Api {

    constructor( ) {
        this.basicUrl = 'http://wp8m3he1wt.s3-website-ap-southeast-2.amazonaws.com';
    }

    callApi(api, callback) {


        http.get(this.basicUrl + api,  (res) => {

            const {statusCode} = res;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.error(error.message)
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => {
                rawData += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);

                    if (callback) {
                        callback(parsedData)
                    }

                } catch (e) {
                    console.error(e.message);
                }
            });
        })
        .on('error', (e) => {
            console.error(`Got error: ${e.message}`);
        });

    }
}

export class CounterHelper {

    constructor() {}

    static cleanUp() {
        CounterHelper.category = "";
        CounterHelper.api = new Api();
        CounterHelper.weightCounter = {
            weight: 0,
            count: 0
        };
         CounterHelper.conversionFactor =250;
    }

    static conversionFactor = 250;
    static category = "";
    static api = new Api();
    static weightCounter = {
        weight: 0,
        count: 0
    };

    static calc(data) {      
        if (data) {

            if (data.objects && data.objects.length > 0) {

                data
                    .objects
                    .forEach(o => {

                        if (o.category === CounterHelper.category) {

                            let size = 0;
                            let weight = 0;
                            
                            if (o.size && o.size.width  && o.size.length  && o.size.height 
                                 && !isNaN(o.size.width)  && !isNaN(o.size.width)  && !isNaN(o.size.width) ){
                                     
                                size = o.size.width * o.size.length * o.size.height * 0.000001;
                                weight = CounterHelper.conversionFactor * size * 1000;

                                CounterHelper.weightCounter.weight += weight;
                                CounterHelper.weightCounter.count += 1;
                            }
                        }
                    })
            }
            if (data.next) {    

                CounterHelper
                    .api
                    .callApi(data.next, CounterHelper.calc)
            } else {
                console.log(' \n\n==============================================' )
                console.log('  Result: ' )
                let aw = 0;
                if (CounterHelper.weightCounter.count > 0) {
                    aw = CounterHelper.weightCounter.weight / CounterHelper.weightCounter.count;
                    aw = aw.toFixed(2);
                }

                console.log(` Average Cubic Weight of ${CounterHelper.category}: ${aw} G `);
            }

        }
    }

}

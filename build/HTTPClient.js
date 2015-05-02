/** 
*HTTPClient Functionality
*@class HTTPClient
*/


/**
 * HTTPClient Functionality
 * @method HTTPClient
 * @param {} server the server object connecting to
 * @param {} port port connecting through
 * 
 */
function HTTPClient(server, port) {
    this.server = server;
    this.port = port;
    /**
     * HTTPClient get
     * @method get
     * @param {} server the server object connecting to
     * @param {} processGet function to process Get request
     * 
     */
    this.get = function (server, processGet) {
        var httpGetRequest = new XMLHttpRequest();
        /**
         * On state change execute this
         * @method onreadystatechange
         * 
         */
        httpGetRequest.onreadystatechange = function () {
            if (httpGetRequest.readyState === 4 && httpGetRequest.status === 200) {
                processGet(httpGetRequest.responseText);
            }
            ;
            httpGetRequest.open("GET", server, true); //true means asynchronous
            httpGetRequest.send(null);
        };
        /**
         * Process get request
         * @method processGet function to process Get request
         * @param {} response Response printed after processing Get 	
         * 
         */
        this.processGet = function (response) {
            print(response);
        }
    }
}
function HTTPClient(server, port) {
    this.server = server;
    this.port = port;
    this.get = function (server, processGet) {
        var httpGetRequest = new XMLHttpRequest();
        httpGetRequest.onreadystatechange = function () {
            if (httpGetRequest.readyState === 4 && httpGetRequest.status === 200) {
                processGet(httpGetRequest.responseText);
            }
            ;
            httpGetRequest.open("GET", server, true); //true means asynchronous
            httpGetRequest.send(null);
        };
        this.processGet = function (response) {
            print(response);
        }
    }
}
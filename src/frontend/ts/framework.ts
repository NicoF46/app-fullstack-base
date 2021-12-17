class FrameWork{

    public requestGET(url: string, lister:RestResponseLister){
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function ServerResponse(){
            if (xml.readyState == 4){
                lister.handlerGetResponse(xml.status,xml.responseText)
                }

            }
            xml.open("GET", url, true);
            xml.send();
    }

    public requestDELETE(url: string, lister:RestResponseLister){
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function ServerResponse(){
            if (xml.readyState == 4){
                lister.handlerDeleteResponse(xml.status,xml.responseText)
                }

            }
            xml.open("DELETE", url, true);
            xml.send();
    }

    public requestPOST(url: string, lister:RestResponseLister, requestBody: string){
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function ServerResponse(){
            if (xml.readyState == 4){
                lister.handlerPostResponse(xml.status,xml.responseText)
                }

            }
            xml.open("POST", url, true);
            xml.setRequestHeader('Content-Type', 'application/json');
            xml.send(requestBody);
    }


}
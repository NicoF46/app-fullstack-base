class FrameWork{

    public requestGET(url: string, lister:GetResponseLister){
        let xml = new XMLHttpRequest();
        xml.onreadystatechange = function ServerResponse(){
            if (xml.readyState == 4){
                lister.handlerGetResponse(xml.status,xml.responseText)
                }

            }
            xml.open("GET", url, true);
            xml.send();
    }
}
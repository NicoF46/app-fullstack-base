class FrameWork {
  public requestGET(url: string, lister: RestResponseLister) {
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function ServerResponse() {
      if (xml.readyState == 4) {
        if (xml.status != 200) {
          alert(JSON.parse(xml.responseText)["error"]);
        }
        lister.handlerGetResponse(xml.status, xml.responseText);
      }
    };
    xml.open("GET", url, true);
    xml.send();
  }

  public requestDELETE(url: string, lister: RestResponseLister) {
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function ServerResponse() {
      if (xml.readyState == 4) {
        if (xml.status != 200) {
          alert(JSON.parse(xml.responseText)["error"]);
        }
        lister.handlerDeleteResponse(xml.status, xml.responseText);
      }
    };
    xml.open("DELETE", url, true);
    xml.send();
  }

  public requestPOST(
    url: string,
    lister: RestResponseLister,
    requestBody: string
  ) {
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function ServerResponse() {
      if (xml.readyState == 4) {
        if (xml.status != 201) {
          alert(JSON.parse(xml.responseText)["error"]);
        }
        lister.handlerPostResponse(xml.status, xml.responseText);
      }
    };
    xml.open("POST", url, true);
    xml.setRequestHeader("Content-Type", "application/json");
    xml.send(requestBody);
  }

  public requestPUT(
    url: string,
    lister: RestResponseLister,
    requestBody: string
  ) {
    let xml = new XMLHttpRequest();
    xml.onreadystatechange = function ServerResponse() {
      if (xml.readyState == 4) {
        if (xml.status != 200) {
          alert(JSON.parse(xml.responseText)["error"]);
        }
        lister.handlerPostResponse(xml.status, xml.responseText);
      }
    };
    xml.open("PUT", url, true);
    xml.setRequestHeader("Content-Type", "application/json");
    xml.send(requestBody);
  }
}

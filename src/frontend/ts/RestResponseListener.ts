interface RestResponseLister{

    handlerGetResponse(status: number, response: string);
    handlerDeleteResponse(status: number, response: string);
    handlerPostResponse(status: number, response: string);
}
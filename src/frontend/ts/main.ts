declare const M: any;

class Main implements EventListenerObject, RestResponseLister {
  private nombre: string;
  private lista: Array<Device> = new Array();
  private framework: FrameWork = new FrameWork();

  constructor() {
    this.list_devices();
  }

  public handleEvent(ev: Event) {
    let objetoEvento = <HTMLElement>ev.target;
    if (ev.type == "click") {
      console.log(objetoEvento.id);
      if (objetoEvento.id.includes("trash_")){
        this.delete_device(objetoEvento.id);
      }
      else if ((objetoEvento.id == "submit_btn")){
        console.log("Se va a enviar el form");
        this.add_device();
      }
    }
  }

  public getElement(id: string): HTMLElement {
    return document.getElementById(id);
  }

  public add_device(){
    let requestBody = {
      "id": this.getElement("device_id")["value"],
      "name": this.getElement("device_name")["value"],
      "description": this.getElement("device_description")["value"],
      "type": this.getElement("device_type")["value"]
    };
    this.framework.requestPOST("http://localhost:8000/devices", this, JSON.stringify(requestBody));
  }

  public delete_device(id: string){
    let device_id = id.split("_").pop();
    this.framework.requestDELETE("http://localhost:8000/devices/" + device_id, this);
  }

  public list_devices() {
    this.framework.requestGET("http://localhost:8000/devices", this);
  }

  public handlerGetResponse(status: number, response: string) {
    let devices: Array<Device> = JSON.parse(response);
    let devices_list = this.getElement("devices_list");
    devices_list.innerHTML = "";
    for (let device of devices) {
      devices_list.innerHTML += `<li class="collection-item avatar">
        <img src="static/images/robot.jpg" alt="" class="circle">
        <span class="title">${device.name}</span>
        <p>${device.description} <br>
        </p>
        <a href="#!" class="secondary-content">  <form action="#">
          <p class="range-field">
            <input type="range" id="bar_${device.id}" min="0" max="100" />
          </p>
        </form></a>
        <button class="btn waves-effect waves-light button-view" name="delete_button" id=trash_${device.id}>
            <i class="small material-icons red-text">delete</i>
        </button>
      </li>`;
    }

    for (let device_iterator of devices) {
      let device_bar = this.getElement("bar_" + device_iterator.id);
      device_bar.addEventListener("click", this);
      let device_delete = this.getElement("trash_" + device_iterator.id);
      device_delete.addEventListener("click", this);
    }
  }

  public handlerDeleteResponse(status: number, response: string) {
    this.list_devices();
  }

  public handlerPostResponse(status: number, response: string) {
    this.list_devices();
  }
}

window.onload = function inicio() {
  let miObjeto: Main = new Main();
  let boton = miObjeto.getElement("add_button");
  boton.addEventListener("click", miObjeto);
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
  let submit_btn = miObjeto.getElement("submit_btn");
  submit_btn.addEventListener("click",miObjeto);
};

declare const M: any;

class Main implements EventListenerObject, RestResponseLister {
  private nombre: string;
  private device_list: Array<Device> = new Array();
  private framework: FrameWork = new FrameWork();
  private current_device: Device;

  constructor() {
    this.list_devices();
  }

  public handleEvent(ev: Event) {
    let objetoEvento = <HTMLElement>ev.target;
    if (ev.type == "click") {
      if (objetoEvento.id.includes("delete_btn_")) {
        this.delete_device(objetoEvento.id);
      } else if (objetoEvento.id == "submit_btn") {
        this.add_device();
      } else if (objetoEvento.id == "submit_btn_update") {
        this.update_device(objetoEvento.id);
      }
      else if(objetoEvento.id.includes("update_")){
        this.current_device = this.device_list.find((e) => e.id === Number(objetoEvento.id.split("_").pop()));
        
      }
    } else if (ev.type == "change" && objetoEvento.id.includes("bar")) {
      this.set_device_value(objetoEvento.id);
    }
  }

  public getElement(id: string): HTMLElement {
    return document.getElementById(id);
  }

  public add_device() {
    let requestBody = {
      id: this.getElement("device_id")["value"],
      name: this.getElement("device_name")["value"],
      description: this.getElement("device_description")["value"],
      type: this.getElement("device_type")["value"],
    };
    this.framework.requestPOST(
      "http://localhost:8000/devices",
      this,
      JSON.stringify(requestBody)
    );
  }

  public delete_device(id: string) {
    let device_id = id.split("_").pop();
    this.framework.requestDELETE(
      "http://localhost:8000/devices/" + device_id,
      this
    );
  }

  public list_devices() {
    this.framework.requestGET("http://localhost:8000/devices", this);
  }

  public set_device_value(id: string) {
    let device_id = id.split("_").pop();
    let device_data = this.device_list.find((e) => e.id === Number(device_id));
    let requestBody = {
      id: device_data.id,
      name: device_data.name,
      description: device_data.description,
      type: device_data.type,
      state: this.getElement("bar_" + device_id)["value"],
    };
    this.framework.requestPUT(
      "http://localhost:8000/devices",
      this,
      JSON.stringify(requestBody)
    );
  }

  public update_device(id: string) {
    let requestBody = {
      id: this.current_device.id,
      name: this.getElement("update_device_name")["value"],
      description: this.getElement("update_device_description")["value"],
      type: this.getElement("update_device_type")["value"],
      state: this.current_device.state,
    };
    this.framework.requestPUT(
      "http://localhost:8000/devices",
      this,
      JSON.stringify(requestBody)
    );
  }

  public handlerGetResponse(status: number, response: string) {
    let devices: Array<Device> = JSON.parse(response);
    this.device_list = devices;
    let devices_list = this.getElement("devices_list");
    devices_list.innerHTML = "";
    for (let device of devices) {
      devices_list.innerHTML += `<li class="collection-item avatar">
        <img src="static/images/robot.jpg" alt="" class="circle">
        <span class="title">${device.name}</span>
        <p>${device.description} <br>
        </p>
        <a href="#!" class="secondary-content">
          <p class="range-field">
            <input type="range" id="bar_${device.id}" min="0" max="100" value=${device.state} />
          </p>
        </a>
        <button class="btn waves-effect waves-light button-view" name="delete_button" id=delete_btn_${device.id}>
            <i class="small material-icons white-text">delete</i>
        </button>
        <button class="btn waves-effect waves-light button-view modal-trigger" name="update_button" id=update_${device.id} data-toggle='modal_${device.id}' data-target="update_modal">
           <i class="small material-icons white-text">edit</i>
        </button>
      </li>`;
    }

    for (let device_iterator of devices) {
      let device_bar = this.getElement("bar_" + device_iterator.id);
      device_bar.addEventListener("change", this);
      let device_delete = this.getElement("delete_btn_" + device_iterator.id);
      device_delete.addEventListener("click", this);
      let device_edit = this.getElement("update_" + device_iterator.id);
      device_edit.addEventListener("click", this);
    }
  }

  public handlerDeleteResponse(status: number, response: string) {
    this.list_devices();
  }

  public handlerPostResponse(status: number, response: string) {
    this.list_devices();
  }

  public handlerPutResponse(status: number, response: string) {
    this.list_devices();
  }
}

window.onload = function inicio() {
  let miObjeto: Main = new Main();
  let boton = miObjeto.getElement("add_button");
  boton.addEventListener("click", miObjeto);
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
  let submit_btn = miObjeto.getElement("submit_btn");
  submit_btn.addEventListener("click", miObjeto);
  let submit_btn_update = miObjeto.getElement("submit_btn_update");
  submit_btn_update.addEventListener("click", miObjeto);
};

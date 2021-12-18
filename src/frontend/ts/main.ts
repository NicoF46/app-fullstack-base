declare const M: any;

class Main implements EventListenerObject, RestResponseLister {
  private deviceList: Array<Device> = new Array();
  private framework: FrameWork = new FrameWork();
  private currentDevice: Device;

  constructor() {
    this.list_devices();
  }

// Method to handle the UI actions
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
        this.currentDevice = this.deviceList.find((e) => e.id === Number(objetoEvento.id.split("_").pop()));
        
      }
    } else if (ev.type == "change" && objetoEvento.id.includes("bar")) {
      this.set_device_value(objetoEvento.id);
    }
  }

// Method to fetch the id of an html element
  public getElement(id: string): HTMLElement {
    return document.getElementById(id);
  }

// Method to request the addition of an new element to the backend
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

// Method to request the deletion of an element to the backend
  public delete_device(id: string) {
    let deviceId = id.split("_").pop();
    this.framework.requestDELETE(
      "http://localhost:8000/devices/" + deviceId,
      this
    );
  }

// Method to request the list of devices from the backend
  public list_devices() {
    this.framework.requestGET("http://localhost:8000/devices", this);
  }

//Method to request the update of the state value of a device to the backend
  public set_device_value(id: string) {
    let deviceId = id.split("_").pop();
    let deviceData = this.deviceList.find((e) => e.id === Number(deviceId));
    let requestBody = {
      id: deviceData.id,
      name: deviceData.name,
      description: deviceData.description,
      type: deviceData.type,
      state: this.getElement("bar_" + deviceId)["value"],
    };
    this.framework.requestPUT(
      "http://localhost:8000/devices",
      this,
      JSON.stringify(requestBody)
    );
  }

//Method to request the update of a device to the backend
  public update_device(id: string) {
    let requestBody = {
      id: this.currentDevice.id,
      name: this.getElement("update_device_name")["value"],
      description: this.getElement("update_device_description")["value"],
      type: this.getElement("update_device_type")["value"],
      state: this.currentDevice.state,
    };
    this.framework.requestPUT(
      "http://localhost:8000/devices",
      this,
      JSON.stringify(requestBody)
    );
  }

//Method to handle the response from the GET response 
  public handlerGetResponse(status: number, response: string) {
    let devices: Array<Device> = JSON.parse(response);
    this.deviceList = devices;
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
      let deviceBar = this.getElement("bar_" + device_iterator.id);
      deviceBar.addEventListener("change", this);
      let device_delete = this.getElement("delete_btn_" + device_iterator.id);
      device_delete.addEventListener("click", this);
      let device_edit = this.getElement("update_" + device_iterator.id);
      device_edit.addEventListener("click", this);
    }
  }

//Method to handle the response from the DELETE response 
  public handlerDeleteResponse(status: number, response: string) {
    this.list_devices();
  }

//Method to handle the response from the POST response 
  public handlerPostResponse(status: number, response: string) {
    this.list_devices();
  }

//Method to handle the response from the PUT response 
  public handlerPutResponse(status: number, response: string) {
    this.list_devices();
  }
}

// INITIALIZE VARIABLES
window.onload = function inicio() {
  let miObjeto: Main = new Main();
  let boton = miObjeto.getElement("add_button");
  boton.addEventListener("click", miObjeto);
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
  let submitBtn = miObjeto.getElement("submit_btn");
  submitBtn.addEventListener("click", miObjeto);
  let submitBtnUpdate = miObjeto.getElement("submit_btn_update");
  submitBtnUpdate.addEventListener("click", miObjeto);
};

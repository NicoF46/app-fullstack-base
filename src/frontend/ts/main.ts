declare const M: any;

class Main implements EventListenerObject, RestResponseLister {
  private deviceList: Array<Device> = new Array();
  private framework: FrameWork = new FrameWork();
  private currentDevice: Device;
  private showOption: String;

  constructor() {
    this.listDevices();
    this.showOption = "list";
  }

  // Method to handle the UI actions
  public handleEvent(ev: Event) {
    let objetoEvento = <HTMLElement>ev.target;
    if (ev.type == "click") {
      if (objetoEvento.id.includes("delete_btn_")) {
        this.delete_device(objetoEvento.id);
      } else if (objetoEvento.id == "submit_btn_add") {
        this.add_device();
      } else if (objetoEvento.id == "submit_btn_update") {
        this.update_device(objetoEvento.id);
      } else if (objetoEvento.id.includes("update_")) {
        this.currentDevice = this.deviceList.find(
          (e) => e.id === Number(objetoEvento.id.split("_").pop())
        );
      } else if (objetoEvento.id == "icon_btn") {
        this.showOption = "icon";
        this.listDevices();
      } else if (objetoEvento.id == "list_btn") {
        this.showOption = "list";
        this.listDevices();
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
  public listDevices() {
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
      if (this.showOption == "icon") {
        devices_list.innerHTML += ` <div class="card col s4 m4 l4 xl4">
      <div class="card-image waves-effect waves-block waves-light">
        <img class="activator" src="static/images/robot.jpg">
      </div>
      <div class="card-content" col s2 m2 l2 xl2>
        <span class="card-title activator grey-text text-darken-4">${device.name}<i class="material-icons right">more_vert</i></span>
        <button class="btn waves-effect waves-light button-view" name="delete_button" id=delete_btn_${device.id}>
        <i class="small material-icons white-text">delete</i>
    </button>
    <button class="btn waves-effect waves-light button-view modal-trigger" name="update_button" id=update_${device.id} data-toggle='modal_${device.id}' data-target="update_modal">
       <i class="small material-icons white-text">edit</i>
    </button>
    <a href="#!" class="secondary-content">
          <p class="range-field">
            <input type="range" id="bar_${device.id}" min="0" max="100" value=${device.state} />
          </p>
        </a>
      </div>
      <div class="card-reveal">
        <span class="card-title grey-text text-darken-4">${device.name}<i class="material-icons right">close</i></span>
        <p>${device.description}.</p>
        <p>Type: ${device.type}.</p>
        <p>State: ${device.state}.</p>
      </div>
    </div>`;
      } else
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
    this.listDevices();
  }

  //Method to handle the response from the POST response
  public handlerPostResponse(status: number, response: string) {
    this.listDevices();
  }

  //Method to handle the response from the PUT response
  public handlerPutResponse(status: number, response: string) {
    this.listDevices();
  }
}

// INITIALIZE VARIABLES
window.onload = function inicio() {
  let miObjeto: Main = new Main();
  let buttons: Array<string> = ["add_button", "submit_btn_add", "submit_btn_update", "icon_btn", "list_btn" ];
  for (let button of buttons) {
    let btn = miObjeto.getElement(button);
    btn.addEventListener("click", miObjeto);
  }
  var elems = document.querySelectorAll(".modal");
  var instances = M.Modal.init(elems);
};

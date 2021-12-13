class Main implements EventListenerObject, GetResponseLister {
  private nombre: string;
  private lista: Array<Device> = new Array();
  private framework: FrameWork = new FrameWork();

  constructor() {
    this.list_devices();
  }

  public handleEvent(ev: Event) {
    let objetoEvento = <HTMLElement>ev.target;
    if (ev.type == "click") {
      console.log(objetoEvento);
      this.framework.requestGET("http://localhost:8000/devices", this);
    }
  }

  public getElement(id: string): HTMLElement {
    return document.getElementById(id);
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
            <i class="small material-icons red-text id="trash_${device.id}">delete</i>
        </button>
      </li>`;
    }

    for (let device of devices) {
      let device_bar = this.getElement("bar_" + device.id);
      let device_delete = this.getElement("trash_" + device.id);
      device_bar.addEventListener("click", this);
      device_delete.addEventListener("click", this);
    }
  }
}

window.onload = function inicio() {
  let miObjeto: Main = new Main();
  let boton = miObjeto.getElement("add_button");
  boton.addEventListener("click", miObjeto);
};

class Device {
  public id: Number;
  public name: String;
  public description: String;
  public state: number;
  public type: number;

  constructor(id: Number, nombre: String, email: String) {
    this.id = id;
    this.name = nombre;
    console.log("se creo un device");
  }
  mostrarDatos() {
    console.log(
      "Usuario id = " + this.id + "\n" + "nombre = " + this.name + "\n"
    );
  }
}

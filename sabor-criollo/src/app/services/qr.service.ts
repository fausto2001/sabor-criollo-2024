import { Injectable } from '@angular/core';
//import { CapacitorBarcodeScanner, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerScanResult } from '@capacitor/barcode-scanner'



@Injectable({
  providedIn: 'root'
})
export class QrService {

  constructor() { }

<<<<<<< HEAD
  /*
  async escanearDNI(){
=======
  /* async escanearDNI(){
>>>>>>> 4b912a0fbee83b87691916d173a203dd8224d767
    return this.obtenerDatosDNI(await CapacitorBarcodeScanner.scanBarcode(<CapacitorBarcodeScannerOptions>{
      cameraDirection: 1,
      hint: 5,
      scanOrientation: 3
    }));
<<<<<<< HEAD
  }*/


  /*
  private obtenerDatosDNI(result:CapacitorBarcodeScannerScanResult){
=======
  } */

  /* private obtenerDatosDNI(result:CapacitorBarcodeScannerScanResult){
>>>>>>> 4b912a0fbee83b87691916d173a203dd8224d767
    const informacion = result.ScanResult.split('@');
    const data = {
      nroTramite: informacion[0],
      apellido: informacion[1],
      nombre: informacion[2],
      genero: informacion[3],
      dni: informacion[4],
      ejemplar: informacion[5],
      fechaNacimiento: informacion[6],
      fechaVencimientoDni: informacion[7],
    }
    return data;
<<<<<<< HEAD
  }*/

    /*
  async escanearQR(){
=======
  } */

  /* async escanearQR(){
>>>>>>> 4b912a0fbee83b87691916d173a203dd8224d767
    return this.obtenerDatosQR(await CapacitorBarcodeScanner.scanBarcode(<CapacitorBarcodeScannerOptions>{
      cameraDirection: 1,
      hint: 5,
      scanOrientation: 3
    }));
<<<<<<< HEAD
  }*/

    /*
  private obtenerDatosQR(result:CapacitorBarcodeScannerScanResult){
    const informacion = result.ScanResult;
    return informacion;
  }*/
=======
  } */

  /* private obtenerDatosQR(result:CapacitorBarcodeScannerScanResult){
    const informacion = result.ScanResult;
    return informacion;
  } */

    
>>>>>>> 4b912a0fbee83b87691916d173a203dd8224d767
/*
  async escanearQR(){
    return await CapacitorBarcodeScanner.scanBarcode(<CapacitorBarcodeScannerOptions>{
      cameraDirection: 1,
      hint: 17,
      scanOrientation: 3
    }).then( (res:CapacitorBarcodeScannerScanResult) => {
      return res.ScanResult;
    });
  }


  }*/
}
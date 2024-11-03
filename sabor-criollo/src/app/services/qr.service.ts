import { Injectable } from '@angular/core';
import { CapacitorBarcodeScanner, CapacitorBarcodeScannerOptions, CapacitorBarcodeScannerScanResult } from '@capacitor/barcode-scanner'



@Injectable({
  providedIn: 'root'
})
export class QrService {

  constructor() { }

  async escanearDNI(){
    return this.obtenerDatosDNI(await CapacitorBarcodeScanner.scanBarcode(<CapacitorBarcodeScannerOptions>{
      cameraDirection: 1,
      hint: 5,
      scanOrientation: 3
    }));
  }

  private obtenerDatosDNI(result:CapacitorBarcodeScannerScanResult){
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
  }

  async escanearQR(){
    return this.obtenerDatosQR(await CapacitorBarcodeScanner.scanBarcode(<CapacitorBarcodeScannerOptions>{
      cameraDirection: 1,
      hint: 5,
      scanOrientation: 3
    }));
  }

  private obtenerDatosQR(result:CapacitorBarcodeScannerScanResult){
    const informacion = result.ScanResult;
    return informacion;
  }
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
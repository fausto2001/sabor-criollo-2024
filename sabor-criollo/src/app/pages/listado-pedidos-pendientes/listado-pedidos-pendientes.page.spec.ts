import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListadoPedidosPendientesPage } from './listado-pedidos-pendientes.page';

describe('ListadoPedidosPendientesPage', () => {
  let component: ListadoPedidosPendientesPage;
  let fixture: ComponentFixture<ListadoPedidosPendientesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoPedidosPendientesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

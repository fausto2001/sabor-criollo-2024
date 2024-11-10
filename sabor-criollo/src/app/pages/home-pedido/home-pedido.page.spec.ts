import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePedidoPage } from './home-pedido.page';

describe('HomePedidoPage', () => {
  let component: HomePedidoPage;
  let fixture: ComponentFixture<HomePedidoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePedidoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

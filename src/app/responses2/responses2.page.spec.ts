import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Responses2Page } from './responses2.page';

describe('Responses2Page', () => {
  let component: Responses2Page;
  let fixture: ComponentFixture<Responses2Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Responses2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

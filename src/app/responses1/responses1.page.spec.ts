import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Responses1Page } from './responses1.page';

describe('Responses1Page', () => {
  let component: Responses1Page;
  let fixture: ComponentFixture<Responses1Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Responses1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Question7Page } from './question7.page';

describe('Question7Page', () => {
  let component: Question7Page;
  let fixture: ComponentFixture<Question7Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Question7Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

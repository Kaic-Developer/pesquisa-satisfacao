import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Question4Page } from './question4.page';

describe('Question4Page', () => {
  let component: Question4Page;
  let fixture: ComponentFixture<Question4Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Question4Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Question10Page } from './question10.page';

describe('Question10Page', () => {
  let component: Question10Page;
  let fixture: ComponentFixture<Question10Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Question10Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

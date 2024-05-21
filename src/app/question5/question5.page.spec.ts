import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Question5Page } from './question5.page';

describe('Question5Page', () => {
  let component: Question5Page;
  let fixture: ComponentFixture<Question5Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Question5Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

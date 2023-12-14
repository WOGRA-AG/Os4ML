import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserIconComponent } from './user-icon.component';

describe('UserIconComponent', () => {
  let component: UserIconComponent;
  let fixture: ComponentFixture<UserIconComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserIconComponent],
    });
    fixture = TestBed.createComponent(UserIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

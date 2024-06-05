import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// FormBuilder is used to include FormGroup and FormControl
// FormGroup is used to include all input
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-todo',
  standalone: true, // used for include module in angular
  imports: [CommonModule, ReactiveFormsModule], // ReactiveFormsModule for creating Reactive Forms
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {
  todoForm: FormGroup;
  editForm: FormGroup;
  todos: string[] = [];
  isEditing: boolean = false;
  currentIndex: number | null = null;

// The constructor in an Angular component is a special function that is automatically called when an instance of the component is created. 
  constructor(private fb: FormBuilder) {
    this.todoForm = this.fb.group({
      task: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      task: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.isLocalStorageAvailable()) {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        this.todos = JSON.parse(savedTodos);
      }
    }
  }

  addTodo() {
    if (this.todoForm.valid) {
      this.todos.push(this.todoForm.value.task);
      this.todoForm.reset();
      this.saveTodos();
    }
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
    this.saveTodos();
  }

  editTodo() {
    if (this.editForm.valid && this.currentIndex !== null) {
      this.todos[this.currentIndex] = this.editForm.value.task;
      this.isEditing = false;
      this.currentIndex = null;
      this.editForm.reset();
      this.saveTodos();
    }
  }

  startEdit(index: number) {
    this.isEditing = true;
    this.currentIndex = index;
    this.editForm.setValue({ task: this.todos[index] });
  }

  saveTodos() {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('todos', JSON.stringify(this.todos));
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }
}
